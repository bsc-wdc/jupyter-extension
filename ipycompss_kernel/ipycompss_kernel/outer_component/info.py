"""Helper code that the kernel executes to show execution info"""
import re
import sys
from typing import TYPE_CHECKING, Any, TypedDict

import pycompss.interactive as ipycompss

from .. import utils
from .panel import Panel

if TYPE_CHECKING and sys.version_info >= (3, 11):
    from typing import NotRequired  # pylint: disable=no-name-in-module


class InfoType(TypedDict):
    """Dictionary representing the call to be executed"""

    name: str
    args: "NotRequired[dict[str, Any]]"


INFO_TYPE: dict[str, InfoType] = {
    "info": {"name": "tasks_info"},
    "status": {"name": "tasks_status"},
    "current_graph": {"name": "current_task_graph", "args": {"timeout": 60}},
    "complete_graph": {"name": "complete_task_graph"},
    "resources": {"name": "resources_status"},
    "statistics": {"name": "statistics"},
}


def show_info(info_type: str) -> None:
    """Show panel with info"""
    operation = INFO_TYPE[info_type]
    title = re.sub(r"\(.*\)", "", utils.clean_name(operation["name"]))
    with Panel(title=title, type=info_type):
        getattr(ipycompss, operation["name"])(
            **(operation["args"] if "args" in operation else {})
        )
