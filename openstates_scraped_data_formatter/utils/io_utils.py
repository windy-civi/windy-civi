import os
import json
from utils.file_utils import record_error_file


def load_json_files(input_folder, EVENT_ARCHIVE_FOLDER, ERROR_FOLDER):
    all_data = []
    for filename in os.listdir(input_folder):
        if filename.endswith(".json"):
            filepath = os.path.join(input_folder, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    all_data.append((filename, data))

                    # Archive all event_*.json files to a centralized folder
                    # These files often lack a legislative_session and are skipped by the main processor
                    # This preserves raw event data for post-processing, analysis,
                    # or bill association steps later in the pipeline
                    if filename.startswith("event_"):
                        EVENT_ARCHIVE_FOLDER.mkdir(parents=True, exist_ok=True)

                        # If file exists in missing_session, remove it before archiving
                        missing_event_file = ERROR_FOLDER / "missing_session" / filename
                        if missing_event_file.exists():
                            missing_event_file.unlink()

                        archive_path = EVENT_ARCHIVE_FOLDER / filename
                        with open(archive_path, "w", encoding="utf-8") as archive_f:
                            json.dump(data, archive_f, indent=2)

            except json.JSONDecodeError:
                print(f"❌ Skipping {filename}: could not parse JSON")
                with open(filepath, "r", encoding="utf-8") as f:
                    raw_text = f.read()
                record_error_file(
                    ERROR_FOLDER,
                    "invalid_json",
                    filename,
                    {"error": "Could not parse JSON", "raw": raw_text},
                    original_filename=filename,
                )
    return all_data
