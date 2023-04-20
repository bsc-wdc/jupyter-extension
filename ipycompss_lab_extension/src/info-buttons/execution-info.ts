import { INotebookTracker } from '@jupyterlab/notebook';

import { InfoButtons } from './info-buttons';
import { ExecutionInfoMessaging } from './messaging';

export const getExecutionInfo = (
  tracker: INotebookTracker,
  type: InfoButtons.InfoType
): void => {
  const kernel = tracker.currentWidget?.sessionContext?.session?.kernel;
  ExecutionInfoMessaging.sendInfoRequest(kernel, { type });
};
