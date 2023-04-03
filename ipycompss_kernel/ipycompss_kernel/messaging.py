import re
import subprocess
from typing import Any, Callable, TypedDict

import comm
from comm.base_comm import BaseComm


class StatusDto(TypedDict):
    cluster: bool
    started: bool


class StartRequestDto(TypedDict):
    arguments: dict[str, Any]


class StartResponseDto(TypedDict):
    success: bool


class Messaging:
    @staticmethod
    def on_status(callback: Callable[[], StatusDto]):
        def on_status_comm(status_comm: BaseComm, _) -> None:
            """Send status comm to the frontend"""
            status = callback()
            status_comm.send(data=status)
            del status_comm

        comm.get_comm_manager().register_target(
            "ipycompss_status_target", on_status_comm
        )

    @staticmethod
    def on_start(callback: Callable[[StartRequestDto], StartResponseDto]):
        def on_start_comm(start_comm: BaseComm, open_start_comm) -> None:
            """Execute code to start PyCOMPSs runtime"""
            response = callback(open_start_comm["content"]["data"])
            start_comm.send(data=response)
            del start_comm

        comm.get_comm_manager().register_target("ipycompss_start_target", on_start_comm)
