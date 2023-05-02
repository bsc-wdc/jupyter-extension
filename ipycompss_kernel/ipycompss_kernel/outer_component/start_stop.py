"""Helper code that the kernel executes to start/stop the runtime"""
import os
import subprocess
import time
import urllib.request as urlreq
import webbrowser
from importlib import resources
from subprocess import CompletedProcess
from typing import Any
from urllib.error import URLError
from urllib.request import Request

import pycompss.interactive as ipycompss

from .popup import Popup

URL: Request = Request("http://localhost:8080/compss-monitor", method="HEAD")


def start(cluster: bool) -> None:
    """Start Popup"""

    def get_args_and_start_pycompss() -> None:
        arguments: dict[str, Any] = view.get_arguments()
        start_pycompss(cluster, arguments)
        view.destroy()

    view = Popup()
    view.create_button("Start PyCOMPSs monitor", _start_monitor)
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
            resources.files("ipycompss_kernel").joinpath("start_workers.sh")
        ) as script_path:
            env = run_and_get_env(str(script_path), worker_arguments)
        for var, value in env:
            os.environ[var] = value

    ipycompss.start(**arguments)


def stop_pycompss() -> None:
    """Stop PyCOMPSs"""
    ipycompss.stop(sync=True)


def _start_monitor() -> None:
    """Start the PyCOMPSs monitor"""
    process: CompletedProcess[bytes] = subprocess.run(
        [
            "pkexec",
            "env",
            f'JAVA_HOME={os.environ["JAVA_HOME"]}',
            "pycompss",
            "monitor",
            "start",
        ],
        check=False,
    )
    if process.returncode == 0 and _wait_start():
        webbrowser.open_new_tab(URL.get_full_url())


def _wait_start() -> bool:
    """Wait until the monitor has started"""
    code: int = 0
    init_time: float = time.time()
    current_time: float = init_time
    while code != 200 and current_time - init_time < 60:
        time.sleep(0.25)
        try:
            with urlreq.urlopen(URL) as response:
                code = response.getcode()
        except URLError:
            code = 0
        finally:
            current_time = time.time()
    return current_time - init_time < 60
