"""Helper code that the kernel executes to start, stop and open the monitor"""
import os
import subprocess
import time
import urllib.request as urlreq
import webbrowser
from subprocess import CompletedProcess
from urllib.error import URLError
from urllib.request import Request

URL: Request = Request("http://localhost:8080/compss-monitor", method="HEAD")


def execute_action(action: str) -> None:
    """Execute the corresponding action"""
    ACTION[action]()


def start_monitor() -> None:
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
    if process.returncode == 0:
        _open_monitor()


def _open_monitor() -> None:
    """Open the PyCOMPSs monitor in the browser"""
    if _wait_start():
        webbrowser.open_new_tab(URL.get_full_url())


def _stop_monitor() -> None:
    """Stop pycompss monitor"""
    subprocess.run(["pycompss", "monitor", "stop"], check=False)


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


ACTION = {"start": start_monitor, "open": _open_monitor, "stop": _stop_monitor}
