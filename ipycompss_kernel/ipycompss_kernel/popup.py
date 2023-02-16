'''PyCOMPSs startup popup'''
import os
import subprocess
import tkinter as tk

import pycompss.interactive as ipycompss

from ipycompss_kernel.parameter.factory import ParameterFactory


class Popup(tk.Tk):
    '''PyCOMPs popup implementation'''

    def __init__(self, *args, **kwargs):
        '''Popup creation'''
        super().__init__(*args, **kwargs)

        self.wm_title('IPyCOMPSs configuration')
        self.create_label('IPyCOMPSs startup options')

        self.parameters: dict = {}
        self.create_parameters(self)

        self.options_opened: bool = False
        frame = self.create_advanced_options()
        self.create_parameters(frame, advanced=True)
        Popup.make_grid_expandable(frame)

        self.column, self.row = 0, self.grid_size()[1] + 1
        self.create_button('Start PyCOMPSs monitor', Popup.start_monitor)
        self.create_button('Start IPyCOMPSs', self.start)
        Popup.make_grid_expandable(self)

    def create_label(self, text: str) -> tk.Label:
        '''Create a label in the popup'''
        label: tk.Label = tk.Label(self, text=text)
        row: int = self.grid_size()[1]
        label.grid(row=row, column=0, columnspan=2)
        return label

    def create_parameters(self, frame, advanced: bool = False) -> None:
        '''Create parameter widgets'''
        parameters = ParameterFactory.create_parameters(advanced=advanced)
        for parameter in parameters:
            name, var = parameter.make(frame)
            self.parameters[name] = var

    def create_advanced_options(self) -> tk.Frame:
        '''Create advanced options canvas'''
        def open_close_options(e):
            if self.options_opened:
                outer_frame.grid_forget()
                label.configure(text=f'+ {text}')
            else:
                outer_frame.grid(row=row, column=0, columnspan=2)
                canvas.configure(scrollregion=frame.bbox('all'))
                label.configure(text=f'- {text}')
            self.options_opened = not self.options_opened

        text: str = 'Advanced options'
        label: tk.Label = self.create_label(f'+ {text}')
        label.config(font='Arial 10 underline')
        label.bind('<Button-1>', open_close_options)

        row = self.grid_size()[1]
        outer_frame: tk.Frame = tk.Frame(self)

        canvas: tk.Canvas = tk.Canvas(outer_frame, height=500, width=600)
        canvas.pack(side='left')
        frame: tk.Frame = tk.Frame(canvas)
        frame.bind('<Configure>', lambda e: canvas.config(
            scrollregion=canvas.bbox('all')))
        canvas.create_window(0, 0, anchor='nw', window=frame)

        scrollbar: tk.Scrollbar = tk.Scrollbar(
            outer_frame, orient='vertical', command=canvas.yview
        )
        scrollbar.pack(side='right', expand=True, fill='both')
        canvas.configure(yscrollcommand=scrollbar.set)

        return frame

    @classmethod
    def make_grid_expandable(cls, frame) -> None:
        '''Makes the grid of the frame expandable'''
        for i in range(frame.grid_size()[1]):
            frame.rowconfigure(i, weight=1)
        for i in range(frame.grid_size()[0]):
            frame.columnconfigure(i, weight=1)

    def create_button(self, text: str, command) -> None:
        '''Create a button in the popup'''
        button: tk.Button = tk.Button(self, text=text, command=command)
        button.grid(row=self.row, column=self.column)
        self.column += 1

    def start(self) -> None:
        '''Start PyCOMPSs'''
        arguments: dict = {
            key: value.get()
            for (key, value) in self.parameters.items()
        }
        ipycompss.start(**arguments)

        self.destroy()

    @classmethod
    def start_monitor(cls) -> None:
        '''Starts PyCOMPSs monitor'''
        subprocess.run(['pkexec', 'env',
                        f'JAVA_HOME={os.environ["JAVA_HOME"]}',
                        'pycompss', 'monitor', 'start'], check=False)
