import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import { addEnabled, setStarted } from './start-button';
import { Messaging } from './messaging';

export const watchNewNotebooks = (
  _: INotebookTracker,
  notebook: NotebookPanel
): void => {
  notebook.sessionContext.kernelChanged.connect(watchKernelChanges);
};

const watchKernelChanges = (
  _: ISessionContext,
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
): void => {
  const kernel = change.newValue;
  if (kernel === null) {
    return;
  }

  Messaging.sendStatusRequest(kernel).onReply(startState(kernel));
};

const startState =
  (kernel: Kernel.IKernelConnection) =>
  (data: Messaging.IStatusResponseDto): void => {
    const amount = +!!data.cluster;
    addEnabled(amount);
    const started = data.started;
    setStarted(started);

    kernel.statusChanged.connect(cleanUpState(amount));
    Messaging.onStop(kernel, () => setStarted(false));
  };

const cleanUpState =
  (amount: number) => (_: Kernel.IKernelConnection, status: Kernel.Status) => {
    if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
      addEnabled(-amount);
    }
  };
