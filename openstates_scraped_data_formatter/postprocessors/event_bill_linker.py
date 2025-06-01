import json
from pathlib import Path
from postprocessors.helpers import (
    load_bill_to_session_mapping,
    find_session_from_bill_id,
    extract_bill_ids_from_event,
    run_handle_event,
)
from utils.file_utils import list_json_files

def link_events_to_bills_pipeline(
    state_abbr: str,
    event_archive_folder: Path,
    data_processed_folder: Path,
    data_not_processed_folder: Path,
    bill_to_session_file: Path,
):
    """
    Main pipeline for linking events to bills and saving them in the correct folder.
    """
    print("\n📦 Starting event-to-bill linking pipeline")

    bill_to_session = load_bill_to_session_mapping(
        bill_to_session_file, data_processed_folder
    )
    if not bill_to_session:
        print("⚠️ Bill-to-session mapping is empty. Rebuilding from processed data...")
        bill_to_session = load_bill_to_session_mapping(
            bill_to_session_file, data_processed_folder, force_rebuild=True
        )
    print(f"📂 Loaded {len(bill_to_session)} bill-session mappings")

    skipped = []
    for event_file in list_json_files(event_archive_folder):
        with open(event_file) as f:
            content = json.load(f)

        bill_ids = extract_bill_ids_from_event(content)
        if not bill_ids:
            continue

        for bill_id in bill_ids:
            session_name = find_session_from_bill_id(bill_id, bill_to_session)
            if session_name:
                run_handle_event(
                    state_abbr,
                    content,
                    session_name,
                    data_processed_folder,
                    data_not_processed_folder,
                    bill_id,
                    filename=event_file.name,
                )
                event_file.unlink()
                missing_path = (
                    data_not_processed_folder / "missing_session" / event_file.name
                )
                if missing_path.exists():
                    missing_path.unlink()
                break
        else:
            skipped.append((event_file, bill_ids))

    if skipped:
        bill_to_session = load_bill_to_session_mapping(
            bill_to_session_file, data_processed_folder, force_rebuild=True
        )

        for event_file, bill_ids in skipped:
            for bill_id in bill_ids:
                session_name = find_session_from_bill_id(bill_id, bill_to_session)
                if session_name:
                    with open(event_file) as f:
                        content = json.load(f)
                    run_handle_event(
                        state_abbr,
                        content,
                        session_name,
                        data_processed_folder,
                        data_not_processed_folder,
                        filename=event_file.name,
                        referenced_bill_id=bill_id,
                    )
                    event_file.unlink()
                    missing_path = (
                        data_not_processed_folder / "missing_session" / event_file.name
                    )
                    if missing_path.exists():
                        missing_path.unlink()
                    break

    print("\n✅ Event-to-bill linking complete")
