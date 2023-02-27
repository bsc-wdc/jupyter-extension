"""String parameter"""
import tkinter as tk

from .label import LabeledParameter


class StringParameter(LabeledParameter):
    """Class for string parameters"""

    def make(self, frame) -> tuple[str, tk.StringVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: tk.StringVar = tk.StringVar()
        var.set(self.default)
        entry: tk.Entry = tk.Entry(frame, textvariable=var)
        entry.grid(row=self.row, column=1, sticky="NSW")
        return self.name, var
