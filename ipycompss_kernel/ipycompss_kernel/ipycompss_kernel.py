"""IPyCOMPSs kernel implementation"""
import os
import re
import subprocess
from importlib import resources
from typing import Any

from ipykernel.ipkernel import IPythonKernel
from IPython.utils.capture import capture_output

from .messaging import (
    InfoResponseDto,
    Messaging,
    StartRequestDto,
    SuccessResponseDto,
    StatusDto,
)

SC_VAR = "COMPSS_RUNNING_IN_SC"
STOP_EXPRESSION = "Controller.stop_pycompss()"


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    @staticmethod
    def _handle_info_request() -> InfoResponseDto:
        return {
            "code": """
                from ipywidgets import Output
                from traitlets import Unicode
                import pycompss.interactive as ipycompss

                class Out(Output):
                    _model_name = Unicode('Model').tag(sync=True)
                    _model_module = Unicode('ipycompss_lab_extension').tag(sync=True)
                    _model_module_version = Unicode('0.1.0').tag(sync=True)
                    _view_name = Unicode('View').tag(sync=True)
                    _view_module = Unicode('ipycompss_lab_extension').tag(sync=True)
                    _view_module_version = Unicode('0.1.0').tag(sync=True)
                with Out():
                    print('Task status')
                    ipycompss.tasks_status()
                    print('Task info')
                    ipycompss.tasks_info()
            """
        }

    def __init__(self, **kwargs: Any) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.cluster = (
            os.environ[SC_VAR].lower() == "true"
            if SC_VAR in os.environ
            else False
        )

    def start(self) -> None:
        """Start the kernel"""
        super().start()

        if not self.cluster:
            self._execute("Controller().start()")

        Messaging.on_status(self._get_status)
        Messaging.on_start(self._handle_start_request)
        Messaging.on_stop(self._handle_stop_request)
        Messaging.on_info(self._handle_info_request)

    def do_shutdown(self, restart: bool) -> dict[str, str]:
        """Shutdown kernel"""

        self._execute(STOP_EXPRESSION)
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

    def _handle_start_request(
        self, request: StartRequestDto
    ) -> SuccessResponseDto:
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
            f"Controller.start_pycompss({env}, {request['arguments']})"
        )
        return {"success": result["status"] == "ok"}

    def _handle_stop_request(self) -> SuccessResponseDto:
        """Execute code to stop PyCOMPSs runtime"""
        result = self._execute(STOP_EXPRESSION)
        return {"success": result["status"] == "ok"}

    def _execute(self, expression: str) -> dict[str, Any]:
        with capture_output() as capture:
            result = {}
            try:
                self.do_execute(  # pylint: disable=no-member
                    f"""
                        from ipycompss_kernel.controller import Controller
                        {expression}
                        del Controller
                    """,
                    silent=True,
                ).send(None)
            except StopIteration as execution:
                result = execution.value
            self.log.warn(capture.stdout)
        return result
