import { DOMWidgetModel, IBackboneModelOptions } from '@jupyter-widgets/base';
import { output } from '@jupyter-widgets/jupyterlab-manager';

import { INFO_ID } from './widget-view';

const INFO_TITLE = 'PyCOMPSs ';

export class Model extends output.OutputModel {
  defaults(): any {
    return {
      ...super.defaults(),
      _model_name: 'Model',
      _model_module: 'ipycompss_lab_extension',
      _model_module_version: '0.1.0',
      _view_name: 'View',
      _view_module: 'ipycompss_lab_extension',
      _view_module_version: '0.1.0',
      title: `${INFO_TITLE} execution info`,
      type: INFO_ID
    };
  }

  initialize(
    attributes: Backbone.ObjectHash,
    options: IBackboneModelOptions
  ): void {
    super.initialize(attributes, options);
    this.widget_manager.create_view(this as DOMWidgetModel, {});
  }
}
