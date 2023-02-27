"""Parameters with label"""
import tkinter as tk

from .base import ParameterBase


class LabeledParameter(ParameterBase):
    """Class for parameters that need a label"""

    def __init__(self, *args):
        super().__init__(*args)
        self.row: int

    def create_label(self, frame) -> None:
        """Create parameter label in frame"""
        label: tk.Label = tk.Label(frame, text=self.name.capitalize())
        label.grid(row=self.row, column=0, sticky="NSW")
