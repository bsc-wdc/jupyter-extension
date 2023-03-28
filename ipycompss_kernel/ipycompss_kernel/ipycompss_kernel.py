"""IPyCOMPSs kernel implementation"""
import os
import re
import subprocess

import comm
from comm.base_comm import BaseComm
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs) -> None:
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.cluster = False
        if "IPYCOMPSS_CLUSTER" in os.environ:
            self.cluster = os.environ["IPYCOMPSS_CLUSTER"].lower() == "true"

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
        processes = subprocess.run(["ps", "aux"], capture_output=True)
        started = re.search(r"java.*compss-engine\.jar", str(processes.stdout))
        status_comm.send(data={"cluster": self.cluster, "started": started is not None})
        del status_comm

    def start_comm(self, start_comm: BaseComm, open_start_comm) -> None:
        """Execute code to start PyCOMPSs runtime"""
        result = self.shell.run_cell(
            f"""
                from ipycompss_kernel.start_pycompss import start_pycompss

                start_pycompss({open_start_comm["content"]["data"]["arguments"]})
                del start_pycompss
            """,
            silent=True,
        )
        start_comm.send(data={"success": result.success})
        del start_comm
