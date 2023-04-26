import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';

import { Utils } from '../utils';
import { InfoButtons } from './info-buttons';
import { ExecutionInfoMessaging } from './messaging';

export const getExecutionInfo = (
  consoleTracker: IConsoleTracker,
  notebookTracker: INotebookTracker,
  type: InfoButtons.InfoType
): void => {
  const kernel = Utils.getKernel(consoleTracker, notebookTracker);
  ExecutionInfoMessaging.sendInfoRequest(kernel, { type });
};
