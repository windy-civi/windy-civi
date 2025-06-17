from handlers.event import handle_event
from pathlib import Path


def run_handle_event(
    state_abbr: str,
    event_data: dict,
    session_name: str,
    date_folder: str,
    data_processed_folder: Path,
    data_not_processed_folder: Path,
    bill_id: str,
    filename: str,
):
    """
    Wrapper for handle_event that sets up paths and handles logging or errors.

    Args:
        state_abbr (str): State abbreviation (e.g., 'il', 'ca').
        event_data (dict): The parsed event JSON.
        session_name (str): The session name for saving structure.
        data_processed_folder (Path): Base path for processed output.
        data_not_processed_folder (Path): Base path for skipped/error output.
        filename (str): Original event file name.
    """
    try:
        handle_event(
            state_abbr,
            event_data,
            session_name,
            date_folder,
            data_processed_folder,
            data_not_processed_folder,
            filename,
            bill_id,
        )
    except Exception as e:
        print(f"❌ Failed to handle event {filename}: {e}")
