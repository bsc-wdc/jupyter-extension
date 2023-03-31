"""IPyCOMPSs kernel implementation"""
import os
import re
import subprocess
from importlib import resources

import comm
from comm.base_comm import BaseComm
from ipykernel.ipkernel import IPythonKernel

SC_VAR = "COMPSS_RUNNING_IN_SC"


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.cluster = False
        if SC_VAR in os.environ:
            self.cluster = os.environ[SC_VAR].lower() == "true"

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

        comm.get_comm_manager().register_target(
            "ipycompss_status_target", self.status_comm
        )
        comm.get_comm_manager().register_target(
            "ipycompss_start_target", self.start_comm
        )

    def do_shutdown(self, restart: bool) -> None:
        """Shutdown kernel"""

        self.shell.run_cell(
            """
                import pycompss.interactive as ipycompss

                ipycompss.stop(sync=True)
            """,
            silent=True,
        )

        stopComm: BaseComm = comm.create_comm("ipycompss_stop_target")
        del stopComm

        super().do_shutdown(restart)

    def status_comm(self, status_comm: BaseComm, _) -> None:
        """Send status comm to the frontend"""
        processes = subprocess.run(["ps", "aux", "ww"], capture_output=True)
        started = re.search(
            r"java.*compss-engine\.jar", processes.stdout.decode("utf-8")
        )
        status_comm.send(data={"cluster": self.cluster, "started": started is not None})
        del status_comm

    def start_comm(self, start_comm: BaseComm, open_start_comm) -> None:
        """Execute code to start PyCOMPSs runtime"""

        def run_and_get_env(script_path):
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

                start_pycompss(
                    {env},
                    {open_start_comm["content"]["data"]["arguments"]}
                )
                del start_pycompss
            """,
            silent=True,
        )
        start_comm.send(data={"success": result.success})
        del start_comm
