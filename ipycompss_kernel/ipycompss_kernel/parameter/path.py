"""Path parameter"""
import tkinter as tk
from tkinter import filedialog

from .str import StringParameter


class PathParameter(StringParameter):
    """Class for path parameters"""

    def __init__(self, *args):
        super().__init__(*args)
        self.file: bool = self.default[1]
        self.default = self.default[0]

    def make(self, frame) -> tuple[str, tk.StringVar]:
        var: tk.StringVar = super().make(frame)[1]

        def browse():
            if self.file:
                path = filedialog.askopenfilename()
            else:
                path = filedialog.askdirectory()
            var.set(path or "")

        button: tk.Button = tk.Button(frame, text="browse", command=browse)
        button.grid(row=self.row, column=2)
        return self.name, var
