"""Parameters with label"""
from tkinter import Frame, Label

from ... import utils


def create_label(name: str, row: int, frame: Frame) -> None:
    """Create parameter label in frame"""
    label: Label = Label(frame, text=utils.clean_name(name))
    label.grid(row=row, column=0, sticky="NSW")
