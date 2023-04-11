"""Methods for the messaging between the kernel and the front end"""
from typing import Any, Callable, TypedDict

import comm
from ipykernel.comm import Comm


class StatusDto(TypedDict):
    """Kernel status data"""

    cluster: bool
    started: bool


class StartRequestDto(TypedDict):
    """Runtime start arguments"""

    arguments: dict[str, Any]


class SuccessResponseDto(TypedDict):
    """Action success response"""

    success: bool


class InfoResponseDto(TypedDict):
    """Info response"""

    code: str


class Messaging:
    """Class with different methods for the messaging with the front end"""

    @staticmethod
    def on_status(callback: Callable[[], StatusDto]) -> None:
        """Register status message callback"""

        def on_status_comm(status_comm: Comm, _) -> None:
            """Process and reply status comm"""
            status = callback()
            status_comm.send(data=status)
            del status_comm

        comm.get_comm_manager().register_target(
            "ipycompss_status_target", on_status_comm
        )

    @staticmethod
    def on_start(callback: Callable[[StartRequestDto], SuccessResponseDto]) -> None:
        """Register start message callback"""

        def on_start_comm(start_comm: Comm, open_start_comm: dict[str, Any]) -> None:
            """Process and reply start comm"""
            response = callback(open_start_comm["content"]["data"])
            start_comm.send(data=response)
            del start_comm

        comm.get_comm_manager().register_target("ipycompss_start_target", on_start_comm)

    @staticmethod
    def on_stop(callback: Callable[[], SuccessResponseDto]) -> None:
        """Register stop message callback"""

        def on_stop_comm(stop_comm: Comm, _) -> None:
            """Process and reply start comm"""
            response = callback()
            stop_comm.send(data=response)
            del stop_comm

        comm.get_comm_manager().register_target("ipycompss_stop_target", on_stop_comm)

    @staticmethod
    def on_info(callback: Callable[[], InfoResponseDto]) -> None:
        """Register info message callback"""

        def on_info_comm(info_comm: Comm, _) -> None:
            """Process and reply start comm"""
            response = callback()
            info_comm.send(data=response)
            del info_comm

        comm.get_comm_manager().register_target(
            "ipycompss_execution_info_target", on_info_comm
        )

    @staticmethod
    def send_stop() -> None:
        """Send stop message to frontend"""
        stop_comm: Comm = comm.create_comm("ipycompss_stop_target")
        del stop_comm
