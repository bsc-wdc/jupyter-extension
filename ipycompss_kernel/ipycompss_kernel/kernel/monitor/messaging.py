"""Methods for the PyCOMPSs monitor management"""
from typing import Any, Callable, TypedDict

import comm
from ipykernel.comm import Comm


class MonitorRequestDto(TypedDict):
    """Monitor request"""

    action: str


def on_monitor(callback: Callable[[MonitorRequestDto], None]) -> None:
    """Register monitor message callback"""

    def on_monitor_comm(monitor_comm: Comm, open_monitor_comm: dict[str, Any]) -> None:
        callback(open_monitor_comm["content"]["data"])
        del monitor_comm

    comm.get_comm_manager().register_target("ipycompss_monitor_target", on_monitor_comm)
