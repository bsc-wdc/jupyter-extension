'''Enumeration parameter'''
import tkinter as tk

from ipycompss_kernel.parameter.label import LabeledParameter


class EnumerationParameter(LabeledParameter):
    '''Class for enumeration parameters'''

    def make(self, frame) -> tuple[str, tk.BooleanVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: tk.StringVar = tk.StringVar()
        var.set(self.default.name)
        options: list[str] = list(map(
            lambda value: value.name,
            list(type(self.default))
        ))
        option_menu: tk.OptionMenu = tk.OptionMenu(
            frame, var, *options
        )
        option_menu.grid(row=self.row, column=1, sticky='NSW')
        return self.name, var
