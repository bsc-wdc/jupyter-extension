"""Boolean parameter"""
from tkinter import BooleanVar, Checkbutton, Frame

from .base import ParameterBase


class BooleanParameter(ParameterBase):  # pylint: disable=too-few-public-methods
    """Class for boolean parameters"""

    def make(self, frame: Frame) -> tuple[str, BooleanVar]:
        var: BooleanVar = BooleanVar()
        var.set(self.default)
        checkbutton: Checkbutton = Checkbutton(
            frame, text=self.name.capitalize(), variable=var
        )
        row: int = frame.grid_size()[1]
        checkbutton.grid(row=row, column=0, sticky="NSW")
        return self.name, var
