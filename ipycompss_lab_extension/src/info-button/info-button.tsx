import { DOMWidgetModel, IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { output } from '@jupyter-widgets/jupyterlab-manager';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React from 'react';

import { compss_icon } from '../icon';
import { getExecutionInfo } from './execution-info';
import { InfoButtonView } from './view';

export namespace InfoButton {
  export interface IProperties {
    shell: JupyterFrontEnd.IShell;
    tracker: INotebookTracker;
    widgetRegistry: IJupyterWidgetRegistry;
  }
}

const INFO_ID = 'pycompss-execution-info';
const INFO_TITLE = 'PyCOMPSs execution info';

export const InfoButton = ({
  shell,
  tracker,
  widgetRegistry
}: InfoButton.IProperties): JSX.Element => {
  const Model = class extends output.OutputModel {
    defaults(): any {
      return {
        ...super.defaults(),
        _model_name: 'Model',
        _model_module: 'ipycompss_lab_extension',
        _model_module_version: '0.1.0',
        _view_name: 'View',
        _view_module: 'ipycompss_lab_extension',
        _view_module_version: '0.1.0'
      };
    }

    initialize(attributes: any, options: any) {
      super.initialize(attributes, options);
      this.widget_manager.create_view(this as DOMWidgetModel, {});
    }
  };
  const View = class extends output.OutputView {
    render() {
      super.render();

      const outputArea = this._outputView;
      outputArea.addClass('jp-LinkedOutputView');
      outputArea.title.closable = true;
      outputArea.title.label = INFO_TITLE;
      outputArea.title.icon = compss_icon;
      outputArea.id = INFO_ID;

      outputArea.parent?.disposed.connect(() => this.model.destroy());
      shell.add(outputArea, 'main', { mode: 'split-right' });
    }
  };

  widgetRegistry.registerWidget({
    name: 'ipycompss_lab_extension',
    version: '0.1.0',
    exports: { Model, View }
  });
  return <InfoButtonView onClick={openExecutionInfo(shell, tracker)} />;
};

const openExecutionInfo =
  (shell: JupyterFrontEnd.IShell, tracker: INotebookTracker) =>
  async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some((elem: Widget) => elem.id === INFO_ID)
    ) {
      return;
    }

    getExecutionInfo(tracker);
  };
