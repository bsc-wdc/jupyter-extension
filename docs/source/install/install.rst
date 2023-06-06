Installing
==========

.. danger::
  Do not use these extensions on a remote environment without encryption! Some of the data sent
  between the extension and the kernel include paths. If these are sent through the internet
  without encryption, things like your username could be eavesdropped.

Dependencies
------------

- Python 3.8 or newer
- pip

``pip`` will take care of installing most of the dependencies for you. However, be sure to have
PyCOMPSs installed first, because its dependencies are not installed automatically.

.. attention::
  If you are starting JupyterLab inside a virtual environment, make sure to add the
  enviroment's jupyter folder path in the ``JUPYTER_PATH`` enviroment variable. Otherwise
  you will not see the extension after installing it.

Install from package
--------------------

Download the latest version tarballs from the repository (in the 'releases' page) and execute
the following commands (substitute <version> for the version number of the release you
downloaded):

- To install the IPyCOMPSs kernel: ``pip install ipycompss_kernel-<version>.tar-gz``
- To install the IPyCOMPSs Lab extension: ``pip install
  ipycompss_lab_extension-<version>.tar.gz``

Installing on Jupyter JSC
^^^^^^^^^^^^^^^^^^^^^^^^^

For the above to work, JupyterLab must be initiated in a place where it can see the
ipycompss_kernel package which contains the IPyCOMPSs provisioner. In Jupyter JSC, in
the default configuration this is not possible because loading python libraries from
the user directory is blocked until JupyterLab has loaded.

To prevent that from happening, a virtual environment must be created. To do so, follow the
steps in the official documentation, found `here <https://docs.jupyter-jsc.fz-juelich.de/
github/FZJ-JSC/jupyter-jsc-notebooks/blob/documentation/index.ipynb>`_). Remember to install
the extensions and install or load PyCOMPSs in the new virtual environment.

Then, as seen in the section 'Load additional software models' of the same documentation,
create the file ``$HOME/.jupyter/start_jupyter-jsc.sh`` that loads the appropiate modules,
activates the virtual enviroment and updates the ``PYTHONPATH`` variable to point to the
virtual environment's Python packages directory. Also remember to update the ``JUPYTER_PATH``
and export the ``COMPSS_IN_JUPYTERLAB`` and ``COMPSS_RUNNING_IN_SC`` variables. See the
following example:

.. code-block:: bash

  module purge
  module use $OTHERSTAGES
  module load Stages/2022
  module load GCCcore/.11.2.0
  module load JupyterCollection/2022.3.4
  module load Graphviz/5.0.0

  module use <COMPSs module path>
  module load compssTrunk

  source <virtual enviroment path>/bin/activate
  export PYTHONPATH=<virtual enviroment path>/lib/python3.9/site-packages:$PYTHONPATH
  export JUPYTER_PATH=<virtual enviroment path>/share/jupyter:$JUPYTER_PATH
  export COMPSS_IN_JUPYTERLAB=true
  export COMPSS_RUNNING_IN_SC=true

Install from source
-------------------

Extra dependencies
^^^^^^^^^^^^^^^^^^

- JupyterLab python module
- NodeJS

Build
^^^^^

Clone the repository and execute the following commands:

.. code-block:: bash

  pip install ./ipycompss_kernel
  cd ipycompss_lab_extension
  jlpm run install
  jlpm run build:prod
  pip install .
