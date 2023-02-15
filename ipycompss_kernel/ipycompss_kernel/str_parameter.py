import tkinter as tk


class StringParameter():
    def __init__(self, name: str, default: str):
        self.name: str = name
        self.default: str = default

    def make(self, frame) -> tuple[str, tk.StringVar]:
        row: int = frame.grid_size()[1]
        label: tk.Label = tk.Label(frame, text=self.name.capitalize())
        label.grid(row=row, column=0, sticky='NSW')

        var: tk.StringVar = tk.StringVar()
        var.set(str(self.default))
        entry: tk.Entry = tk.Entry(frame, textvariable=var)
        entry.grid(row=row, column=1, sticky='NSW')
        return self.name, var
