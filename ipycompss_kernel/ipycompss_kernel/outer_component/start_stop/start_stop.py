"""Helper code that the kernel executes to start/stop the runtime"""
import os
import subprocess
from importlib import resources
from typing import Any

import pycompss.interactive as ipycompss

from ..monitor import monitor
from .popup import Popup


def start(cluster: bool) -> None:
    """Start Popup"""

    def get_args_and_start_pycompss() -> None:
        arguments: dict[str, Any] = view.get_arguments()
        start_pycompss(cluster, arguments)
        view.destroy()

    view = Popup()
    view.create_button(
        "Start PyCOMPSs monitor", lambda: monitor.execute_action("start")
    )
    view.create_button("Start IPyCOMPSs", get_args_and_start_pycompss)
    view.mainloop()


def start_pycompss(cluster: bool, arguments: dict[str, Any]) -> None:
    """Start PyCOMPSs"""

    def to_worker_arguments(arguments: dict[str, Any]) -> list[str]:
        return [f"--{key}={value}" for [key, value] in arguments.items() if value != ""]

    def run_and_get_env(script_path: str, arguments: list[str]) -> list[list[str]]:
        result = subprocess.run(
            ["sh", script_path, *arguments], stdout=subprocess.PIPE, check=True
        )
        output = result.stdout.decode("utf-8")
        return [line.split("=", 1) for line in output.split("\n")[:-1]]

    env = []
    if cluster:
        worker_arguments = to_worker_arguments(arguments)
        with resources.as_file(
            resources.files(__package__).joinpath("start_workers.sh")
        ) as script_path:
            env = run_and_get_env(str(script_path), worker_arguments)
        for var, value in env:
            os.environ[var] = value

    ipycompss.start(**arguments)


def stop_pycompss() -> None:
    """Stop PyCOMPSs"""
    ipycompss.stop(sync=True)
