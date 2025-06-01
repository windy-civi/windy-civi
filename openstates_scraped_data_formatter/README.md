# Open Civic Data Blockchain Builder

This project parses OpenStates-style legislative JSON files and saves them into a blockchain-style folder structure for versioned, transparent archival.

🛠️ Built with modular Python, real-time error tracking, and interactive recovery prompts

---

## Features

* Optional upload of source PDFs alongside bill processing (toggle enabled: default is turned off)
* Auto-delete of existing output folders before processing (toggle enabled: default is turned on)
* Saves each bill, event, and vote event into timestamped `.json` files
* Organizes output by session and bill identifier using nested folders. Each bill folder contains a logs/ directory for timestamped .json records (e.g. full bill texts, vote events) and a files/ directory reserved for any attachments or source PDFs.
* Logs every processing step to `data_processed/` and error cases to `data_not_processed/`
* Auto-creates placeholder files when votes reference missing bills
* Prompts user for missing `legislative_session` (optional toggle: default is on), enabling real-time error correction without restarting the script
* Tracks new sessions entered via prompt in `new_sessions_added.txt`
* Modular file structure using handlers/, utils/, and per-state blockchain/{state} folders for eventual action-based logging

---

## Project Structure

```plaintext
open_civic_data_by_type/
├── bill_session_mapping/           # Session-to-bill mappings
├── data_output/                    # Output destination for processed and error files
├── handlers/                       # Core bill, vote_event, and event handlers
│   ├── bill.py
│   ├── vote_event.py
│   └── event.py
├── postprocessors/
│   ├── event_bill_linker.py        # Links events to associated bills
│   └── helpers/                    # Post-processing tools
│       ├── extract_bill_ids_from_event.py
│       ├── find_session_from_bill_id.py
│       ├── load_bill_to_session_mapping.py
│       └── run_handle_event.py
├── scraped_state_data/            # Raw input files
├── sessions/                      # Session metadata or references
├── utils/                         # Utility modules for file I/O, processing, interactivity
│   ├── file_utils.py
│   ├── interactive.py
│   ├── io_utils.py
│   ├── merge_session_log.py
│   └── process_utils.py
├── .gitignore
└── main.py
```

---

## Output Structure

Bill output example:

```plaintext
data_output/
└── il/
    └── data_processed/
        └── country:us/
            └── state:il/
                └── sessions/
                    └── ocd-session/
                        └── country:us/
                            └── AM1030479/
                                ├── logs/
                                │   ├── 20250123T000000Z_entire_bill.json
                                │   ├── 20250306T000000Z_vote_event_pass.json
                                │   └── ...
                                └── files/  # reserved for attachments
```

Unprocessed output example:

```plaintext
data_output/
└── il/
    └── data_not_processed/
        ├── from_handle_bill_missing_identifier/
        ├── from_load_json_not_json/
        └── from_process_and_save_missing_legislative_session/
```

---

## Getting Started

### ⚙️ Configuration Notes

* To enable PDF uploads, set the `DOWNLOAD_PDFS = True` toggle in your configuration or state module. Found in `db_handlers/bill.py`. 
* To enable interactive prompts when clearing output directories set `ENABLE_DELETE_PROMPT = True ` . Found in `utils/interactive.py`

1. Ensure you have **Python 3.9+**
2. Clone the repo
3. Add your scraped `.json` files to `state_scraped_data/{state}/`

Run the pipeline:

```bash
python main.py
```

---

## Example Use Cases

* Archive legislative activity in a structured, tamper-evident way
* Monitor new actions on bills in real time
* Provide visibility into vote events tied to specific legislation
* Support civic engagement and open government initiatives

---

## Coming Soon

* [ ] Optional archiving of placeholder files once resolved
* [ ] CLI flags for batch vs interactive modes
* [ ] Scheduled Docker-based ingestion with auto-push to GitHub

---

## 👩‍💻 Contributors

* **Tamara Dowis**
  [GitHub](https://github.com/wanderlust-create) | [LinkedIn](https://www.linkedin.com/in/tamara-dowis/)
* 🤖 With pair programming support from her AI assistant "Hypatia" (powered by ChatGPT)

Created for the Chicago-based Windy Civi civic tech community 🏩

---

## 🛡 License

Distributed under the [MIT License](LICENSE).
Free to use, modify, and build upon.
Civic data belongs to the people.
