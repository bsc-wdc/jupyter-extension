"""PyCOMPSs startup code"""
import os
from typing import Any

import pycompss.interactive as ipycompss


def start_pycompss(env: list[list[str]], arguments: dict[str, Any]) -> None:
    """Start PyCOMPSs"""
    for var, value in env:
        os.environ[var] = value

    ipycompss.start(**arguments)
