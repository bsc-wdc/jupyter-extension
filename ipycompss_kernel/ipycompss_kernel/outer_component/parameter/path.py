"""Path parameter"""
from enum import Enum, auto
from tkinter import Button, Frame, StringVar, filedialog

from . import str as string_parameter


class PathType(Enum):
    """Type of path (file/folder path)"""

    FILE = auto()
    FOLDER = auto()


def create(
    name: str, default: str, frame: Frame, file: PathType
) -> tuple[str, StringVar]:
    """Create a path parameter"""
    var: StringVar = string_parameter.create(name, default, frame)[1]
    row = frame.grid_size()[1] - 1

    def browse():
        if file == PathType.FILE:
            path: str = filedialog.askopenfilename()
        else:
            path: str = filedialog.askdirectory()
        var.set(path or "")

    button: Button = Button(frame, text="browse", command=browse)
    button.grid(row=row, column=2)
    return name, var
