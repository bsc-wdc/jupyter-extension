"""Kernel start and stop methods"""
import re
import subprocess
from typing import TYPE_CHECKING, Any, Callable

from ... import utils
from . import messaging as start_stop_messaging
from .messaging import StartRequestDto, StatusDto, SuccessResponseDto

if TYPE_CHECKING:
    from ..ipycompss_kernel import IPyCOMPSsKernel

SC_VAR = "COMPSS_RUNNING_IN_SC"
JL_VAR = "COMPSS_IN_JUPYTERLAB"
STOP_EXPRESSION = "outer_start_stop.stop_pycompss()"


def start(kernel: "IPyCOMPSsKernel") -> None:
    """Start the kernel"""
    cluster = utils.read_boolean_env_var(SC_VAR)
    if not utils.read_boolean_env_var(JL_VAR):
        _init(kernel, cluster)

    start_stop_messaging.on_status(_get_status)
    start_stop_messaging.on_init(_handle_init_request(kernel, cluster))
    start_stop_messaging.on_start(_handle_start_request(kernel, cluster))
    start_stop_messaging.on_stop(_handle_stop_request(kernel))


def do_shutdown(kernel: "IPyCOMPSsKernel") -> None:
    """Shutdown kernel"""
    _execute(kernel, STOP_EXPRESSION)
    start_stop_messaging.send_stop()


def _get_status() -> StatusDto:
    """Send status comm to the frontend"""
    processes = subprocess.run(["ps", "aux", "ww"], stdout=subprocess.PIPE, check=True)
    started = re.search(r"java.*compss-engine\.jar", processes.stdout.decode("utf-8"))
    return {"started": started is not None}


def _handle_init_request(
    kernel: "IPyCOMPSsKernel", cluster: bool
) -> Callable[[], SuccessResponseDto]:
    """Open start pop-up"""

    def callback() -> SuccessResponseDto:
        result = _init(kernel, cluster)
        return {"success": result["status"] != "error" or result["ename"] != "TclError"}

    return callback


def _handle_start_request(
    kernel: "IPyCOMPSsKernel", cluster: bool
) -> Callable[[StartRequestDto], SuccessResponseDto]:
    """Execute code to start PyCOMPSs runtime"""

    def callback(request: StartRequestDto) -> SuccessResponseDto:
        result = _execute(
            kernel,
            f"outer_start_stop.start_pycompss({cluster}, {request['arguments']})",
        )
        return {"success": result["status"] == "ok"}

    return callback


def _handle_stop_request(kernel: "IPyCOMPSsKernel") -> Callable[[], SuccessResponseDto]:
    """Execute code to stop PyCOMPSs runtime"""

    def callback() -> SuccessResponseDto:
        result = _execute(kernel, STOP_EXPRESSION)
        return {"success": result["status"] == "ok"}

    return callback


def _init(kernel: "IPyCOMPSsKernel", cluster: bool) -> dict[str, Any]:
    return _execute(kernel, f"outer_start_stop.start({cluster})")


def _execute(kernel: "IPyCOMPSsKernel", expression: str) -> dict[str, Any]:
    return kernel.execute(f"""
        from ipycompss_kernel import outer_start_stop
        {expression}
        del outer_start_stop
    """)
