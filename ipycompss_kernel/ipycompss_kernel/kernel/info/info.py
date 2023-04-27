"""Kernel execution info methods"""
import re

from . import messaging as info_messaging
from .messaging import InfoRequestDto, InfoResponseDto

INFO_TYPE = {
    "info": "tasks_info()",
    "status": "tasks_status()",
    "current_graph": "current_task_graph(timeout=60)",
    "complete_graph": "complete_task_graph()",
    "resources": "resources_status()",
    "statistics": "statistics()",
}


def _handle_request(info_type: str) -> InfoResponseDto:
    function_name = INFO_TYPE[info_type]
    title = re.sub(r"\(.*\)", "", function_name.replace("_", " ").capitalize())
    return {"code": f"""
        %matplotlib inline
        import pycompss.interactive as ipycompss
        from ipycompss_kernel import OuterInfo

        with OuterInfo(title={f"'{title}'"}, type={f"'{info_type}'"}):
            ipycompss.{function_name}
        
        del ipycompss, OuterInfo
    """}


def _callback(request: InfoRequestDto) -> InfoResponseDto:
    return _handle_request(request["type"])


def start() -> None:
    """Register info callback"""

    info_messaging.on_info(_callback)
