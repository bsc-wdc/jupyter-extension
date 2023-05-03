"""Boolean parameter"""
from tkinter import BooleanVar, Checkbutton, Frame, Tk
from typing import Union

from ... import utils


def create(name: str, default: bool, frame: Union[Tk, Frame]) -> tuple[str, BooleanVar]:
    """Create a boolean parameter"""
    var: BooleanVar = BooleanVar()
    var.set(default)
    checkbutton: Checkbutton = Checkbutton(
        frame, text=utils.clean_name(name), variable=var
    )
    row: int = frame.grid_size()[1]
    checkbutton.grid(row=row, column=0, sticky="NSW")
    return name, var
