'''IPyCOMPSs kernel implementation'''
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    '''IPyCOMPSs Kernel class'''

    def start(self):
        '''Start the kernel'''
        super().start()

        self.shell.run_cell('''
            import tkinter as tk

            window = tk.Tk()
            def start():
                import pycompss.interactive as ipycompss
                ipycompss.start(graph=True, monitor=1000) # debug=True, trace=True
                del ipycompss
                window.destroy()

            window.geometry('250x250')
            label = tk.Label(window, text='Hello, world!')
            label.pack(side='top')
            button = tk.Button(window, text='Start IPyCOMPSs', command=start)
            button.pack(side='bottom')
            window.mainloop()
        ''', silent=True)

    def do_shutdown(self, restart: bool):
        '''Shutdown kernel'''

        self.shell.run_cell('''
            import pycompss.interactive as ipycompss

            ipycompss.stop(sync=True)
        ''', silent=True)

        super().do_shutdown(restart)
