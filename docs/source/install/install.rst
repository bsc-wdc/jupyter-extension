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
  jlpm run build
  pip install .
