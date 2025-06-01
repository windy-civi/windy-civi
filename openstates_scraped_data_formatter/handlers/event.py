from pathlib import Path
import json
import re
from utils.file_utils import record_error_file, format_timestamp
def clean_event_name(name: str) -> str:
    return re.sub(r"[^\w]+", "_", name.lower()).strip("_")[:40]

def handle_event(
    STATE_ABBR,
    content,
    session_name,
    output_folder,
    error_folder,
    filename,
    referenced_bill_id,
):
    """
    Saves event JSON to the correct session folder under events/logs,
    using a consistent timestamped format to match bill action logs.
    """
    event_id = content.get("_id") or filename.replace(".json", "")
    start_date = content.get("start_date")
    if not start_date:
        print(f"⚠️ Event {event_id} missing start_date")
        record_error_file(
            error_folder,
            "from_handle_event_missing_start_date",
            filename,
            content,
            original_filename=filename,
        )
        return False

    timestamp = format_timestamp(start_date)
    event_name = content.get("name", "event")
    short_name = clean_event_name(event_name)

    save_path = Path(output_folder).joinpath(
        f"country:us",
        f"state:{STATE_ABBR}",
        "sessions",
        "ocd-session",
        f"country:us",
        f"state:{STATE_ABBR}",
        session_name,
        "bills",
        referenced_bill_id,
    )
    (save_path / "logs").mkdir(parents=True, exist_ok=True)
    (save_path / "files").mkdir(parents=True, exist_ok=True)

    output_file = (
        save_path / "logs" / f"{timestamp}_additional_event__{short_name}.json"
    )
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)

    print(f"✅ Saved event: {referenced_bill_id}")
    return True
