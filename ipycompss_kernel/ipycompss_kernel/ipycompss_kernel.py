"""IPyCOMPSs kernel implementation"""
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def start(self):
        """Start the kernel"""
        super().start()

        self.shell.run_cell(
            """
                from ipycompss_kernel.startup_popup import pycompss_start

                pycompss_start()
                del pycompss_start
            """,
            silent=True,
        )

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
