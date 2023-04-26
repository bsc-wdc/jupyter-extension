"""Kernel start and stop methods"""
import os
import re
import subprocess
from tkinter import TclError
from typing import TYPE_CHECKING, Any

from .messaging import (
    StartRequestDto,
    StartStopMessaging,
    StatusDto,
    SuccessResponseDto,
)

if TYPE_CHECKING:
    from ..ipycompss_kernel import IPyCOMPSsKernel

SC_VAR = "COMPSS_RUNNING_IN_SC"
STOP_EXPRESSION = "OuterStartStop.stop_pycompss()"


class StartStop:
    """Controller that manages kernel start and stop"""

    def __init__(self, kernel: "IPyCOMPSsKernel"):
        """Initiate the start-stop controller"""
        self._kernel = kernel
        self._cluster = (
            os.environ[SC_VAR].lower() == "true" if SC_VAR in os.environ else False
        )

    def start(self) -> None:
        """Start the kernel"""
        if not self._cluster:
            self._execute(self._init_expression())

        StartStopMessaging.on_status(self._get_status)
        StartStopMessaging.on_init(self._handle_init_request)
        StartStopMessaging.on_start(self._handle_start_request)
        StartStopMessaging.on_stop(self._handle_stop_request)

    def do_shutdown(self) -> None:
        """Shutdown kernel"""
        self._execute(STOP_EXPRESSION)
        StartStopMessaging.send_stop()

    def _get_status(self) -> StatusDto:
        """Send status comm to the frontend"""
        processes = subprocess.run(
            ["ps", "aux", "ww"], stdout=subprocess.PIPE, check=True
        )
        started = re.search(
            r"java.*compss-engine\.jar", processes.stdout.decode("utf-8")
        )
        return {"started": started is not None}

    def _handle_init_request(self) -> SuccessResponseDto:
        """Open start pop-up"""
        result = self._execute(self._init_expression())
        return {"success": result["status"] != "error" or result["ename"] != "TclError"}

    def _handle_start_request(self, request: StartRequestDto) -> SuccessResponseDto:
        """Execute code to start PyCOMPSs runtime"""
        result = self._execute(
            f"OuterStartStop.start_pycompss({self._cluster}, {request['arguments']})"
        )
        return {"success": result["status"] == "ok"}

    def _handle_stop_request(self) -> SuccessResponseDto:
        """Execute code to stop PyCOMPSs runtime"""
        result = self._execute(STOP_EXPRESSION)
        return {"success": result["status"] == "ok"}

    def _execute(self, expression: str) -> dict[str, Any]:
        return self._kernel.execute(
            f"""
                from ipycompss_kernel import OuterStartStop
                {expression}
                del OuterStartStop
            """
        )

    def _init_expression(self) -> str:
        return f"OuterStartStop().start({self._cluster})"
