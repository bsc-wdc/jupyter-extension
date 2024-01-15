"""Helper code that the kernel executes to show execution info"""
import re
import time
from threading import Thread
from typing import TypedDict, Dict

import comm

import pycompss.interactive as ipycompss

from ... import utils
from .panel import Panel


class InfoType(TypedDict):
    """Dictionary representing the call to be executed"""

    name: str
    poll: bool


INFO_TYPE: Dict[str, InfoType] = {
    "info": {"name": "tasks_info", "poll": False},
    "status": {"name": "tasks_status", "poll": False},
    "current_graph": {"name": "current_task_graph", "poll": True},
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

    if not operation["poll"]:
        with widget:
            function()
    else:

        def callback() -> None:
            comm_id = widget.comm.comm_id
            comm_manager = comm.get_comm_manager()
            while comm_manager.get_comm(comm_id) is not None:
                time.sleep(0.25)
                function(widget=widget)

        Thread(target=callback).start()
