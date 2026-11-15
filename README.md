# ScamShield AI
An offline English SMS checker for a student deciding whether to act on an unexpected money-related text. **Open index.html** in a modern browser with the accompanying files in the same directory. Choose **Try an example → Check message**. Expand the evaluation to inspect five genuine errors.

## Reproduce the experiment
From this directory, with Python 3.12 on Windows:
```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python train.py
```
On macOS/Linux use `.venv/bin/python` for the last two commands. The script downloads the public UCI ZIP and verifies its SHA-256. Offline, pass a previously downloaded UCI ZIP as the first argument. It regenerates model.js and evaluation.json. The app itself needs neither Python nor internet access.

## Read the project
- [One-page write-up and credits](WRITEUP.md)
- [Two-minute demo](DEMO.md)
- [Объяснение для Софии](ARCHITECTURE-RU.md)
- [Measured results and five public examples](evaluation.json)

train.py fits the vectorizer and logistic regression on training rows only. classify.js uses the exported IDF values, coefficients and intercept. app.js displays the result and separately marks safety cues. No backend, analytics, message logs or persistent browser storage. The public examples in evaluation.json are fixed benchmark records. Pasted text is held only in page memory and Clear removes the input and output.

The classifier metrics include all test rows. In the browser the raw predictions matched Python on all 1,032 rows. The interface withheld three labels because their texts contained no training vocabulary. Similar templates can survive deduplication, so these results may overstate performance on unfamiliar campaigns.

This project is a prototype and is not financial advice.
