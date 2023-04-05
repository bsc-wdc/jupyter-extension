from typing import Any, Callable, TypedDict

import comm
from comm.base_comm import BaseComm


class StatusDto(TypedDict):
    cluster: bool
    started: bool


class StartRequestDto(TypedDict):
    arguments: dict[str, Any]


class SuccessResponseDto(TypedDict):
    success: bool


class Messaging:
    @staticmethod
    def on_status(callback: Callable[[], StatusDto]) -> None:
        def on_status_comm(status_comm: BaseComm, _) -> None:
            """Process and reply status comm"""
            status = callback()
            status_comm.send(data=status)
            del status_comm

        comm.get_comm_manager().register_target(
            "ipycompss_status_target", on_status_comm
        )

    @staticmethod
    def on_start(callback: Callable[[StartRequestDto], SuccessResponseDto]) -> None:
        def on_start_comm(start_comm: BaseComm, open_start_comm) -> None:
            """Process and reply start comm"""
            response = callback(open_start_comm["content"]["data"])
            start_comm.send(data=response)
            del start_comm

        comm.get_comm_manager().register_target("ipycompss_start_target", on_start_comm)

    @staticmethod
    def on_stop(callback: Callable[[], SuccessResponseDto]) -> None:
        def on_stop_comm(stop_comm: BaseComm, _) -> None:
            """Process and reply start comm"""
            response = callback()
            stop_comm.send(data=response)
            del stop_comm

        comm.get_comm_manager().register_target("ipycompss_stop_target", on_stop_comm)

    @staticmethod
    def send_stop() -> None:
        """Send stop message to frontend"""
        stopComm: BaseComm = comm.create_comm("ipycompss_stop_target")
        del stopComm
