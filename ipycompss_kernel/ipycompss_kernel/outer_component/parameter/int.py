"""Integer parameter"""
import sys
from tkinter import Frame, IntVar, Spinbox

from . import label


def create(name: str, default: int, frame: Frame) -> tuple[str, IntVar]:
    """Create integer parameter"""
    row = frame.grid_size()[1]
    label.create_label(name, row, frame)

    var: IntVar = IntVar()
    var.set(default)
    spinbox: Spinbox = Spinbox(frame, from_=0, to=sys.maxsize, textvariable=var)
    spinbox.grid(row=row, column=1, sticky="NSW")
    return name, var
