"""Methods for the status messaging between the kernel and the front end"""
from typing import Callable, TypedDict

import comm
from ipykernel.comm import Comm


class StatusDto(TypedDict):
    """Kernel status data"""

    cluster: bool
    started: bool
    monitor_started: bool


def on_status(callback: Callable[[], StatusDto]) -> None:
    """Register status message callback"""

    def on_status_comm(status_comm: Comm, _) -> None:
        status = callback()
        status_comm.send(data=status)
        del status_comm

    comm.get_comm_manager().register_target("ipycompss_status_target", on_status_comm)
