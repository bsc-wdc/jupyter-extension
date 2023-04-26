"""Integer parameter"""
import sys
from tkinter import Frame, IntVar, Spinbox, Tk
from typing import Union

from .label import LabeledParameter


class IntegerParameter(LabeledParameter):
    """Class for boolean parameters"""

    def make(self, frame: Union[Tk, Frame]) -> tuple[str, IntVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: IntVar = IntVar()
        var.set(self.default)
        spinbox: Spinbox = Spinbox(frame, from_=0, to=sys.maxsize, textvariable=var)
        spinbox.grid(row=self.row, column=1, sticky="NSW")
        return self.name, var
