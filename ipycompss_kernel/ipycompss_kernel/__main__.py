from ipykernel.kernelapp import IPKernelApp
from . import IPyCOMPSsKernel

IPKernelApp.launch_instance(kernel_class=IPyCOMPSsKernel)
