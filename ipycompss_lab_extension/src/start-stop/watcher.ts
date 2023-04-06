import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel, INotebookTracker } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import { setState } from './start-stop';
import { Messaging } from './messaging';

export const watchNotebookChanges = (
  _: INotebookTracker,
  notebook: NotebookPanel | null
): void => {
  setState(({ enabled, started }) => ({ enabled: false, started }));
  notebook?.sessionContext.kernelChanged.connect(watchKernelChanges);

  const kernel = notebook?.sessionContext.session?.kernel;
  if (kernel === null || kernel === undefined) {
    return;
  }

  kernel.anyMessage.connect((_, args) => console.log(args.direction, args.msg));

  Messaging.sendStatusRequest(kernel).onReply(startState(kernel));
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
    const enabled = data.cluster;
    const started = data.started;
    setState({ enabled, started });

    kernel.statusChanged.connect(cleanUpState);
    Messaging.onStop(kernel, () =>
      setState(({ enabled, started }) => ({ enabled, started: false }))
    );
  };

const cleanUpState = (_: Kernel.IKernelConnection, status: Kernel.Status) => {
  if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
    setState(({ enabled, started }) => ({ enabled: false, started }));
  }
};
