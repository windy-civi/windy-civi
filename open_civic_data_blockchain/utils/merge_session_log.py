from pathlib import Path
import re

# -------------------------
# CONFIGURATION (generic)
# -------------------------
BASE_FOLDER = Path(__file__).resolve().parent
STATE_FOLDER = BASE_FOLDER.parent 
SESSION_LOG_PATH = STATE_FOLDER / "new_sessions_added.txt"
SESSION_INDEX_PATH = STATE_FOLDER / "session_index.py"


def load_logged_sessions(log_path):
    mapping = {}
    if not log_path.exists():
        return mapping

    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            match = re.match(r"^(.*?)\s*=>\s*(.*?)$", line.strip())
            if match:
                identifier, label = match.groups()
                mapping[identifier.strip()] = label.strip()
    return mapping


def update_session_index(session_index_path, new_entries):
    with open(session_index_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Insert before final closing }
    insert_index = next(i for i, line in enumerate(lines) if line.strip() == "}")

    for identifier, label in new_entries.items():
        line = f'    "{identifier}": "{label}",\n'
        if not any(f'"{identifier}"' in l for l in lines):
            lines.insert(insert_index, line)
            insert_index += 1

    with open(session_index_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print(f"✅ Added {len(new_entries)} new entries to session_index.py")


if __name__ == "__main__":
    new_sessions = load_logged_sessions(SESSION_LOG_PATH)
    if not new_sessions:
        print("⚠️ No new session mappings found in log file.")
    else:
        update_session_index(SESSION_INDEX_PATH, new_sessions)
