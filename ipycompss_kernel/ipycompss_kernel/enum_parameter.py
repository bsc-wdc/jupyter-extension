import tkinter as tk
from enum import Enum


class EnumerationParameter():
    def __init__(self, name: str, default: Enum):
        self.name: str = name
        self.default: Enum = default

    def make(self, frame) -> tuple[str, tk.BooleanVar]:
        row: int = frame.grid_size()[1]
        label: tk.Label = tk.Label(frame, text=self.name.capitalize())
        label.grid(row=row, column=0, sticky='NSW')

        var: tk.StringVar = tk.StringVar()
        var.set(self.default.name)
        options: list[str] = list(map(
            lambda value: value.name,
            list(type(self.default))
        ))
        option_menu: tk.OptionMenu = tk.OptionMenu(
            frame, var, *options
        )
        option_menu.grid(row=row, column=1, sticky='NSW')
        return self.name, var
