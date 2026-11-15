"""Rebuild the offline classifier and held-out evaluation with Python 3.12."""
import hashlib
import io
import json
import sys
import urllib.request
import zipfile
from pathlib import Path

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent
URL = "https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip"
DIGEST = "1587ea43e58e82b14ff1f5425c88e17f8496bfcdb67a583dbff9eefaf9963ce3"
archive = Path(sys.argv[1]).read_bytes() if len(sys.argv) > 1 else urllib.request.urlopen(URL, timeout=60).read()
assert hashlib.sha256(archive).hexdigest() == DIGEST, "Unexpected dataset version"
raw = zipfile.ZipFile(io.BytesIO(archive)).read("SMSSpamCollection").decode("utf8")
rows = [line.split("\t", 1) for line in raw.splitlines() if line.strip()]
unique = {}
for label, message in rows:
    assert label in {"ham", "spam"}
    key = " ".join(message.lower().split())
    if key in unique:
        assert unique[key][0] == label
    else:
        unique[key] = (label, message)
labels, messages = map(np.array, zip(*unique.values()))
train, test = train_test_split(np.arange(len(labels)), test_size=0.2, random_state=42, stratify=labels)
vectorizer = TfidfVectorizer(lowercase=False, token_pattern=r"[a-zA-Z0-9]+")
# Match the browser's ASCII tokenization and case folding.
import re
def normalize(message):
    return " ".join(word.lower() for word in re.findall(r"[A-Za-z0-9]+", message))

features = vectorizer.fit_transform([normalize(messages[i]) for i in train])
model = LogisticRegression(class_weight="balanced", solver="liblinear", random_state=42)
model.fit(features, labels[train])
held_out = vectorizer.transform([normalize(messages[i]) for i in test])
predictions = model.predict(held_out)
actual = labels[test]

def metrics(predicted):
    tn, fp, fn, tp = map(int, confusion_matrix(actual, predicted, labels=["ham", "spam"]).ravel())
    return dict(tn=tn, fp=fp, fn=fn, tp=tp, accuracy=(tp+tn)/len(test),
                precision=tp/(tp+fp) if tp+fp else None, recall=tp/(tp+fn))

errors = [{"text": str(messages[i]), "actual": str(labels[i]), "predicted": str(p)}
          for i, p in zip(test, predictions) if labels[i] != p][:5]
report = dict(raw=len(rows), unique=len(labels), train=len(train), test=len(test),
              model=metrics(predictions), baseline=metrics(["ham"]*len(test)), errors=errors)
(ROOT/"evaluation.json").write_text(json.dumps(report, indent=2), encoding="utf8")
weights = {word: [vectorizer.idf_[i], model.coef_[0,i]] for word,i in vectorizer.vocabulary_.items()}
payload = dict(weights=weights, bias=model.intercept_[0], report=report)
(ROOT/"model.js").write_text("const MODEL = "+json.dumps(payload)+";\n", encoding="utf8")
print(json.dumps(report, indent=2))
