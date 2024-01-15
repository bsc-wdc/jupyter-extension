"""Methods for the start/stop messaging between the kernel and the front end"""
from typing import Any, Callable, TypedDict, Dict

import comm
from ipykernel.comm import Comm


class StartRequestDto(TypedDict):
    """Runtime start arguments"""

    arguments: Dict[str, Any]


class SuccessResponseDto(TypedDict):
    """Action success response"""

    success: bool


def on_init(callback: Callable[[], SuccessResponseDto]) -> None:
    """Register start message callback"""

    def on_init_comm(init_comm: Comm, _) -> None:
        response = callback()
        init_comm.send(data=response)
        del init_comm

    comm.get_comm_manager().register_target("ipycompss_init_target", on_init_comm)


def on_start(callback: Callable[[StartRequestDto], SuccessResponseDto]) -> None:
    """Register start message callback"""

    def on_start_comm(start_comm: Comm, open_start_comm: Dict[str, Any]) -> None:
        response = callback(open_start_comm["content"]["data"])
        start_comm.send(data=response)
        del start_comm

    comm.get_comm_manager().register_target("ipycompss_start_target", on_start_comm)


def on_stop(callback: Callable[[], SuccessResponseDto]) -> None:
    """Register stop message callback"""

    def on_stop_comm(stop_comm: Comm, _) -> None:
        response = callback()
        stop_comm.send(data=response)
        del stop_comm

    comm.get_comm_manager().register_target("ipycompss_stop_target", on_stop_comm)


def send_stop() -> None:
    """Send stop message to the frontend"""
    stop_comm: Comm = comm.create_comm("ipycompss_stop_target")
    del stop_comm
