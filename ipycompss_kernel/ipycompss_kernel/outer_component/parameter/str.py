"""String parameter"""
from tkinter import Entry, Frame, StringVar

from . import label


def create(name: str, default: str, frame: Frame) -> tuple[str, StringVar]:
    """Create string parameter"""
    row = frame.grid_size()[1]
    label.create_label(name, row, frame)

    var: StringVar = StringVar()
    var.set(default)
    entry: Entry = Entry(frame, textvariable=var)
    entry.grid(row=row, column=1, sticky="NSW")
    return name, var
