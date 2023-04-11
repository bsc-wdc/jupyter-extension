"""Helper code that the kernel executes"""
import os
import subprocess
import time
import urllib.request as urlreq
import webbrowser
from subprocess import CompletedProcess
from typing import Any
from urllib.error import URLError
from urllib.request import Request

import pycompss.interactive as ipycompss

from .popup import Popup


class Controller:
    """Controller for kernel related code executed by the kernel itself"""

    URL: Request = Request(
        "http://localhost:8080/compss-monitor", method="HEAD"
    )

    @staticmethod
    def start_pycompss(env: list[list[str]], arguments: dict[str, Any]) -> None:
        """Start PyCOMPSs"""
        for var, value in env:
            os.environ[var] = value

        ipycompss.start(**arguments)

    @staticmethod
    def stop_pycompss() -> None:
        """Stop PyCOMPSs"""
        ipycompss.stop(sync=True)

    @staticmethod
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
        if process.returncode == 0 and Controller._wait_start():
            webbrowser.open_new_tab(Controller.URL.get_full_url())

    @staticmethod
    def _wait_start() -> bool:
        """Wait until the monitor has started"""
        code: int = 0
        init_time: float = time.time()
        current_time: float = init_time
        while code != 200 and current_time - init_time < 60:
            time.sleep(0.25)
            try:
                with urlreq.urlopen(Controller.URL) as response:
                    code = response.getcode()
            except URLError:
                code = 0
            finally:
                current_time = time.time()
        return current_time - init_time < 60

    def __init__(self) -> None:
        self.view: Popup

    def start(self) -> None:
        """Start Popup"""
        self.view = Popup()
        self.view.create_button("Start PyCOMPSs monitor", self._start_monitor)
        self.view.create_button("Start IPyCOMPSs", self._start_pycompss)
        self.view.mainloop()

    def _start_pycompss(self) -> None:
        """Start PyCOMPSs"""
        arguments: dict[str, Any] = self.view.get_arguments()
        Controller.start_pycompss([], arguments)

        self.view.destroy()
