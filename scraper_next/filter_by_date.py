#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime, timezone
from dateutil import parser as date_parser

# ——— CONFIG ———
SCRIPT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = SCRIPT_DIR / "config.json"

# where GitHub Actions puts the scraped data
INPUT_ROOT = SCRIPT_DIR / "input_files"
INPUT_DIRS = [
    INPUT_ROOT / "il" / "_data",
    INPUT_ROOT / "usa" / "_data",
]
# ————————

def load_config():
    if not CONFIG_PATH.exists():
        CONFIG_PATH.write_text(json.dumps({"last_scrape_date": None}, indent=2))
    cfg = json.loads(CONFIG_PATH.read_text())
    dt_str = cfg.get("last_scrape_date")
    if not dt_str:
        return None
    dt = date_parser.isoparse(dt_str)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt

def save_config(dt: datetime):
    cfg = {"last_scrape_date": dt.astimezone(timezone.utc).isoformat()}
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2))

def normalize(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

def get_latest_date(record: dict):
    dates = []
    for sec in ("actions", "versions"):
        for item in record.get(sec, []):
            d = item.get("date")
            if not d:
                continue
            try:
                parsed = normalize(date_parser.isoparse(d))
                dates.append(parsed)
            except Exception:
                pass
    return max(dates) if dates else None

def main():
    cutoff = load_config()
    all_seen = []
    deleted = 0

    for input_dir in INPUT_DIRS:
        if not input_dir.exists():
            continue

        for fn in input_dir.rglob("bill_*.json"):
            try:
                rec = json.loads(fn.read_text())
            except Exception as e:
                print(f"[WARN] could not parse {fn}: {e}")
                continue

            latest = get_latest_date(rec)
            if not latest:
                continue

            all_seen.append(latest)
            # delete if we have a cutoff and this record is not newer
            if cutoff is not None and latest <= cutoff:
                fn.unlink()
                print(f"[DELETE] {fn} (date {latest.isoformat()})")
                deleted += 1

    if all_seen:
        new_cutoff = max(all_seen)
        save_config(new_cutoff)

    print(f"\nDone. {deleted} file(s) deleted.")
    print("New last_scrape_date =", new_cutoff.isoformat() if all_seen else cutoff)

if __name__ == "__main__":
    main()
