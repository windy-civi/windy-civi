import os
import json
import shutil
import sys
from pathlib import Path
from datetime import datetime

# -------------------------
# CONFIGURATION
# -------------------------
SESSION_MAPPING = {
    "104th": "2023-2024",
    "103rd": "2021-2022",
    # Add more mappings later
}

# -------------------------
# HELPERS
# -------------------------
def format_timestamp(date_str):
    try:
        dt = datetime.fromisoformat(date_str)
        return dt.strftime("%Y%m%dT%H%M%SZ")
    except Exception:
        return None


# -------------------------
# HANDLERS
# -------------------------
def handle_bill(content, session_folder, output_folder):
    bill_identifier = content.get("identifier")
    if not bill_identifier:
        print("⚠️ Warning: Bill missing identifier")
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
        if dates:
            first_date = sorted(dates)[0]
            timestamp = format_timestamp(first_date)
        else:
            timestamp = None
    else:
        timestamp = None

    if not timestamp:
        print(f"⚠️ Warning: Bill {bill_identifier} missing action dates")
        timestamp = "unknown"

    filename = f"{timestamp}_bill_created.json"
    output_file = save_path.joinpath("logs", filename)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)
    print(f"✅ Saved bill {bill_identifier}")


def handle_vote_event(content, session_folder, output_folder):
    referenced_bill_id = content.get("bill_identifier")
    if not referenced_bill_id:
        print("⚠️ Warning: Vote missing bill_identifier")
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

    placeholder_file = save_path / "placeholder.json"
    if not placeholder_file.exists():
        placeholder_content = {"identifier": referenced_bill_id, "placeholder": True}
        with open(placeholder_file, "w", encoding="utf-8") as f:
            json.dump(placeholder_content, f, indent=2)
        print(f"📝 Created placeholder for missing bill {referenced_bill_id}")

    start_date = content.get("start_date")
    timestamp = format_timestamp(start_date) if start_date else None

    if not timestamp:
        print(f"⚠️ Warning: Vote event missing start_date")
        timestamp = "unknown"

    filename = f"{timestamp}_vote_event.json"
    file_id = content.get("_id", "unknown_id")
    output_file = save_path.joinpath("logs", filename)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)
    print(f"✅ Saved vote event {file_id} under bill {referenced_bill_id}")


def handle_other(content, session_folder, output_folder):
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

    file_id = content.get("_id", None)
    if not file_id:
        print("⚠️ Warning: Unknown file missing _id")
        return

    event_file = save_path / f"{file_id}.json"
    with open(event_file, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)
    print(f"🔹 Saved unclassified file {file_id}")


# -------------------------
# MAIN SCRIPT
# -------------------------
def load_json_files(input_folder):
    all_data = []
    for filename in os.listdir(input_folder):
        if filename.endswith(".json"):
            filepath = os.path.join(input_folder, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                all_data.append((filename, data))
    return all_data


def clear_output_folder(output_folder):

    if os.path.exists(output_folder) and not os.path.isdir(output_folder):
        print(f"🛑 Aborting program, '{output_folder}' is not a folder.")
        sys.exit(1)

    if os.listdir(output_folder):
        if not sys.stdin.isatty():
            print("🛑 Aborting program, output folder not empty.")
            sys.exit(1)

        confirm = (
            input(
                f"⚠️ This will delete everything in {output_folder}. Are you sure? (yes/no): "
            )
            .strip()
            .lower()
        )
        if confirm == "yes":
            shutil.rmtree(output_folder)
            print(f"🧹 Cleared existing output folder: {output_folder}")
        else:
            print("🛑 Aborted clearing output folder.")


def process_and_save(data, output_folder):
    for filename, content in data:
        session_name = content.get("legislative_session")
        if not session_name:
            print(f"⚠️ Warning: Skipping {filename}, missing legislative_session")
            continue

        session_folder = SESSION_MAPPING.get(session_name)
        if not session_folder:
            print(f"⚠️ Warning: Unknown session {session_name} for {filename}")
            continue

        if "bill_" in filename:
            handle_bill(content, session_folder, output_folder)
        elif "vote_event_" in filename:
            handle_vote_event(content, session_folder, output_folder)
        else:
            handle_other(content, session_folder, output_folder)


def main():
    input_folder = os.getenv("BUILDER_INPUT_FOLDER", "./input")
    output_folder = os.getenv("BUILDER_OUTPUT_FOLDER", "./output")
    clear_output_folder(output_folder)
    all_json_files = load_json_files(input_folder)
    process_and_save(all_json_files, output_folder)


if __name__ == "__main__":
    main()
