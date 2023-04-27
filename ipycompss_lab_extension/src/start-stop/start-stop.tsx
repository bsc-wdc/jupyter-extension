import { Dialog, showDialog } from '@jupyterlab/apputils';
import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { toObject } from '@lumino/algorithm';
import React, { useState } from 'react';

import { Utils } from '../utils';
import { StartStopMessaging } from './messaging';
import { StartStopView, dialogBody } from './view';
import { watchCurrentChanges } from './watcher';

export namespace StartStop {
  export interface IState {
    enabled: boolean;
    started: boolean;
  }

  export interface IProperties {
    consoleTracker: IConsoleTracker;
    notebookTracker: INotebookTracker;
  }
}

export let setState: (
  callbackValue:
    | StartStop.IState
    | (({ enabled, started }: StartStop.IState) => StartStop.IState)
) => void;

export const StartStop = ({
  consoleTracker,
  notebookTracker
}: StartStop.IProperties): JSX.Element => {
  consoleTracker.currentChanged.connect(watchCurrentChanges);
  notebookTracker.currentChanged.connect(watchCurrentChanges);
  let enabled, started;
  [{ enabled, started }, setState] = useState({
    enabled: false,
    started: false
  } as StartStop.IState);
  return (
    <StartStopView
      start={{
        enabled: enabled && !started,
        onClick: showStartDialog(consoleTracker, notebookTracker)
      }}
      stop={{
        enabled: enabled && started,
        onClick: shutdown(consoleTracker, notebookTracker)
      }}
    />
  );
};

const showStartDialog =
  (consoleTracker: IConsoleTracker, notebookTracker: INotebookTracker) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    StartStopMessaging.sendInitRequest(kernel).onReply(
      ({ success }: StartStopMessaging.ISuccessResponseDto) => {
        StartStopMessaging.sendStatusRequest(kernel).onReply(
          ({ started }: StartStopMessaging.IStatusResponseDto) =>
            setState({ enabled: true, started: started })
        );
        success ||
          void showDialog({
            title: 'IPyCOMPSs configuration',
            body: dialogBody(),
            buttons: [Dialog.okButton({ label: 'Start IPyCOMPSs' })]
          }).then(startPycompss(consoleTracker, notebookTracker));
      }
    );
  };

const startPycompss =
  (consoleTracker: IConsoleTracker, notebookTracker: INotebookTracker) =>
  (result: Dialog.IResult<Map<string, any> | undefined>): void => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    result.button.accept &&
      result.value &&
      StartStopMessaging.sendStartRequest(kernel, {
        arguments: toObject(
          Array.from(result.value).map(([key, value]: [string, any]) => [
            key,
            value.default ?? value
          ])
        )
      }).onReply(({ success }: StartStopMessaging.ISuccessResponseDto): void =>
        setState(({ enabled }) => ({ enabled, started: success }))
      );
  };

const shutdown =
  (consoleTracker: IConsoleTracker, notebookTracker: INotebookTracker) =>
  async (): Promise<void> => {
    const kernel = Utils.getKernel(consoleTracker, notebookTracker);
    StartStopMessaging.sendStopRequest(kernel).onReply(
      ({ success }: StartStopMessaging.ISuccessResponseDto) =>
        setState(({ enabled }) => ({ enabled, started: !success }))
    );
  };
