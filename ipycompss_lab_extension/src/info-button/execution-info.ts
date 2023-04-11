import { INotebookTracker } from '@jupyterlab/notebook';

import { ExecutionInfoMessaging } from './messaging';

export const getExecutionInfo = (tracker: INotebookTracker): void => {
  const kernel = tracker.currentWidget?.sessionContext?.session?.kernel;
  ExecutionInfoMessaging.sendInfoRequest(kernel);
};
