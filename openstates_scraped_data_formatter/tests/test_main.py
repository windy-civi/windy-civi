from click.testing import CliRunner
import main
from tests.dir_comp import dirs_match


def test_main(tmpdir):
    input_folder = "tests/sample_input_files"
    output_folder = tmpdir.mkdir("out")
    runner = CliRunner()
    result = runner.invoke(
        main.main, ["--input-folder", input_folder, "--output-folder", output_folder]
    )
    print(result.output)
    assert dirs_match("tests/sample_expected_out", output_folder)
    assert result.exit_code == 0
