from pathlib import Path
import json
from utils.file_utils import record_error_file


def handle_other(content, session_folder, output_folder, error_folder, filename):
    """
    Handles unclassified files (not bills or vote events).
    Saves the full file to the events folder for the correct session.
    Logs files missing _id.

    Args:
        content (dict): Parsed JSON for the file.
        session_folder (str): Mapped session folder name.
        output_folder (Path): Path to data_processed.
        error_folder (Path): Path to data_not_processed.
        filename (str): Original input filename for logging.
    """
    file_id = content.get("_id")
    if not file_id:
        print(f"⚠️ Warning: File {filename} missing _id")
        record_error_file(
            error_folder,
            "from_handle_other_missing_id",
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
        "events",
    )
    save_path.mkdir(parents=True, exist_ok=True)

    event_file = save_path / f"{file_id}.json"
    with open(event_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)

    print(f"🔹 Saved unclassified file {file_id}")
