import tkinter as tk

class BooleanParameter():
    def __init__(self, name: str, default: bool):
        self.name: str = name
        self.default: bool = default
    
    def make(self, frame) -> tk.BooleanVar:
        var: tk.BooleanVar = tk.BooleanVar()
        var.set(self.default)
        checkbutton: tk.Checkbutton = tk.Checkbutton(
            frame, text=self.name.capitalize(), variable=var
        )
        row: int = frame.grid_size()[1]
        checkbutton.grid(row=row, column=0, sticky='NSW')
        return self.name, var