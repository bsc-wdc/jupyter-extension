"""Parameters with label"""
from tkinter import Frame, Label, Tk
from typing import Union

from ... import utils


def create_label(name: str, row: int, frame: Union[Tk, Frame]) -> None:
    """Create parameter label in frame"""
    label: Label = Label(frame, text=utils.clean_name(name))
    label.grid(row=row, column=0, sticky="NSW")
