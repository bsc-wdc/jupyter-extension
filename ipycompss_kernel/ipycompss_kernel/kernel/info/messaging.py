"""Methods for the messaging between the kernel and the front end"""
from typing import Callable, TypedDict

import comm
from ipykernel.comm import Comm


class InfoResponseDto(TypedDict):
    """Info response"""

    code: str


class InfoMessaging:
    """Class with different methods for the messaging with the front end"""

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
