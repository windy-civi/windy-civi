# handlers/README.md

# 🧰 Handler Templates for Open Civic Data Blockchain Builder

This folder contains **template handlers** for processing scraped Open States JSON files.
These are not used directly — instead, you should copy and customize them for each state in `blockchain/{state}/`.

---

## 🗃️ Available Templates

| File | Purpose |
|------|---------|
| `template_bill.py` | Saves each bill to `logs/` and `files/` folders with per-action logs |
| `template_vote_event.py` | Saves each vote_event under the referenced bill's `logs/` folder |
| `template_other.py` | Catches unclassified JSONs (e.g., organizations, jurisdictions) |

---

## ✨ Usage

1. **Copy the Template to Your State Folder**

```bash
cp handlers/template_bill.py blockchain/tx/bills.py
cp handlers/template_vote_event.py blockchain/tx/vote_event.py
cp handlers/template_other.py blockchain/tx/other.py
```

2. **Edit it to Fit Your State's Needs**

The default templates assume the file has fields like `identifier` and `legislative_session`.
If your structure differs, modify accordingly.

3. **Register Your Handler in `__init__.py`**

```python
from .bills import handle_bill
from .vote_event import handle_vote_event
from .other import handle_other
```

4. **That's it!** `main.py` will dynamically load your state’s handler using the `STATE_NAME`.

---

## 📁 Output Directory Structure

The default templates save to:

```
blockchain/{state}/data_processed/country:us/state:{state}/sessions/ocd-session/country:us/state:{state}/{session}/[bills|events]/
```

Use this format unless your team decides otherwise.

---

## 🧪 Testing Tip

Add a single `.json` file to your input folder and run:

```bash
python blockchain/{state}/main.py
```

Then check `data_processed/` and `data_not_processed/` to verify output.

---

## 🔄 Future Expansion

You can add more templates here as needed: e.g., `template_committee.py`, `template_hearing.py`, etc.

Happy structuring! ✨
