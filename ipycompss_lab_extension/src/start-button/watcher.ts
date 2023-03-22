import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';

import {
  Kernel,
  KernelMessage,
  Session,
  SessionManager
} from '@jupyterlab/services';

import { addEnabled, setStarted } from './start-button';

export const watchNewNotebooks =
  (manager: SessionManager) =>
  (_: INotebookTracker, notebook: NotebookPanel): void => {
    notebook.sessionContext.kernelChanged.connect(watchKernelChanges(manager));
  };

const watchKernelChanges =
  (manager: SessionManager) =>
  (
    _: ISessionContext,
    change: IChangedArgs<
      Kernel.IKernelConnection | null,
      Kernel.IKernelConnection | null
    >
  ): void => {
    const kernel = change.newValue;
    kernel?.registerCommTarget(
      'ipycompss_init_target',
      startState(manager, kernel)
    );
  };

const startState =
  (manager: SessionManager, kernel: Kernel.IKernelConnection) =>
  (_: Kernel.IComm, message: KernelMessage.ICommOpenMsg): void => {
    if (kernel === null) {
      return;
    }

    const amount = Number(Boolean(message.content.data.cluster));
    addEnabled(amount);

    manager.runningChanged.connect(cleanUpState(kernel, amount));
  };

const cleanUpState =
  (kernel: Kernel.IKernelConnection, amount: number) =>
  (_: SessionManager, sessions: Session.IModel[]) => {
    console.log(kernel.id, sessions);
    if (
      !sessions
        .map((session: Session.IModel) => session.kernel?.id)
        .includes(kernel.id)
    ) {
      addEnabled(-amount);
      setStarted(false);
    }
  };
