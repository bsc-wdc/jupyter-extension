"""PyCOMPSs popup startup code"""
from ipycompss_kernel.popup import Popup


def create_popup() -> None:
    """PyCOMPSs popup startup function"""
    popup: Popup = Popup()
    popup.mainloop()
