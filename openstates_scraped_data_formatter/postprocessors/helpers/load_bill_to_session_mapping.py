import json
from pathlib import Path
from utils.file_utils import list_json_files


def load_bill_to_session_mapping(
    mapping_file: Path, data_processed_folder: Path, force_rebuild: bool = False
) -> dict:
    """
    Loads or rebuilds a mapping from bill IDs to session names.

    If the mapping file exists and force_rebuild is False, load it.
    Otherwise, walk the processed data folders and build a new mapping.

    Args:
        mapping_file (Path): Path to the bill-session mapping JSON.
        data_processed_folder (Path): Root of the structured output data.
        force_rebuild (bool): If True, rebuild the mapping from scratch.

    Returns:
        dict: A dictionary mapping bill identifiers to session names.
    """
    if mapping_file.exists() and not force_rebuild:
        print(f"📂 Loading existing bill-to-session mapping from {mapping_file}")
        with open(mapping_file, "r", encoding="utf-8") as f:
            return json.load(f)

    print("🔄 Rebuilding bill-to-session mapping from saved bill data...")

    bill_to_session = {}

    sessions_root = data_processed_folder / "country:us"
    for bill_folder in sessions_root.glob(
        "state:*/sessions/ocd-session/country:us/state:*/*/bills/*"
    ):
        if bill_folder.is_dir():
            bill_id = bill_folder.name
            session_name = bill_folder.parent.parent.name
            bill_to_session[bill_id] = session_name

    # Save the rebuilt mapping for future use
    mapping_file.parent.mkdir(parents=True, exist_ok=True)
    with open(mapping_file, "w", encoding="utf-8") as f:
        json.dump(bill_to_session, f, indent=2)
    print("🔄 Rebuilding bill-to-session mapping from saved bill data...")
    return bill_to_session
