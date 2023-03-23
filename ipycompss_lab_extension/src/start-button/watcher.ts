import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import { Kernel, KernelMessage } from '@jupyterlab/services';

import { addEnabled, andStarted, setStarted } from './start-button';

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

  const statusComm = kernel.createComm('ipycompss_status_target');
  statusComm.onMsg = startState(kernel);
  statusComm.open();
};

const startState =
  (kernel: Kernel.IKernelConnection) =>
  (message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>): void => {
    const amount = Number(Boolean(message.content.data.cluster));
    addEnabled(amount);
    const newStarted = Boolean(message.content.data.started);
    andStarted(newStarted);

    kernel.statusChanged.connect(cleanUpState(amount));
    kernel.registerCommTarget('ipycompss_stop_target', () => setStarted(false));
  };

const cleanUpState =
  (amount: number) => (_: Kernel.IKernelConnection, status: Kernel.Status) => {
    if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
      addEnabled(-amount);
    }
  };
