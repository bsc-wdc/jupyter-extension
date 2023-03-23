import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';

import { INotebookTracker } from '@jupyterlab/notebook';
import { KernelMessage } from '@jupyterlab/services';
import React, { useState } from 'react';

import { watchNewNotebooks } from './watcher';

export namespace StartButton {
  export interface IProperties {
    tracker: INotebookTracker;
  }
}

let setEnabled: (callback: (value: number) => number) => void;
export let setStarted: (
  callbackValue: boolean | ((value: boolean) => boolean)
) => void;

export const StartButton = ({
  tracker
}: StartButton.IProperties): JSX.Element => {
  tracker.widgetAdded.connect(watchNewNotebooks);
  let enabled, started;
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

export const addEnabled = (amount: number): void =>
  setEnabled(enabled => enabled + amount);

export const andStarted = (newStarted: boolean): void =>
  setStarted(started => started || newStarted);

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
