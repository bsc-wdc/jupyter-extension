'''Integer parameter'''
import sys
import tkinter as tk

from ipycompss_kernel.parameter.label import LabeledParameter


class IntegerParameter(LabeledParameter):
    '''Class for boolean parameters'''

    def make(self, frame) -> tuple[str, tk.IntVar]:
        self.row = frame.grid_size()[1]
        super().create_label(frame)

        var: tk.IntVar = tk.IntVar()
        var.set(self.default)
        spinbox: tk.Spinbox = tk.Spinbox(
            frame, from_=0, to=sys.maxsize, textvariable=var
        )
        spinbox.grid(row=self.row, column=1, sticky='NSW')
        return self.name, var
