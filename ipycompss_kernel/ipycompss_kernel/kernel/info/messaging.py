"""Methods for the messaging between the kernel and the front end"""
from typing import Any, Callable, TypedDict

import comm
from ipykernel.comm import Comm


class InfoRequestDto(TypedDict):
    """Info request"""

    type: str


class InfoResponseDto(TypedDict):
    """Info response"""

    code: str


class InfoMessaging:  # pylint: disable=too-few-public-methods
    """Class with different methods for the messaging with the front end"""

    @staticmethod
    def on_info(callback: Callable[[InfoRequestDto], InfoResponseDto]) -> None:
        """Register info message callback"""

        def on_info_comm(info_comm: Comm, open_info_comm: dict[str, Any]) -> None:
            """Process and reply start comm"""
            response = callback(open_info_comm["content"]["data"])
            info_comm.send(data=response)
            del info_comm

        comm.get_comm_manager().register_target(
            "ipycompss_execution_info_target", on_info_comm
        )
