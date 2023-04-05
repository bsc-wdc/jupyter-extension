import {
  Dialog,
  showDialog,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import React from 'react';

import { Messaging } from './messaging';
import { setState } from './start-stop';

export namespace StartButton {
  export interface IProperties {
    tracker: INotebookTracker;
    state: { enabled: boolean; started: boolean };
  }
}

export const StartButton = ({
  tracker,
  state: { enabled, started }
}: StartButton.IProperties): JSX.Element => (
  <ToolbarButtonComponent
    label="Start"
    enabled={enabled && !started}
    onClick={showStartDialog(tracker)}
  />
);

const showStartDialog =
  (tracker: INotebookTracker) => async (): Promise<void> =>
    void showDialog({
      title: 'IPyCOMPSs configuration',
      buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
    }).then(startPycompss(tracker));

const startPycompss =
  (tracker: INotebookTracker) =>
  (result: Dialog.IResult<unknown>): void => {
    const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
    if (!result.button.accept || kernel === null || kernel === undefined) {
      return;
    }

    Messaging.sendStartRequest(kernel, { arguments: {} }).onReply(
      ({ success }: Messaging.ISuccessResponseDto): void =>
        setState(({ enabled, started }) => ({ enabled, started: success }))
    );
  };
