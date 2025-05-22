# Blockchain Folder Builder for Open Civic Data Files

This Python script processes civic JSON files (bills, vote events, and others) and organizes them into a blockchain-style folder and file structure for permanent archival and easy GitHub management.

---

## Features

- Parses civic JSON input files (`bill_`, `vote_event_`, and others)
- Dynamically dispatches processing based on file type
- Extracts timestamps directly from event metadata (not file creation dates)
- Saves files into a blockchain-style nested folder structure:
  ```
  /country:us/state:il/sessions/ocd-session/country:us/state:il/2023-2024/bills/SB1234/logs/...
  /country:us/state:il/sessions/ocd-session/country:us/state:il/2023-2024/bills/SB1234/files/...
  ```
- Automatically creates placeholder bills when vote events reference missing bills
- Names JSON files using ISO8601 timestamps + event type (e.g., `20250312T000000Z_vote_event.json`)
- Modular codebase with separate handlers:
  - `handle_bill(content)`
  - `handle_vote_event(content)`
  - `handle_other(content)`
  - `format_timestamp(date_str)`

---

## How to Run

- Update `INPUT_FOLDER` and `OUTPUT_FOLDER` variables in `main.py` as needed.
- When running the script, it will automatically ask if you want to delete the existing `OUTPUT_FOLDER` before starting.
- If you confirm, it will clear the output for a clean run.
- A `sample_input_files/` folder is included for testing the script with a small dataset.cd

```bash
python main.py
```

---

## Notes

- Session mapping is currently hardcoded for `104th` → `2023-2024` and `103rd` → `2021-2022`. Extend `SESSION_MAPPING` as needed.
- Folder structure is based on Open Civic Data conventions.
- Placeholder bills are marked with `"placeholder": true` in their JSON files until full bill information is available.

---

## Author

_Originally created by Tamara Dowis, April 2025, with assistance from Hypatia (AI pair programmer)._
