import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import {
  Kernel,
  KernelMessage,
  Session,
  SessionManager
} from '@jupyterlab/services';
import { addEnabled } from './start-button';

export const watchNewNotebooks =
  (manager: SessionManager) =>
  (_: INotebookTracker, notebook: NotebookPanel): void => {
    const watchKernelChanges = (
      _: ISessionContext,
      change: IChangedArgs<
        Kernel.IKernelConnection | null,
        Kernel.IKernelConnection | null
      >
    ): void => {
      const startState = (
        _: Kernel.IComm,
        message: KernelMessage.ICommOpenMsg
      ): void => {
        if (kernel === null) {
          return;
        }

        const amount = Number(Boolean(message.content.data.cluster));
        addEnabled(amount);

        manager.runningChanged.connect(cleanUpState(kernel, amount));
      };

      const kernel = change.newValue;
      kernel?.registerCommTarget('ipycompss_init_target', startState);
    };

    notebook.sessionContext.kernelChanged.connect(watchKernelChanges);
  };

// export const unregisterKernel = (kernel: Kernel.IKernelConnection): void => {
//   addEnabled(-1);
// };

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
    }
  };
