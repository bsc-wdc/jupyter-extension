import { ISessionContext, IWidgetTracker } from '@jupyterlab/apputils';
import { ConsolePanel } from '@jupyterlab/console';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import { StartStopMessaging } from './messaging';
import { StartStop } from './start-stop';

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
    StartStopMessaging.sendStatusRequest(kernel).onReply(
      startState(kernel, setState)
    );
  };

const startState =
  (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<StartStop.IState>>
  ) =>
  ({ started }: StartStopMessaging.IStatusResponseDto): void => {
    setState({ enabled: true, started });

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
