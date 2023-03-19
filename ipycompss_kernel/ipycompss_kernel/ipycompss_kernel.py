"""IPyCOMPSs kernel implementation"""
import asyncio
import os

import comm
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def __init__(self, **kwargs):
        """Initialise kernel"""
        super().__init__(**kwargs)

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

        asyncio.get_event_loop().create_task(self.init_comm())

    def do_shutdown(self, restart: bool):
        """Shutdown kernel"""

        self.shell.run_cell(
            """
                import pycompss.interactive as ipycompss

                ipycompss.stop(sync=True)
            """,
            silent=True,
        )

        super().do_shutdown(restart)

    async def init_comm(self) -> None:
        """Send initial comm to the frontend"""
        await asyncio.sleep(3)
        comm.create_comm(
            target_name="ipycompss_init_target", data={"cluster": self.cluster}
        )
