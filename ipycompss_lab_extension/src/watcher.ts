import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import { Kernel, KernelMessage } from '@jupyterlab/services';
import { addEnabled } from './start-button';

export const watchNewNotebooks = (
  _: INotebookTracker,
  notebook: NotebookPanel
): void => {
  notebook.context.sessionContext.kernelChanged.connect(watchKernelChanges);
};

const watchKernelChanges = (
  _: ISessionContext,
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
): void => {
  const startState = (
    _: Kernel.IComm,
    msg: KernelMessage.ICommOpenMsg
  ): void => {
    const cleanUpState = (
      _: Kernel.IKernelConnection,
      status: KernelMessage.Status
    ): void => {
      if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
        addEnabled(-amount);
      }
    };

    const amount = Number(Boolean(msg.content.data.cluster));
    addEnabled(amount);

    kernel?.statusChanged.connect(cleanUpState);
  };

  const kernel = change.newValue;
  kernel?.registerCommTarget('ipycompss_init_target', startState);
};
