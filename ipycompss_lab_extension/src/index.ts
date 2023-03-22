import {
  ILayoutRestorer,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook';

import { activate } from './activate';

/**
 * Initialization data for the ipycompss_lab_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'ipycompss_lab_extension:plugin',
  autoStart: true,
  requires: [INotebookTracker],
  optional: [ILayoutRestorer],
  activate
};

export default plugin;
