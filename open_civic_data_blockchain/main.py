# blockchain/main.py (generic for all states)

import os
import sys
import json
from pathlib import Path
from datetime import datetime
import importlib.util

from utils.file_utils import record_error_file
from utils.interactive import prompt_for_session_fix, clear_output_folder

# -------------------------
# CONFIGURATION (generic)
# -------------------------

STATE_ABBR = "il"
BASE_FOLDER = Path(__file__).resolve().parent
INPUT_FOLDER = BASE_FOLDER / "sample_scraped_data" / STATE_ABBR
STATE_FOLDER = BASE_FOLDER / "blockchain" / STATE_ABBR
DATA_OUTPUT = BASE_FOLDER / "data_output" / STATE_ABBR
ERROR_FOLDER = DATA_OUTPUT / "data_not_processed"
OUTPUT_FOLDER = DATA_OUTPUT / "data_processed"
SESSION_LOG_PATH = DATA_OUTPUT / "new_sessions_added.txt"

ALLOW_SESSION_FIX = True

# Dynamically load the state module (__init__.py)
init_file = STATE_FOLDER / "__init__.py"
spec = importlib.util.spec_from_file_location(STATE_ABBR, init_file)
handlers_module = importlib.util.module_from_spec(spec)
sys.modules[STATE_ABBR] = handlers_module
spec.loader.exec_module(handlers_module)

# Extract handlers from the loaded module
handle_bill = getattr(handlers_module, "handle_bill", None)
handle_vote_event = getattr(handlers_module, "handle_vote_event", None)
handle_other = getattr(handlers_module, "handle_other", None)
SESSION_MAPPING = getattr(handlers_module, "SESSION_MAPPING", {})


def load_json_files(input_folder):
    all_data = []
    for filename in os.listdir(input_folder):
        if filename.endswith(".json"):
            filepath = os.path.join(input_folder, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    all_data.append((filename, data))
            except json.JSONDecodeError:
                print(f"\u274c Skipping {filename}: could not parse JSON")
                with open(filepath, "r", encoding="utf-8") as f:
                    raw_text = f.read()
                record_error_file(
                    ERROR_FOLDER,
                    "from_load_json_not_json",
                    filename,
                    {"error": "Could not parse JSON", "raw": raw_text},
                    original_filename=filename,
                )
    return all_data


def process_and_save(data, output_folder, error_folder):
    for filename, content in data:
        session_name = content.get("legislative_session")

        if not session_name:
            print(f"\u26a0\ufe0f Skipping {filename}, missing legislative_session")
            record_error_file(
                error_folder,
                "from_process_and_save_missing_legislative_session",
                filename,
                content,
                original_filename=filename,
            )
            continue

        session_folder = SESSION_MAPPING.get(session_name)
        if not session_folder:
            if ALLOW_SESSION_FIX:
                new_session = prompt_for_session_fix(
                    filename, session_name, log_path=SESSION_LOG_PATH
                )
                if new_session:
                    SESSION_MAPPING[session_name] = new_session
                    session_folder = new_session
                    print(f"\u2705 Mapped '{session_name}' to '{new_session}'")
                else:
                    record_error_file(
                        error_folder,
                        "from_process_and_save_unknown_session",
                        filename,
                        content,
                        original_filename=filename,
                    )
                    continue
            else:
                record_error_file(
                    error_folder,
                    "from_process_and_save_unknown_session",
                    filename,
                    content,
                    original_filename=filename,
                )
                continue

        # Dispatch to appropriate handler
        if "bill_" in filename and handle_bill:
            handle_bill(content, session_folder, output_folder, error_folder, filename)
        elif "vote_event_" in filename and handle_vote_event:
            handle_vote_event(
                content, session_folder, output_folder, error_folder, filename
            )
        elif handle_other:
            handle_other(content, session_folder, output_folder, error_folder, filename)

    print("\n\u2705 File processing complete.")


def main():
    clear_output_folder(DATA_OUTPUT)
    all_json_files = load_json_files(INPUT_FOLDER)
    process_and_save(all_json_files, OUTPUT_FOLDER, ERROR_FOLDER)


if __name__ == "__main__":
    main()
