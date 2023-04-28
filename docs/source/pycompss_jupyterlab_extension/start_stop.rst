Starting and stopping the runtime
=================================

Starting the runtime
--------------------

When a notebook with the IPyCOMPSs kernel is in focus and the runtime has not been started,
the start button will be enabled.

Clicking the start button will show the kernel pop-up with the basic PyCOMPSs start parameters
(graph, debug, tracing and monitor) and 3 button ('Advanced options', 'Start PyCOMPSs monitor'
and 'Start IPyCOMPSs') when started.

Clicking the 'Advanced options' button will reveal more PyCOMPSs start parameters. Clicking
it again will hide them.

The user also has the option to click 'Start PyCOMPSs monitor', which will open a browser
tab with the PyCOMPSs monitor.

When the user clicks the 'Start IPyCOMPSs' button, the kernel will start the PyCOMPSs runtime
with the values that the parameters had in that precise moment and the pop-up will be closed.
If the environment variable ``COMPSS_RUNNING_IN_SC`` is set to true, clicking this button will
also cause the kernel to start the worker processes.

If the environment does not support the use of Tkinter, a JupyterLab native pop-up will be
shown instead, which will basicly contain the same (except for the'Start PyCOMPSs monitor'
button). Another difference is that the parameters that accept paths as values will have to
be input manually instead of being able to browse the files.

Stopping the runtime
--------------------

When a notebook with the IPyCOMPSs kernel is in focus and the runtime has been started, the
stop button will be enabled.

Clicking the stop button will try to stop the runtime (the kernel state should change to
busy). If it is successful, the stop button will be disabled and the start button will
be enabled accordingly.
