import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import {
  ILayoutRestorer,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';

import { activate } from './activate';

/**
 * Initialization data for the ipycompss_lab_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'ipycompss_lab_extension:plugin',
  autoStart: true,
  requires: [INotebookTracker, IConsoleTracker, IJupyterWidgetRegistry],
  optional: [ILayoutRestorer],
  activate
};

export default plugin;
