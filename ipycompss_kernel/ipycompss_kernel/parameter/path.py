'''Path parameter'''
import tkinter as tk
from tkinter import filedialog

from ipycompss_kernel.parameter.str import StringParameter


class PathParameter(StringParameter):
    '''Class for path parameters'''

    def make(self, frame) -> tuple[str, tk.StringVar]:
        var: tk.StringVar = super().make(frame)[1]

        def browse():
            path = filedialog.askopenfilename()
            var.set(path or '')

        button: tk.Button = tk.Button(frame, text='browse', command=browse)
        button.grid(row=self.row, column=2)
        return self.name, var
