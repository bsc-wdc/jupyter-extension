from ipykernel.ipkernel import IPythonKernel

# KernelManager.shutdown_wait_time
class IPyCOMPSsKernel(IPythonKernel):
    def start(self):
        super().start()

        self.shell.run_cell("""
            import pycompss.interactive as ipycompss

            ipycompss.start(graph=True, monitor=1000) # debug=True, trace=True

            del ipycompss
        """, silent=True, store_history=False)

    def do_shutdown(self, restart: bool):
        print(self.shell.run_cell("""
            import pycompss.interactive as ipycompss

            ipycompss.stop(sync=True)
        """, silent=True, store_history=False))

        super().do_shutdown(restart)
