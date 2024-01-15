"""String parameter"""
from tkinter import Entry, Frame, StringVar, Tk
from typing import Union, Tuple

from . import label


def create(name: str, default: str, frame: Union[Tk, Frame]) -> Tuple[str, StringVar]:
    """Create string parameter"""
    row = frame.grid_size()[1]
    label.create_label(name, row, frame)

    var: StringVar = StringVar()
    var.set(default)
    entry: Entry = Entry(frame, textvariable=var)
    entry.grid(row=row, column=1, sticky="NSW")
    return name, var
