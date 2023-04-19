"""Hatch custom hook"""
import subprocess
from typing import Any

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    """Custom build hook"""

    def finalize(
        self, version: str, build_data: dict[str, Any], artifact_path: str
    ) -> None:
        """Install kernelspec"""

        subprocess.run(
            ["jupyter", "kernelspec", "install", "pycompss", "--user"], check=True
        )
