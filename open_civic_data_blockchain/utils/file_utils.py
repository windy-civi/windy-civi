import re
from datetime import datetime
import json
from pathlib import Path


def format_timestamp(date_str):
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.strftime("%Y%m%dT%H%M%SZ")
    except Exception:
        return None


def record_error_file(
    error_folder, category, filename, content, original_filename=None
):
    folder = Path(error_folder) / category
    folder.mkdir(parents=True, exist_ok=True)
    if original_filename:
        content["_original_filename"] = original_filename
    with open(folder / filename, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)


def slugify(text, max_length=100):
    """
    Converts a string to a safe, lowercase, underscore-separated slug.
    Strips punctuation and truncates long filenames.
    """
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)  # remove punctuation
    text = re.sub(r"\s+", "_", text)  # convert spaces to underscores
    text = text.strip("_")
    return text[:max_length]


def write_action_logs(actions, bill_identifier, log_folder):
    """
    Writes one JSON file per action for a bill.

    Each file is named: YYYYMMDDT000000Z_<slugified_description>.json
    File contents: { "action": {action}, "bill_id": <bill_identifier> }
    """
    for action in actions:
        date = action.get("date")
        desc = action.get("description", "no_description")
        timestamp = format_timestamp(date) if date else "unknown"
        slug = slugify(desc)

        filename = f"{timestamp}_{slug}.json"
        output_file = Path(log_folder) / filename

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump({"action": action, "bill_id": bill_identifier}, f, indent=2)


def write_vote_event_log(vote_event, bill_identifier, log_folder):
    """
    Saves a single vote_event file as a timestamped log with result-based suffix.

    Filename: YYYYMMDDT000000Z_vote_event_<result>.json
    """
    date = vote_event.get("start_date")
    timestamp = format_timestamp(date) if date else "unknown"
    result = vote_event.get("result", "unknown")
    filename = f"{timestamp}_vote_event_{slugify(result)}.json"

    output_file = Path(log_folder) / filename
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(vote_event, f, indent=2)
