"""PyCOMPSs startup popup"""
from tkinter import Button, Canvas, Frame, Label, Scrollbar, Tk
from typing import Any, Callable

from .parameter.factory import ParameterFactory


class Popup(Tk):
    """PyCOMPs popup implementation"""

    @staticmethod
    def _make_grid_expandable(frame: Tk | Frame) -> None:
        """Makes the grid of the frame expandable"""
        for i in range(frame.grid_size()[1]):
            frame.rowconfigure(i, weight=1)
        for i in range(frame.grid_size()[0]):
            frame.columnconfigure(i, weight=1)

    def __init__(self, *args: Any, **kwargs: Any):
        """Popup creation"""
        super().__init__(*args, **kwargs)

        self.wm_title("IPyCOMPSs configuration")
        self._create_label("IPyCOMPSs startup options")

        self.parameters: dict[str, Any] = {}
        self._create_parameters(self)

        self.options_opened: bool = False
        frame: Frame = self._create_advanced_options()
        self._create_parameters(frame, advanced=True)
        self._make_grid_expandable(frame)

        self.column, self.row = 0, self.grid_size()[1] + 1
        self._make_grid_expandable(self)

    def create_button(self, text: str, command: Callable[[], None]) -> None:
        """Create a button in the popup"""
        button: Button = Button(self, text=text, command=command)
        button.grid(row=self.row, column=self.column)
        self.column += 1

    def get_arguments(self) -> dict[str, Any]:
        """Get arguments from parameters"""
        return {key: value.get() for (key, value) in self.parameters.items()}

    def _create_label(self, text: str) -> Label:
        """Create a label in the popup"""
        label: Label = Label(self, text=text)
        row: int = self.grid_size()[1]
        label.grid(row=row, column=0, columnspan=2)
        return label

    def _create_parameters(self, frame: Tk | Frame, advanced: bool = False) -> None:
        """Create parameter widgets"""
        parameters = ParameterFactory.create_parameters(advanced=advanced)
        for parameter in parameters:
            name, var = parameter.make(frame)
            self.parameters[name] = var

    def _create_advanced_options(self) -> Frame:
        """Create advanced options canvas"""

        def open_close_options(_) -> None:
            if self.options_opened:
                outer_frame.grid_forget()
                label.configure(text=f"+ {text}")
            else:
                outer_frame.grid(row=row, column=0, columnspan=2)
                canvas.configure(scrollregion=frame.bbox("all"))
                label.configure(text=f"- {text}")
            self.options_opened = not self.options_opened

        text: str = "Advanced options"
        label: Label = self._create_label(f"+ {text}")
        label.config(font="Arial 10 underline")
        label.bind("<Button-1>", open_close_options)

        row = self.grid_size()[1]
        outer_frame: Frame = Frame(self)

        canvas: Canvas = Canvas(outer_frame, height=500, width=700)
        canvas.pack(side="left")
        frame: Frame = Frame(canvas)
        frame.bind(
            "<Configure>", lambda e: canvas.config(scrollregion=canvas.bbox("all"))
        )
        canvas.create_window(0, 0, anchor="nw", window=frame)

        scrollbar: Scrollbar = Scrollbar(
            outer_frame, orient="vertical", command=canvas.yview
        )
        scrollbar.pack(side="right", expand=True, fill="both")
        canvas.configure(yscrollcommand=scrollbar.set)

        return frame
