"""Enumeration parameter"""
from enum import Enum
from tkinter import Frame, OptionMenu, StringVar, Tk
from typing import Union, Tuple, List

from . import label


def create(name: str, default: Enum, frame: Union[Tk, Frame]) -> Tuple[str, StringVar]:
    """Create an enumeration parameter"""
    row = frame.grid_size()[1]
    label.create_label(name, row, frame)

    var: StringVar = StringVar()
    var.set(default.value)
    options: List[str] = [x.value for x in list(type(default))]
    option_menu: OptionMenu = OptionMenu(frame, var, *options)
    option_menu.grid(row=row, column=1, sticky="NSW")
    return name, var
