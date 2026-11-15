# ScamShield AI
**Track** · AI + Finance   **Team** · Sofia

**The problem.** A student receives a prize text before school. Opening its link could expose account details. ScamShield gives the student a chance to inspect the wording first.

**What we built and added.** Paste a public or synthetic English SMS to see a spam or ham prediction. The browser shows which familiar words pushed the score toward spam. A separate set of rules highlights links, pressure, rewards and requests for secrets, including in messages predicted as ham. The text stays on the device.

**How it works.** We used the brief’s scam text filter project (§4.2.1). From 5,574 labelled UCI messages, we kept 5,159 after merging texts identical apart from case or whitespace. The collection supplies no message dates. A stratified split with seed 42 reserved 1,032 messages for testing. We trained TF-IDF and class-balanced logistic regression on the other 4,127. The linear model lets us show the contribution of individual words.

**Held-out results.**

| Method | Accuracy | Spam precision | Spam recall | False alarms | Missed spam |
|---|---:|---:|---:|---:|---:|
| Always ham | 87.60% | Undefined (zero alerts) | 0% | 0 | 128 |
| ScamShield | 98.16% | 91.60% | 93.75% | 11 | 8 |

The model caught 120 of 128 spam messages. Its first false alarm includes “once free please call me.” The word *free* can describe someone’s schedule as easily as a promotional offer. A missed spam text reads like a casual callback request. These are possible explanations. Five actual mistakes are visible in the app. Scores cover every model prediction, including three for which the interface displays an insufficient-vocabulary notice.

**Next step.** Test on a separate, labelled set of contemporary synthetic bank impersonation messages. The collection labels spam, which does not establish whether the sender committed fraud. Do not click suspicious links. Open your bank’s app independently.

This project is a prototype and is not financial advice.

**Sources and credits.** Veritas AI, *International High School Hackathon 2026 Project Briefs*, §§3, 4.2.1 and 5 (supplied PDF). Almeida & Hidalgo, [SMS Spam Collection, UCI](https://doi.org/10.24432/C5CC84), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Training used [Python](https://python.org), [NumPy](https://numpy.org) and [scikit-learn](https://scikit-learn.org). [ChatGPT](https://chatgpt.com) assisted with project selection. [OpenAI Codex](https://openai.com/codex/) assisted with implementation, experiments, testing and drafting materials.
