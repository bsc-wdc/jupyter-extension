"""PyCOMPSs startup code"""
from ipycompss_kernel.popup import Popup


def pycompss_start():
    """PyCOMPSs startup function"""
    popup = Popup()
    popup.mainloop()
