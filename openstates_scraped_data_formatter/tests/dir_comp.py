import filecmp


def dirs_match(dir1, dir2):
    """Check if two directories match 100%"""
    dcmp = filecmp.dircmp(dir1, dir2)

    # Check if there are any differences at all
    if dcmp.left_only or dcmp.right_only or dcmp.funny_files or dcmp.diff_files:
        return False

    # Recursively check subdirectories
    for sub_dcmp in dcmp.subdirs.values():
        if not dirs_match_recursive(sub_dcmp):
            return False

    return True


def dirs_match_recursive(dcmp):
    """Helper to check dircmp object recursively"""
    if dcmp.left_only or dcmp.right_only or dcmp.funny_files or dcmp.diff_files:
        return False

    for sub_dcmp in dcmp.subdirs.values():
        if not dirs_match_recursive(sub_dcmp):
            return False

    return True
