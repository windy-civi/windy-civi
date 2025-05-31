from datetime import datetime
from pathlib import Path

from utils.io_utils import load_json_files
from utils.file_utils import ensure_session_mapping
from utils.interactive import clear_DATA_OUTPUT_FOLDER
from utils.process_utils import process_and_save


# Define state abbreviation and paths
STATE_ABBR = "usa"
BASE_FOLDER = Path(__file__).parent
INPUT_FOLDER = BASE_FOLDER / "scraped_state_data" / STATE_ABBR
DATA_OUTPUT = BASE_FOLDER / "data_output" / STATE_ABBR
DATA_PROCESSED_FOLDER = DATA_OUTPUT / "data_processed"
DATA_NOT_PROCESSED_FOLDER = DATA_OUTPUT / "data_not_processed"
EVENT_ARCHIVE_FOLDER = DATA_OUTPUT / "event_archive"
EVENT_ARCHIVE_FOLDER.mkdir(parents=True, exist_ok=True)
SESSION_LOG_PATH = DATA_OUTPUT / "new_sessions_added.txt"
BILL_SESSION_MAPPING_FILE = BASE_FOLDER / "bill_session_mapping" / f"{STATE_ABBR}.json"
SESSION_MAPPING = {}


def main():
    # 1. Clean previous outputs
    clear_DATA_OUTPUT_FOLDER(DATA_OUTPUT)

    # 2. Ensure session mapping is available
    SESSION_MAPPING.update(
        ensure_session_mapping(STATE_ABBR, BASE_FOLDER, INPUT_FOLDER)
    )

    # 3. Load and parse all input JSON files
    all_json_files = load_json_files(
        INPUT_FOLDER, EVENT_ARCHIVE_FOLDER, DATA_NOT_PROCESSED_FOLDER
    )

    # 4. Route and process by handler
    process_and_save(
        STATE_ABBR,
        all_json_files,
        DATA_NOT_PROCESSED_FOLDER,
        SESSION_MAPPING,
        SESSION_LOG_PATH,
        DATA_PROCESSED_FOLDER,
    )


if __name__ == "__main__":
    main()
