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
export let setStarted: React.Dispatch<React.SetStateAction<boolean>>;

export const StartButton = ({
  tracker,
  manager
}: {
  tracker: INotebookTracker;
  manager: SessionManager;
}): JSX.Element => {
  tracker.widgetAdded.connect(watchNewNotebooks(manager));
  let started;
  [enabled, setEnabled] = useState(0);
  [started, setStarted] = useState(Boolean(false));
  return (
    <ToolbarButtonComponent
      label="Start"
      enabled={Boolean(enabled) && !started}
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
    const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
    if (!result.button.accept || kernel === null || kernel === undefined) {
      return;
    }
    kernel.requestExecute({
      code: `
          import pycompss.interactive as ipycompss
          
          ipycompss.start()
          
          del ipycompss
        `,
      silent: true
    }).onReply = setStartedIfSuccessful;
  };

const setStartedIfSuccessful = (
  message: KernelMessage.IExecuteReplyMsg
): void => {
  setStarted(message.content.status === 'ok');
};
