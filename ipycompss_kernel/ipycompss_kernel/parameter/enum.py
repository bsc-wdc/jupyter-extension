"""Enumeration parameter"""
from tkinter import Frame, OptionMenu, StringVar, Tk

from .label import LabeledParameter


class EnumerationParameter(LabeledParameter):
    """Class for enumeration parameters"""

    def make(self, frame: Tk | Frame) -> tuple[str, StringVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: StringVar = StringVar()
        var.set(self.default.name)
        options: list[str] = list(
            map(lambda value: value.name, list(type(self.default)))
        )
        option_menu: OptionMenu = OptionMenu(frame, var, *options)
        option_menu.grid(row=self.row, column=1, sticky="NSW")
        return self.name, var
