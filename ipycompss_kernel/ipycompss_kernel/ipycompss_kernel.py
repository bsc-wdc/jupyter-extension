"""IPyCOMPSs kernel implementation"""
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

    def __init__(self, **kwargs: dict[str, Any]) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.cluster = (
            os.environ[SC_VAR].lower() == "true" if SC_VAR in os.environ else False
        )

    def start(self) -> None:
        """Start the kernel"""
        super().start()

        if not self.cluster:
            self.shell.run_cell(
                """
                    from ipycompss_kernel.startup_popup import create_popup

                    create_popup()
                    del create_popup
                """,
                silent=True,
            )

        Messaging.on_status(self.get_status)
        Messaging.on_start(self.handle_start_request)
        Messaging.on_stop(self.handle_stop_request)

    def do_shutdown(self, restart: bool) -> dict[str, str]:
        """Shutdown kernel"""

        self.shell.run_cell(STOP_CODE, silent=True)
        Messaging.send_stop()

        return super().do_shutdown(restart)

    def get_status(self) -> StatusDto:
        """Send status comm to the frontend"""
        processes = subprocess.run(["ps", "aux", "ww"], capture_output=True)
        started = re.search(
            r"java.*compss-engine\.jar", processes.stdout.decode("utf-8")
        )
        return {"cluster": self.cluster, "started": started is not None}

    def handle_start_request(self, request: StartRequestDto) -> SuccessResponseDto:
        """Execute code to start PyCOMPSs runtime"""

        def run_and_get_env(script_path: str) -> list[list[str]]:
            result = subprocess.run(["sh", script_path], stdout=subprocess.PIPE)
            output = result.stdout.decode("utf-8")
            return [line.split("=", 1) for line in output.split("\n")[:-1]]

        env = []
        if self.cluster:
            with resources.as_file(
                resources.files("ipycompss_kernel").joinpath("start_workers.sh")
            ) as script_path:
                env = run_and_get_env(str(script_path))

        result = self.shell.run_cell(
            f"""
                from ipycompss_kernel.start_pycompss import start_pycompss

                start_pycompss({env}, {request["arguments"]})
                del start_pycompss
            """,
            silent=True,
        )
        return {"success": result.success}

    def handle_stop_request(self) -> SuccessResponseDto:
        """Execute code to stop PyCOMPSs runtime"""
        result = self.shell.run_cell(STOP_CODE, silent=True)
        return {"success": result.success}
