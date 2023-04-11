import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import {
  ILayoutRestorer,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { activate } from './activate';

/**
 * Initialization data for the ipycompss_lab_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'ipycompss_lab_extension:plugin',
  autoStart: true,
  requires: [INotebookTracker, IRenderMimeRegistry, IJupyterWidgetRegistry],
  optional: [ILayoutRestorer],
  activate
};

export default plugin;
