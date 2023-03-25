"""Module to manage the PyCOMPSs monitor"""
import os
import subprocess
import time
import urllib.request as urlreq
import webbrowser
from subprocess import CompletedProcess
from urllib.error import URLError
from urllib.request import Request


class Monitor:
    """Class that represents the PyCOMPSs monitor"""

    url: Request = Request("http://localhost:8080/compss-monitor", method="HEAD")

    @staticmethod
    def start() -> None:
        """Start the monitor"""
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
        if process.returncode == 0 and Monitor.wait_start():
            webbrowser.open_new_tab(Monitor.url.get_full_url())

    @staticmethod
    def wait_start() -> bool:
        """Wait until the monitor has started"""
        code: int = 0
        init_time: float = time.time()
        current_time: float = init_time
        while code != 200 and current_time - init_time < 60:
            time.sleep(0.25)
            try:
                with urlreq.urlopen(Monitor.url) as response:
                    code = response.getcode()
            except URLError:
                code = 0
            finally:
                current_time = time.time()
        return current_time - init_time < 60
