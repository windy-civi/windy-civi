# 🏛️ OpenStates Scraped Data to DB

This repo contains the minimal code needed to load structured OpenStates data into a database for use by the [Windy Civi](https://github.com/windy-civi/windy-civi) civic tech project.

---

## 📆 What This Does

* Inserts normalized `bills`, `events`, and `vote_events` JSON data into a Postgres database
* Uses clean, modular Python scripts separated by purpose:

  * `db/` – logic for inserting data
  * `utils/` – helpers for loading JSON, session mapping, etc.

---

## 📁 Folder Structure

```bash
openstates_scraped_data_to_db/
├── db/                  # Insertion logic (bill.py, event.py, vote_event.py)
├── utils/               # General-purpose helpers
├── scraped_state_data/  # 📅 Where OpenStates scraped data lives (not tracked)
├── data_output/         # 📄 Where cleaned, transformed data is stored (not tracked)
├── sessions/            # 📂  Tracks session mappings (not tracked)
├── main.py              # Entry point for loading data
├── .gitignore           # Keeps folders clean
└── README.md            # You are here
```

---

## 🚫 What’s Not Included

To keep the repo lightweight and focused:

* No actual data files are included
* No post-processing logic is included (e.g. action-based blockchain logs)

These folders are present but empty, tracked with `.gitkeep`:

* `scraped_state_data/`
* `data_output/`
* `sessions/`

---

## 🧪 How to Use

1. Add OpenStates JSON data to the appropriate folder:

   ```
   scraped_state_data/[STATE_ABBR]/
   ```

   For example, if your folder is `scraped_state_data/il`, set `STATE_ABBR = "il"`.

2. In `main.py`, update the `STATE_ABBR` variable:

   ```python
   STATE_ABBR = "il"  # or "tx", etc.
   ```

3. Run the main loader:

   ```bash
   python main.py
   ```

---

## 🤝 Part of Windy Civi

This code supports the Windy Civi initiative to make local and state legislation more transparent and accessible.

🔗 Contributed to: [windy-civi/windy-civi](https://github.com/windy-civi/windy-civi/tree/60-blockchain-open-civic-data)
