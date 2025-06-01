from handlers import bill, vote_event, event
from utils.file_utils import record_error_file
from utils.interactive import prompt_for_session_fix

ALLOW_SESSION_FIX = True


def count_successful_saves(files, handler_function):
    """
    Applies a handler to each file and counts how many were successfully saved.

    Args:
        files (list[Path]): List of JSON file paths to process.
        handler_function (function): Function that takes a file and processes it.

    Returns:
        int: Number of successfully saved items.
    """
    count = 0
    for file_path in files:
        success = handler_function(file_path)
        if success:
            count += 1
    return count


from handlers import bill, event, vote_event


def route_handler(
    STATE_ABBR, filename, content, session_name, ERROR_FOLDER, OUTPUT_FOLDER
):
    if "bill_" in filename:
        success = bill.handle_bill(
            STATE_ABBR, content, session_name, OUTPUT_FOLDER, ERROR_FOLDER, filename
        )
        return "bill" if success else None

    elif "vote_event_" in filename:
        success = vote_event.handle_vote_event(
            STATE_ABBR, content, session_name, OUTPUT_FOLDER, ERROR_FOLDER, filename
        )
        return "vote_event" if success else None

    elif "event_" in filename:
        success = event.handle_event(
            STATE_ABBR, content, session_name, OUTPUT_FOLDER, ERROR_FOLDER, filename
        )
        return "event" if success else None

    else:
        print(f"❓ Unrecognized file type: {filename}")
        return None


def process_and_save(
    STATE_ABBR, data, ERROR_FOLDER, SESSION_MAPPING, SESSION_LOG_PATH, OUTPUT_FOLDER
):
    bill_count = 0
    event_count = 0
    vote_event_count = 0

    for filename, content in data:
        session = content.get("legislative_session")
        if not session:
            print(f"⚠️ Skipping {filename}, missing legislative_session")
            record_error_file(ERROR_FOLDER, "missing_session", filename, content)
            continue

        session_name = SESSION_MAPPING.get(session)
        # if no session available, prompts user for a session and logs it
        if not session_name and ALLOW_SESSION_FIX:
            new_session = prompt_for_session_fix(
                filename, session, log_path=SESSION_LOG_PATH
            )
            if new_session:
                SESSION_MAPPING[session] = new_session
                session_name = new_session
        if not session_name:
            record_error_file(ERROR_FOLDER, "unknown_session", filename, content)
            continue

        result = route_handler(
            STATE_ABBR, filename, content, session_name, ERROR_FOLDER, OUTPUT_FOLDER
        )

        if result == "bill":
            bill_count += 1
        elif result == "event":
            event_count += 1
        elif result == "vote_event":
            vote_event_count += 1

    print("\n\u2705 File processing complete.")

    return {
        "bills": bill_count,
        "events": event_count,
        "votes": vote_event_count,
    }
