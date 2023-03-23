"""IPyCOMPSs kernel implementation"""
import os
from typing import Any, Callable

import comm
from comm.base_comm import BaseComm
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs):
        """Initialise kernel"""
        super().__init__(**kwargs)

        self.started = False
        self.cluster = False
        if "IPYCOMPSS_CLUSTER" in os.environ:
            self.cluster = os.environ["IPYCOMPSS_CLUSTER"].lower() == "true"

    def start(self):
        """Start the kernel"""
        super().start()

        if not self.cluster:
            self.shell.run_cell(
                """
                    from ipycompss_kernel.startup_popup import pycompss_start

                    pycompss_start()
                    del pycompss_start
                """,
                silent=True,
            )

        comm.get_comm_manager().register_target(
            "ipycompss_status_target", self.status_comm()
        )

    def do_shutdown(self, restart: bool):
        """Shutdown kernel"""

        stopComm: BaseComm = comm.create_comm("ipycompss_stop_target")
        del stopComm

        self.shell.run_cell(
            """
                import pycompss.interactive as ipycompss

                ipycompss.stop(sync=True)
            """,
            silent=True,
        )

        super().do_shutdown(restart)

    def status_comm(self) -> Callable[[BaseComm, Any], None]:
        """Send status comm to the frontend"""

        def send_status_comm(status_comm: BaseComm, _):
            status_comm.send(data={"cluster": self.cluster, "started": self.started})
            del status_comm

        return send_status_comm
