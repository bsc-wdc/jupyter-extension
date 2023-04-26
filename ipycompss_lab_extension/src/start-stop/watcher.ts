import { ISessionContext, IWidgetTracker } from '@jupyterlab/apputils';
import { ConsolePanel } from '@jupyterlab/console';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import { StartStopMessaging } from './messaging';
import { setState } from './start-stop';

export const watchCurrentChanges = (
  _: IWidgetTracker,
  panel: ConsolePanel | NotebookPanel | null
): void => {
  setState(({ started }) => ({ enabled: false, started }));
  panel?.sessionContext.kernelChanged.connect(watchKernelChanges);

  const kernel = panel?.sessionContext.session?.kernel;
  StartStopMessaging.sendStatusRequest(kernel).onReply(startState(kernel));
};

const watchKernelChanges = (
  _: ISessionContext,
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
): void => {
  const kernel = change.newValue;
  StartStopMessaging.sendStatusRequest(kernel).onReply(startState(kernel));
};

const startState =
  (kernel: Kernel.IKernelConnection | null | undefined) =>
  (data: StartStopMessaging.IStatusResponseDto): void => {
    setState({ enabled: true, started: data.started });

    kernel?.statusChanged.connect(cleanUpState);
    kernel &&
      StartStopMessaging.onStop(kernel, () =>
        setState(({ enabled }) => ({ enabled, started: false }))
      );
  };

const cleanUpState = (_: Kernel.IKernelConnection, status: Kernel.Status) => {
  if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
    setState(({ started }) => ({ enabled: false, started }));
  }
};
