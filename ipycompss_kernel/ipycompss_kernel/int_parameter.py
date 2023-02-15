import sys
import tkinter as tk

class IntegerParameter():
    def __init__(self, name: str, default: int):
        self.name: str = name
        self.default: bool = default
    
    def make(self, frame) -> tk.IntVar:
        row: int = frame.grid_size()[1]
        label: tk.Label = tk.Label(frame, text=self.name.capitalize())
        label.grid(row=row, column=0, sticky='NSW')

        var: tk.IntVar = tk.IntVar()
        var.set(self.default)
        spinbox: tk.Spinbox = tk.Spinbox(
            frame, from_=1, to=sys.maxsize, textvariable=var
        )
        spinbox.grid(row=row, column=1, sticky='NSW')
        return self.name, var