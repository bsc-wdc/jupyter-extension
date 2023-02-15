import os
import subprocess
import tkinter as tk

import pycompss.interactive as ipycompss

from ipycompss_kernel.parameter_factory import ParameterFactory


def make_grid_expandable(frame) -> None:
    for i in range(frame.grid_size()[1]):
        tk.Grid.rowconfigure(frame, i, weight=1)
    for i in range(frame.grid_size()[0]):
        tk.Grid.columnconfigure(frame, i, weight=1)


class Popup(tk.Tk):
    def __init__(self, *args, **kwargs):
        tk.Tk.__init__(self, *args, **kwargs)

        self.wm_title('IPyCOMPSs configuration')
        self.create_label('IPyCOMPSs startup options')

        self.parameters: dict = {}
        self.create_parameters(self)

        self.options_opened: bool = False
        frame = self.create_advanced_options()
        self.create_parameters(frame, advanced=True)
        make_grid_expandable(frame)

        self.column, self.row = 0, self.grid_size()[1] + 1
        self.create_button('Start PyCOMPSs monitor', self.start_monitor)
        self.create_button('Start IPyCOMPSs', self.start)
        make_grid_expandable(self)

    def create_label(self, text: str) -> tk.Label:
        label: tk.Label = tk.Label(self, text=text)
        row: int = self.grid_size()[1]
        label.grid(row=row, column=0, columnspan=2)
        return label
    
    def create_parameters(self, frame, advanced: bool = False) -> None:
        factory = ParameterFactory()
        parameters = factory.create_parameters(advanced=advanced)
        for parameter in parameters:
            name, var = parameter.make(frame)
            self.parameters[name] = var

    def create_advanced_options(self) -> tk.Frame:
        def open_close_options(e):
            if self.options_opened:
                frame.grid_forget()
                label.configure(text=f'+ {text}')
            else:
                frame.grid(row=frow, column=fcolumn)
                label.configure(text=f'- {text}')
            self.options_opened = not self.options_opened

        text: str = 'Advanced options'
        label: tk.Label = self.create_label(f'+ {text}')
        label.config(font='Arial 10 underline')
        label.bind('<Button-1>', open_close_options)

        fcolumn, frow = 0, self.grid_size()[1]
        frame: tk.Frame = tk.Frame(self)
        return frame

    def create_button(self, text: str, command) -> None:
        button: tk.Button = tk.Button(self, text=text, command=command)
        button.grid(row=self.row, column=self.column)
        self.column += 1

    def start(self) -> None:
        arguments: dict = {
            key: value.get()
            for (key, value) in self.parameters.items()
        }
        ipycompss.start(**arguments)

        self.destroy()

    def start_monitor() -> None:
        subprocess.run(['pkexec', 'env',
                        f'JAVA_HOME={os.environ["JAVA_HOME"]}',
                        'pycompss', 'monitor', 'start'])
