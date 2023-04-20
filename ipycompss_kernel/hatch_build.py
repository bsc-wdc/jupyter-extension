"""Hatch custom hook"""
import subprocess

from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    """Custom build hook"""

    def finalize(self, *_) -> None:
        """Install kernelspec"""

        subprocess.run(
            ["jupyter", "kernelspec", "install", "pycompss", "--user"], check=True
        )
