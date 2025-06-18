import contextlib
import os
from click.testing import CliRunner
import main
from tests.dir_comp import dirs_match

import tempfile
import tarfile


def test_main(tmpdir):
    input_folder = "tests/sample_input_files"
    output_folder = tmpdir.mkdir("out")
    runner = CliRunner()
    result = runner.invoke(
        main.main,
        [
            "--jur",
            "il",
            "--input-folder",
            input_folder,
            "--output-folder",
            output_folder,
        ],
    )

    with tarfile.open("tests/sample_expected_out.tgz", "r:gz") as tar:
        with tempfile.TemporaryDirectory() as tmpdirname:
            with contextlib.chdir(tmpdirname):
                print(os.getcwd())
                tar.extractall(filter="data")

                for root, dirs, files in os.walk("."):
                    for file in files:
                        print(os.path.join(root, file))

                print(result.output)
                assert dirs_match("sample_expected_out", output_folder)

    assert result.exit_code == 0
