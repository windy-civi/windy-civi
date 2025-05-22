from pathlib import Path
import json

from utils.file_utils import format_timestamp, record_error_file, write_vote_event_log


def handle_vote_event(content, session_folder, output_folder, error_folder, filename):
    """
    Handles a vote_event JSON file by:

    1. Creating the associated bill folder (and placeholder if missing)
    2. Saving the full vote_event as a timestamped log file using result info
       Format: YYYYMMDDT000000Z_vote_event_<result>.json

    Skips and logs errors if bill_identifier is missing.

    Args:
        content (dict): Parsed JSON vote event.
        session_folder (str): Folder name for the legislative session.
        output_folder (Path): Base path for processed output.
        error_folder (Path): Base path for logging unprocessable files.
        filename (str): Original filename (used in logs).
    """
    referenced_bill_id = content.get("bill_identifier")
    if not referenced_bill_id:
        print("⚠️ Warning: Vote missing bill_identifier")
        record_error_file(
            error_folder,
            "from_handle_vote_event_missing_bill_identifier",
            filename,
            content,
            original_filename=filename,
        )
        return

    save_path = Path(output_folder).joinpath(
        "country:us",
        "state:il",
        "sessions",
        "ocd-session",
        "country:us",
        "state:il",
        session_folder,
        "bills",
        referenced_bill_id,
    )
    (save_path / "logs").mkdir(parents=True, exist_ok=True)
    (save_path / "files").mkdir(parents=True, exist_ok=True)

    # Add placeholder if bill doesn't exist
    placeholder_file = save_path / "placeholder.json"
    if not placeholder_file.exists():
        placeholder_content = {"identifier": referenced_bill_id, "placeholder": True}
        with open(placeholder_file, "w", encoding="utf-8") as f:
            json.dump(placeholder_content, f, indent=2)
        print(f"📝 Created placeholder for missing bill {referenced_bill_id}")

    # Save the full vote_event log
    write_vote_event_log(content, referenced_bill_id, save_path / "logs")
    print(
        f"✅ Saved vote event {content.get('_id', 'unknown_id')} under bill {referenced_bill_id}"
    )
