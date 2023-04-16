"""Path parameter"""
from enum import Enum, auto
from tkinter import Button, Frame, StringVar, Tk, filedialog
from typing import Any

from .str import StringParameter


class PathType(Enum):
    """Type of path (file/folder path)"""

    FILE = auto()
    FOLDER = auto()


class PathParameter(StringParameter):
    """Class for path parameters"""

    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args)
        self.file: PathType = kwargs["path_type"]

    def make(self, frame: Tk | Frame) -> tuple[str, StringVar]:
        var: StringVar = super().make(frame)[1]

        def browse():
            if self.file == PathType.FILE:
                path: str = filedialog.askopenfilename()
            else:
                path: str = filedialog.askdirectory()
            var.set(path or "")

        button: Button = Button(frame, text="browse", command=browse)
        button.grid(row=self.row, column=2)
        return self.name, var
