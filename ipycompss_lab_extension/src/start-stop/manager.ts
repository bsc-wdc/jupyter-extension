import { ISessionContext, IWidgetTracker } from '@jupyterlab/apputils';
import { ConsolePanel } from '@jupyterlab/console';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';
import { toObject } from '@lumino/algorithm';

import { StartStopMessaging } from './messaging';
import { StartStop } from './start-stop';

export namespace StartStopManager {
  export const watchCurrentChanges =
    (setState: React.Dispatch<React.SetStateAction<StartStop.IState>>) =>
    (_: IWidgetTracker, panel: ConsolePanel | NotebookPanel | null): void => {
      setState(({ started }) => ({ enabled: false, started }));
      panel?.sessionContext.kernelChanged.connect(watchKernelChanges(setState));

      const kernel = panel?.sessionContext.session?.kernel;
      StartStopMessaging.sendStatusRequest(kernel).onReply(
        startState(kernel, setState)
      );
    };

  export const updateState = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
  ): void =>
    StartStopMessaging.sendStatusRequest(kernel).onReply(
      ({ started }: StartStopMessaging.IStatusResponseDto) =>
        setState({ enabled: true, started })
    );

  export const init = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
  ): { onFailure: (callback: () => void) => void } => {
    return {
      onFailure: (callback: () => void) => {
        StartStopMessaging.sendInitRequest(kernel).onReply(
          ({ success }: StartStopMessaging.ISuccessResponseDto) => {
            StartStopManager.updateState(kernel, setState);
            success || callback();
          }
        );
      }
    };
  };

  export const startPycompss = (
    kernel: Kernel.IKernelConnection | null | undefined,
    values: Map<string, any>,
    setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
  ): void =>
    StartStopMessaging.sendStartRequest(kernel, {
      arguments: toObject(
        Array.from(values).map(([key, value]: [string, any]) => [
          key,
          value.default ?? value
        ])
      )
    }).onReply(({ success }: StartStopMessaging.ISuccessResponseDto): void =>
      setState(({ enabled }) => ({ enabled, started: success }))
    );

  export const stopPycompss = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
  ): void =>
    StartStopMessaging.sendStopRequest(kernel).onReply(
      ({ success }: StartStopMessaging.ISuccessResponseDto) =>
        setState(({ enabled }) => ({ enabled, started: !success }))
    );

  const watchKernelChanges =
    (setState: React.Dispatch<React.SetStateAction<StartStop.IState>>) =>
    (
      _: ISessionContext,
      change: IChangedArgs<
        Kernel.IKernelConnection | null,
        Kernel.IKernelConnection | null
      >
    ): void => {
      const kernel = change.newValue;
      StartStopMessaging.sendStatusRequest(kernel).onReply(() => {
        updateState(kernel, setState);
        startState(kernel, setState);
      });
    };

  const startState =
    (
      kernel: Kernel.IKernelConnection | null | undefined,
      setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
    ) =>
    (): void => {
      kernel?.statusChanged.connect(cleanUpState(setState));
      kernel &&
        StartStopMessaging.onStop(kernel, () =>
          setState(({ enabled }) => ({ enabled, started: false }))
        );
    };

  const cleanUpState =
    (setState: React.Dispatch<React.SetStateAction<StartStop.IState>>) =>
    (_: Kernel.IKernelConnection, status: Kernel.Status) => {
      if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
        setState(({ started }) => ({ enabled: false, started }));
      }
    };
}
