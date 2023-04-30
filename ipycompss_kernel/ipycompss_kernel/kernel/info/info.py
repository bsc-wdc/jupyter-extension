"""Kernel execution info methods"""
from . import messaging as info_messaging
from .messaging import InfoRequestDto, InfoResponseDto


def _callback(request: InfoRequestDto) -> InfoResponseDto:
    return {"code": f"""
        %matplotlib inline
        from ipycompss_kernel import outer_info
        outer_info.show_info({f"'{request['type']}'"})
        del outer_info
    """}


def start() -> None:
    """Register info callback"""

    info_messaging.on_info(_callback)
