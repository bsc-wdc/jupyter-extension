import {
  DOMWidgetModel,
  Dict,
  IBackboneModelOptions
} from '@jupyter-widgets/base';
import { output } from '@jupyter-widgets/jupyterlab-manager';

import WidgetView from './widget-view';

const INFO_TITLE = 'PyCOMPSs ';

export default class extends output.OutputModel {
  defaults(): any {
    return {
      ...super.defaults(),
      _model_name: 'Model',
      _model_module: 'ipycompss_lab_extension',
      _model_module_version: '1.0.0',
      _view_name: 'View',
      _view_module: 'ipycompss_lab_extension',
      _view_module_version: '1.0.0',
      title: `${INFO_TITLE} execution info`,
      type: WidgetView.INFO_ID,
      poll: false
    };
  }

  initialize(
    attributes: Backbone.ObjectHash,
    options: IBackboneModelOptions
  ): void {
    super.initialize(attributes, options);
    this.widget_manager.create_view(this as DOMWidgetModel, {});
  }

  set_state(state: Dict<unknown>): void {
    state.outputs &&
      this.get_state().poll &&
      (state.outputs = [
        (state.outputs as Array<unknown>)[
          (state.outputs as Array<unknown>).length - 1
        ]
      ]);
    super.set_state(state);
  }
}
