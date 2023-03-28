"""PyCOMPSs startup code"""
from typing import Any

import pycompss.interactive as ipycompss


def start_pycompss(arguments: dict[str, Any]) -> None:
    """Start PyCOMPSs"""
    ipycompss.start(**arguments)
