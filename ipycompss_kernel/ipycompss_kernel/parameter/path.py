"""Path parameter"""
from enum import Enum
from tkinter import Button, Frame, StringVar, Tk, filedialog
from typing import Any

from .str import StringParameter

PathType = Enum("", ["FILE", "FOLDER"])


class PathParameter(StringParameter):
    """Class for path parameters"""

    def __init__(self, *args: str | Any, **kwargs: Any):
        super().__init__(*args)
        self.file = kwargs["path_type"]

    def make(self, frame: Tk | Frame) -> tuple[str, StringVar]:
        var: StringVar = super().make(frame)[1]

        def browse():
            if self.file == PathType.FILE:
                path = filedialog.askopenfilename()
            else:
                path = filedialog.askdirectory()
            var.set(path or "")

        button: Button = Button(frame, text="browse", command=browse)
        button.grid(row=self.row, column=2)
        return self.name, var
