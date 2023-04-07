"""IPyCOMPSs kernel implementation"""
import os
import re
import subprocess
from importlib import resources
from typing import Any

from ipykernel.ipkernel import IPythonKernel

from .messaging import Messaging, StartRequestDto, SuccessResponseDto, StatusDto

SC_VAR = "COMPSS_RUNNING_IN_SC"
STOP_CODE = """
                import pycompss.interactive as ipycompss
                ipycompss.stop(sync=True)
            """


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs: Any) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.cluster = (
            os.environ[SC_VAR].lower() == "true" if SC_VAR in os.environ else False
        )

    def start(self) -> None:
        """Start the kernel"""
        super().start()

        if not self.cluster:
            self._execute(
                """
                    from ipycompss_kernel.controller import Controller
                    Controller().start()
                    del Controller
                """
            )

        Messaging.on_status(self._get_status)
        Messaging.on_start(self._handle_start_request)
        Messaging.on_stop(self._handle_stop_request)

    def do_shutdown(self, restart: bool) -> dict[str, str]:
        """Shutdown kernel"""

        self._execute(STOP_CODE)
        Messaging.send_stop()

        return super().do_shutdown(restart)

    def _get_status(self) -> StatusDto:
        """Send status comm to the frontend"""
        processes = subprocess.run(
            ["ps", "aux", "ww"], stdout=subprocess.PIPE, check=True
        )
        started = re.search(
            r"java.*compss-engine\.jar", processes.stdout.decode("utf-8")
        )
        return {"cluster": self.cluster, "started": started is not None}

    def _handle_start_request(self, request: StartRequestDto) -> SuccessResponseDto:
        """Execute code to start PyCOMPSs runtime"""

        def run_and_get_env(script_path: str) -> list[list[str]]:
            result = subprocess.run(
                ["sh", script_path], stdout=subprocess.PIPE, check=True
            )
            output = result.stdout.decode("utf-8")
            return [line.split("=", 1) for line in output.split("\n")[:-1]]

        env = []
        if self.cluster:
            with resources.as_file(
                resources.files("ipycompss_kernel").joinpath("start_workers.sh")
            ) as script_path:
                env = run_and_get_env(str(script_path))

        result = self._execute(
            f"""
                from ipycompss_kernel.controller import Controller
                Controller.start_pycompss({env}, {request["arguments"]})
                del Controller
            """
        )
        return {"success": result["status"] == "ok"}

    def _handle_stop_request(self) -> SuccessResponseDto:
        """Execute code to stop PyCOMPSs runtime"""
        result = self._execute(STOP_CODE)
        return {"success": result["status"] == "ok"}

    def _execute(self, code: str) -> dict[str, Any]:
        try:
            self.do_execute(code, silent=True).send(None)
        except StopIteration as end:
            return end.value
        return {}
