import { ToolbarButtonComponent } from '@jupyterlab/apputils';
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

export const StopButton = ({
  tracker,
  state: { enabled, started }
}: StartButton.IProperties): JSX.Element => (
  <ToolbarButtonComponent
    label="Stop"
    enabled={enabled && started}
    onClick={shutdown(tracker)}
  />
);

const shutdown = (tracker: INotebookTracker) => async (): Promise<void> => {
  const kernel = tracker.currentWidget?.sessionContext.session?.kernel;
  if (kernel === null || kernel === undefined) {
    return;
  }
  Messaging.sendStopRequest(kernel).onReply(
    ({ success }: Messaging.ISuccessResponseDto) =>
      setState(({ enabled, started }) => ({ enabled, started: !success }))
  );
};
