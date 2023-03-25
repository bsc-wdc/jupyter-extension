"""PyCOMPSs startup code"""
from ipycompss_kernel.popup import Popup


def pycompss_start() -> None:
    """PyCOMPSs startup function"""
    popup: Popup = Popup()
    popup.mainloop()
