"""String parameter"""
from tkinter import Entry, Frame, StringVar

from .label import LabeledParameter


class StringParameter(LabeledParameter):
    """Class for string parameters"""

    def make(self, frame: Frame) -> tuple[str, StringVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: StringVar = StringVar()
        var.set(self.default)
        entry: Entry = Entry(frame, textvariable=var)
        entry.grid(row=self.row, column=1, sticky="NSW")
        return self.name, var
