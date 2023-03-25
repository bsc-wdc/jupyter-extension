"""Boolean parameter"""
from tkinter import BooleanVar, Checkbutton, Frame, Tk

from .base import ParameterBase


class BooleanParameter(ParameterBase):
    """Class for boolean parameters"""

    def make(self, frame: Tk | Frame) -> tuple[str, BooleanVar]:
        var: BooleanVar = BooleanVar()
        var.set(self.default)
        checkbutton: Checkbutton = Checkbutton(
            frame, text=self.name.capitalize(), variable=var
        )
        row: int = frame.grid_size()[1]
        checkbutton.grid(row=row, column=0, sticky="NSW")
        return self.name, var
