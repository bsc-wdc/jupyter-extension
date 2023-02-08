"""IPyCOMPSs kernel implementation"""
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    """IPyCOMPSs Kernel class"""

    def start(self):
        """Start the kernel"""
        super().start()

        self.shell.run_cell("""
            import pycompss.interactive as ipycompss

            ipycompss.start(graph=True, monitor=1000) # debug=True, trace=True

            del ipycompss
        """, silent=True, store_history=False)

    def do_shutdown(self, restart: bool):
        """Shutdown kernel"""
        self.shell.run_cell("""
            import pycompss.interactive as ipycompss

            ipycompss.stop(sync=True)
        """, silent=True, store_history=False)

        super().do_shutdown(restart)
