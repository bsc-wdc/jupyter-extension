"""Kernel start and stop methods"""
from typing import Any, Callable, Dict

from ... import utils
from . import messaging as start_stop_messaging
from .messaging import StartRequestDto, SuccessResponseDto

SC_VAR = "COMPSS_RUNNING_IN_SC"
JL_VAR = "COMPSS_IN_JUPYTERLAB"


def start(execute: Callable[[str], Dict[str, Any]]) -> None:
    """Start the kernel"""
    cluster = utils.read_boolean_env_var(SC_VAR)
    if not utils.read_boolean_env_var(JL_VAR):
        _init(execute, cluster)

    start_stop_messaging.on_init(_handle_init_request(execute, cluster))
    start_stop_messaging.on_start(_handle_start_request(execute, cluster))
    start_stop_messaging.on_stop(_handle_stop_request(execute))


def do_shutdown(execute: Callable[[str], Dict[str, Any]]) -> None:
    """Shutdown kernel"""
    _execute(execute, "outer_start_stop.stop()")
    start_stop_messaging.send_stop()


def _handle_init_request(
    execute: Callable[[str], Dict[str, Any]], cluster: bool
) -> Callable[[], SuccessResponseDto]:
    """Open start pop-up"""

    def callback() -> SuccessResponseDto:
        result = _init(execute, cluster)
        return {"success": result["status"] != "error" or result["ename"] != "TclError"}

    return callback


def _handle_start_request(
    execute: Callable[[str], Dict[str, Any]], cluster: bool
) -> Callable[[StartRequestDto], SuccessResponseDto]:
    """Execute code to start PyCOMPSs runtime"""

    def callback(request: StartRequestDto) -> SuccessResponseDto:
        result = _execute(
            execute,
            f"outer_start_stop.start_pycompss({cluster}, {request['arguments']})",
        )
        return {"success": result["status"] == "ok"}

    return callback


def _handle_stop_request(
    execute: Callable[[str], Dict[str, Any]]
) -> Callable[[], SuccessResponseDto]:
    """Execute code to stop PyCOMPSs runtime"""

    def callback() -> SuccessResponseDto:
        result = _execute(execute, "outer_start_stop.stop_pycompss()")
        return {"success": result["status"] == "ok"}

    return callback


def _init(execute: Callable[[str], Dict[str, Any]], cluster: bool) -> Dict[str, Any]:
    return _execute(execute, f"outer_start_stop.start({cluster})")


def _execute(
    execute: Callable[[str], Dict[str, Any]], expression: str
) -> Dict[str, Any]:
    return execute(f"""
        from ipycompss_kernel import outer_start_stop
        {expression}
        del outer_start_stop
    """)
