import { ISessionContext, IWidgetTracker } from '@jupyterlab/apputils';
import { ConsolePanel } from '@jupyterlab/console';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

import StatusMessaging from './messaging';
import Status from './status';

namespace StatusManager {
  export const watchCurrentChanges =
    (setState: React.Dispatch<React.SetStateAction<Status.IState>>) =>
    (_: IWidgetTracker, panel: ConsolePanel | NotebookPanel | null): void => {
      setState(({ cluster, started, monitorStarted }) => ({
        enabled: false,
        cluster,
        started,
        monitorStarted
      }));
      panel?.sessionContext.kernelChanged.connect(watchKernelChanges(setState));

      const kernel = panel?.sessionContext.session?.kernel;
      startState(kernel, setState);
    };

  export const updateState = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ): void =>
    StatusMessaging.sendStatusRequest(kernel).onReply(
      ({
        cluster,
        started,
        monitor_started
      }: StatusMessaging.IStatusResponseDto) =>
        setState({
          cluster,
          enabled: true,
          started,
          monitorStarted: monitor_started
        })
    );

  const watchKernelChanges =
    (setState: React.Dispatch<React.SetStateAction<Status.IState>>) =>
    (
      _: ISessionContext,
      change: IChangedArgs<
        Kernel.IKernelConnection | null,
        Kernel.IKernelConnection | null
      >
    ): void => {
      const kernel = change.newValue;
      startState(kernel, setState);
    };

  const startState = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ) => {
    updateState(kernel, setState);
    kernel?.statusChanged.connect(cleanUpState(setState));
    kernel &&
      StatusMessaging.onStop(kernel, () =>
        setState(({ enabled, cluster, monitorStarted }) => ({
          enabled,
          cluster,
          started: false,
          monitorStarted
        }))
      );
  };

  const cleanUpState =
    (setState: React.Dispatch<React.SetStateAction<Status.IState>>) =>
    (_: Kernel.IKernelConnection, status: Kernel.Status) => {
      if (/^(?:unknown|restarting|autorestarting|dead)$/.test(status)) {
        setState(({ cluster, started, monitorStarted }) => ({
          enabled: false,
          cluster,
          started,
          monitorStarted
        }));
      }
    };
}

export default StatusManager;
