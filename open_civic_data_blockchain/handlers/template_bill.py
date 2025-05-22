"""
TEMPLATE FILE — COPY THIS TO YOUR STATE FOLDER

This is a reference implementation of a handler for bill data.
Customize it for your state's data structure and session logic.
"""

from pathlib import Path
import json
from utils.file_utils import format_timestamp, record_error_file, write_action_logs


def handle_bill(content, session_folder, output_folder, error_folder, filename):
    """
        Handles a bill JSON file by saving:

    1. A full snapshot of the bill in logs/ using the earliest action date
    2. One separate JSON file per action in logs/, each timestamped and slugified
    3. A files/ directory placeholder (created but not populated here)

    Skips and logs errors if required fields (e.g. identifier) are missing.

    Args:
        content (dict): The parsed bill JSON object.
        session_folder (str): The folder name for the legislative session (e.g. "2023-2024").
        output_folder (Path): Base path where processed data should be saved.
        error_folder (Path): Base path where unprocessable files should be routed.
        filename (str): The original filename (used in logs and error tracking).
    """
    bill_identifier = content.get("identifier")
    if not bill_identifier:
        print("⚠️ Warning: Bill missing identifier")
        record_error_file(
            error_folder,
            "from_handle_bill_missing_identifier",
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
        bill_identifier,
    )
    (save_path / "logs").mkdir(parents=True, exist_ok=True)
    (save_path / "files").mkdir(parents=True, exist_ok=True)

    actions = content.get("actions", [])
    if actions:
        dates = [a.get("date") for a in actions if a.get("date")]
        timestamp = format_timestamp(sorted(dates)[0]) if dates else None
    else:
        timestamp = None

    if not timestamp:
        print(f"⚠️ Warning: Bill {bill_identifier} missing action dates")
        timestamp = "unknown"

    # Save entire bill
    full_filename = f"{timestamp}_entire_bill.json"
    output_file = save_path.joinpath("logs", full_filename)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)
    print(f"✅ Saved bill {bill_identifier}")

    # Save each action as a separate file
    if actions:
        write_action_logs(actions, bill_identifier, save_path / "logs")
