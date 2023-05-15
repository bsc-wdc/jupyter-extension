Starting and stopping the runtime
=================================

Starting the runtime
--------------------

By default, the kernel will show a pop-up with the basic PyCOMPSs start parameters (graph,
debug, tracing and monitor) and 3 buttons (Advanced options, Start PyCOMPSs monitor and Start
IPyCOMPSs) when started. If the variable ``COMPSS_IN_JUPYTERLAB`` is set to true, the pop-up
will not be shown.

Clicking the 'Advanced options' button will reveal more PyCOMPSs start parameters. Clicking
it again will hide them.

The user also has the option to click 'Start PyCOMPSs monitor', which will open a browser
tab with the PyCOMPSs monitor.

When the user clicks the 'Start IPyCOMPSs' button, the kernel will start the PyCOMPSs runtime
with the values that the parameters had in that precise moment and the pop-up will be closed.
If the environment variable ``COMPSS_RUNNING_IN_SC`` is set to true, clicking this button will
also cause the kernel to start the worker processes.

.. warning::
    Do not start the PyCOMPSs runtime if it is already running. This may cause some
    problems.

Stopping the runtime
--------------------

When the kernel is shut down, it will stop the PyCOMPSs runtime if it is running. This may
take a while.

The default shutdown time is 30 seconds. However, the runtime may take more to
stop depending on the environment and the application that was executed. If a different
shutdown time is desired, we allow changing such time by setting the environment variable
``COMPSS_SHUTDOWN_TIME``, which is defined in seconds and allows decimal values.

.. caution::
    When using Jupyter Notebook App or JupyterLab, choosing to change kernel from
    PyCOMPSs to PyCOMPSs while the runtime is running will simultaneously shut down the
    kernel and start a new one. This is dangerous as starting the runtime while it shuts down
    may cause problems. We recommend that the kernel is always shut down before changing
    kernels if the runtime is running.