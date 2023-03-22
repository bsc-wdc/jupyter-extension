import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { KernelMessage, SessionManager } from '@jupyterlab/services';

import React, { useState } from 'react';
import { watchNewNotebooks } from './watcher';

let enabled: number;
let setEnabled: React.Dispatch<React.SetStateAction<number>>;

export const StartButton = ({
  tracker,
  manager
}: {
  tracker: INotebookTracker;
  manager: SessionManager;
}): JSX.Element => {
  tracker.widgetAdded.connect(watchNewNotebooks(manager));
  [enabled, setEnabled] = useState(0);
  return (
    <ToolbarButtonComponent
      label="Start"
      enabled={Boolean(enabled)}
      onClick={showStartDialog(tracker)}
    />
  );
};

export const addEnabled = (amount: number): void => {
  enabled += amount;
  setEnabled(enabled);
};

const showStartDialog =
  (tracker: INotebookTracker) => async (): Promise<void> => {
    void showDialog({
      title: 'IPyCOMPSs configuration',
      buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    }).then(startPycompss(tracker));
  };

const startPycompss =
  (tracker: INotebookTracker) =>
  (result: Dialog.IResult<unknown>): void => {
    if (result.button.accept) {
      const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
      if (kernel !== null && kernel !== undefined) {
        kernel.requestExecute({
          code: `
          import pycompss.interactive as ipycompss
          
          ipycompss.start()
                  
          del ipycompss
        `,
          silent: true
        }).onReply = (message: KernelMessage.IExecuteReplyMsg): void => {
          if (message.content.status === 'ok') {
            // unregisterKernel(kernel);
          }
        };
      }
    }
  };
