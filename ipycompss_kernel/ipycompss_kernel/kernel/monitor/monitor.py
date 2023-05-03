"""Kernel monitor methods"""
from typing import Any, Callable

from . import messaging as monitor_messaging
from .messaging import MonitorRequestDto


def start(execute: Callable[[str], dict[str, Any]]) -> None:
    """Register monitor callbacks"""
    monitor_messaging.on_monitor(_handle_monitor_request(execute))


def do_shutdown(execute: Callable[[str], dict[str, Any]]) -> None:
    """Shutdown the monitor"""
    _execute(execute, "stop")


def _handle_monitor_request(
    execute: Callable[[str], dict[str, Any]]
) -> Callable[[MonitorRequestDto], None]:
    def callback(request: MonitorRequestDto) -> None:
        _execute(execute, request["action"])

    return callback


def _execute(execute: Callable[[str], dict[str, Any]], expression: str) -> None:
    execute(f"""
        from ipycompss_kernel import outer_monitor
        outer_monitor.execute_action({f"'{expression}'"})
        del outer_monitor
    """)
