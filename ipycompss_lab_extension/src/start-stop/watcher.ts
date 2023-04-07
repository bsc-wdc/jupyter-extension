import { ISessionContext } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import { withNullable } from '../utils';
import { Messaging } from './messaging';
import { setState } from './start-stop';

export const watchNotebookChanges = (
  _: INotebookTracker,
  notebook: NotebookPanel | null
): void => {
  setState(({ enabled, started }) => ({ enabled: false, started }));
  notebook?.sessionContext.kernelChanged.connect(watchKernelChanges);

  const kernel = notebook?.sessionContext.session?.kernel;
  // kernel?.anyMessage.connect((_, args) => console.log(args.direction, args.msg));
  withNullable(Messaging.sendStatusRequest)(kernel)?.onReply(
    startState(kernel!)
  );
};

const watchKernelChanges = (
  _: ISessionContext,
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
): void => {
  const kernel = change.newValue;
  withNullable(Messaging.sendStatusRequest)(kernel)?.onReply(
    startState(kernel!)
  );
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
