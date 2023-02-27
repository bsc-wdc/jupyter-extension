"""Boolean parameter"""
import tkinter as tk

from .base import ParameterBase


class BooleanParameter(ParameterBase):
    """Class for boolean parameters"""

    def make(self, frame) -> tuple[str, tk.BooleanVar]:
        var: tk.BooleanVar = tk.BooleanVar()
        var.set(self.default)
        checkbutton: tk.Checkbutton = tk.Checkbutton(
            frame, text=self.name.capitalize(), variable=var
        )
        row: int = frame.grid_size()[1]
        checkbutton.grid(row=row, column=0, sticky="NSW")
        return self.name, var
