"""Parameters with label"""
from tkinter import Frame, Label, Tk
from typing import Any

from .base import ParameterBase


class LabeledParameter(ParameterBase):
    """Class for parameters that need a label"""

    def __init__(self, *args: str | Any):
        super().__init__(*args)
        self.row: int

    def create_label(self, frame: Tk | Frame) -> None:
        """Create parameter label in frame"""
        label: Label = Label(frame, text=self.name.capitalize())
        label.grid(row=self.row, column=0, sticky="NSW")
