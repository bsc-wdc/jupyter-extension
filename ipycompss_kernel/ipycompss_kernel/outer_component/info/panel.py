"""Output widget the IPyCOMPSs kernel"""
from ipywidgets import Output
from traitlets import Bool, Unicode


class Panel(Output):
    """Output widget class"""

    _model_name = Unicode("WidgetModel").tag(sync=True)
    _model_module = Unicode("ipycompss_lab_extension").tag(sync=True)
    _model_module_version = Unicode("1.0.0").tag(sync=True)
    _view_name = Unicode("WidgetView").tag(sync=True)
    _view_module = Unicode("ipycompss_lab_extension").tag(sync=True)
    _view_module_version = Unicode("1.0.0").tag(sync=True)
    title = Unicode("Title").tag(sync=True)
    type = Unicode("Type").tag(sync=True)
    poll = Bool(False).tag(sync=True)
