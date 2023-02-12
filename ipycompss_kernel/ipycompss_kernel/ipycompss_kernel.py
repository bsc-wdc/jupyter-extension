'''IPyCOMPSs kernel implementation'''
from ipykernel.ipkernel import IPythonKernel


class IPyCOMPSsKernel(IPythonKernel):
    '''IPyCOMPSs Kernel class'''

    def start(self):
        '''Start the kernel'''
        super().start()

        self.shell.run_cell('''
            def pycompss_start():
                import sys
                import tkinter as tk

                import pycompss.interactive as ipycompss

                def create_window() -> tk.Tk:
                    window: tk.Tk = tk.Tk()
                    window.title('IPyCOMPSs configuration')
                    return window

                def create_label(text: str) -> tk.Label:
                    nonlocal row
                    label: tk.Label = tk.Label(
                        window, text=text
                    )
                    label.grid(row=row, column=column, columnspan=2)
                    row += 1
                    return label

                def make_boolean_parameter(name: str) -> tk.BooleanVar:
                    nonlocal row
                    var: tk.BooleanVar = tk.BooleanVar()
                    checkbutton: tk.Checkbutton = tk.Checkbutton(
                        window, text=name.capitalize(), variable=var
                    )
                    checkbutton.grid(row=row, column=column, sticky='NSW')
                    row += 1
                    return var

                def make_integer_parameter(name: str) -> tk.IntVar:
                    nonlocal row, column
                    label: tk.Label = tk.Label(window, text=name.capitalize())
                    label.grid(row=row, column=column, sticky='NSW')
                    column += 1

                    var: tk.IntVar = tk.IntVar()
                    var.set(1000)
                    spinbox: tk.Spinbox = tk.Spinbox(
                        window, from_=1, to=sys.maxsize, textvariable=var
                    )
                    spinbox.grid(row=row, column=column, sticky='NSW')
                    row += 1
                    column = 0
                    return var

                def create_button():
                    def start():
                        arguments: dict = {
                            key: value.get()
                            for (key, value) in parameters.items()
                        }
                        ipycompss.start(**arguments)

                        window.destroy()

                    button: tk.Button = tk.Button(
                        window, text='Start IPyCOMPSs', command=start
                    )
                    button.grid(row=row, column=column, columnspan=2)

                def make_grid_expandable():
                    for i in range(window.grid_size()[1]):
                        tk.Grid.rowconfigure(window, i, weight=1)
                    for i in range(window.grid_size()[0]):
                        tk.Grid.columnconfigure(window, i, weight=1)

                def create_advanced_options():
                    def open_close_options(e):
                        nonlocal options_opened
                        if options_opened:
                            frame.grid_forget()
                            label.configure(text=f'+ {text}')
                        else:
                            frame.grid(row=frow, column=fcolumn)
                            label.configure(text=f'- {text}')
                        options_opened = not options_opened

                    nonlocal row
                    options_opened: bool = False
                    text = 'Advanced options'
                    label = create_label(f'+ {text}')
                    label.config(font='Arial 10 underline')
                    label.bind('<Button-1>', open_close_options)

                    frow = row
                    fcolumn = column
                    frame: tk.Frame = tk.Frame(window)
                    checkbutton: tk.Checkbutton = tk.Checkbutton(
                        frame, text='example'
                    )
                    checkbutton.pack()
                    row += 1

                row: int = 0
                column: int = 0
                window: tk.Tk = create_window()
                create_label('IPyCOMPSs startup options')

                boolean_parameters: list = ['graph', 'debug', 'trace']
                parameters: dict = {
                    parameter: make_boolean_parameter(parameter)
                    for parameter in boolean_parameters
                }
                parameters['monitor'] = make_integer_parameter('monitor')

                create_advanced_options()
                create_button()
                make_grid_expandable()

                window.mainloop()


            pycompss_start()
            del pycompss_start
        ''', silent=True)

    def do_shutdown(self, restart: bool):
        '''Shutdown kernel'''

        self.shell.run_cell('''
            import pycompss.interactive as ipycompss

            ipycompss.stop(sync=True)
        ''', silent=True)

        super().do_shutdown(restart)
