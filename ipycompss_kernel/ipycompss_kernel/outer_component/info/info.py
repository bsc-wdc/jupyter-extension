"""Helper code that the kernel executes to show execution info"""
import re
import sys
import time
from threading import Thread
from typing import TYPE_CHECKING, Any, TypedDict

import pycompss.interactive as ipycompss

from ... import utils
from .panel import Panel

if TYPE_CHECKING and sys.version_info >= (3, 11):
    from typing import NotRequired  # pylint: disable=no-name-in-module


class InfoType(TypedDict):
    """Dictionary representing the call to be executed"""

    name: str
    poll: bool
    args: "NotRequired[dict[str, Any]]"


INFO_TYPE: dict[str, InfoType] = {
    "info": {"name": "tasks_info", "poll": False},
    "status": {"name": "tasks_status", "poll": False},
    "current_graph": {
        "name": "current_task_graph",
        "poll": True,
        "args": {"timeout": 60},
    },
    "complete_graph": {"name": "complete_task_graph", "poll": False},
    "resources": {"name": "resources_status", "poll": False},
    "statistics": {"name": "statistics", "poll": False},
}


def show_info(info_type: str) -> None:
    """Show panel with info"""
    operation = INFO_TYPE[info_type]
    title = re.sub(r"\(.*\)", "", utils.clean_name(operation["name"]))
    widget = Panel(title=title, type=info_type, poll=operation["poll"])

    function = getattr(ipycompss, operation["name"])
    args = operation["args"] if "args" in operation else {}

    if not operation["poll"]:
        with widget:
            function(**(args))
    else:

        def callback() -> None:
            [init_time, current_time] = [time.time()] * 2
            while current_time - init_time < 60:
                time.sleep(0.25)
                function(**{**args, **{"widget": widget}})
                widget.outputs = ()
                current_time = time.time()

        Thread(target=callback).start()
