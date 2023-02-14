'''IPyCOMPSs kernel implementation'''
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    '''IPyCOMPSs Kernel class'''

    def start(self):
        '''Start the kernel'''
        super().start()

        with  open('./startup_popup.py') as startup_popup:
            popup_code = startup_popup.read()
            self.shell.run_cell(popup_code, silent=True)

    def do_shutdown(self, restart: bool):
        '''Shutdown kernel'''

        self.shell.run_cell('''
            import pycompss.interactive as ipycompss

            ipycompss.stop(sync=True)
        ''', silent=True)

        super().do_shutdown(restart)
