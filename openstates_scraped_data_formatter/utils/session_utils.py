import json
from pathlib import Path


def load_session_mapping(session_mapping_file: Path) -> dict:
    """
    Loads session metadata mapping from disk.

    Returns a dictionary in the format:
    {
        "113": {"name": "113th Congress", "date_folder": "2013-2015"},
        "114": {"name": "114th Congress", "date_folder": "2015-2017"},
        ...
    }
    """
    if not session_mapping_file.exists():
        raise FileNotFoundError(
            f"❌ Session mapping file not found: {session_mapping_file}"
        )

    with open(session_mapping_file, "r", encoding="utf-8") as f:
        session_mapping = json.load(f)

    if not isinstance(session_mapping, dict):
        raise ValueError("❌ Session mapping must be a dictionary")

    return session_mapping
