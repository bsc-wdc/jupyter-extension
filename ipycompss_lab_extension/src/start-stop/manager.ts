import { Kernel } from '@jupyterlab/services';
import { toObject } from '@lumino/algorithm';

import Status from '../status';
import StartStopMessaging from './messaging';

namespace StartStopManager {
  export const init = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ): {
    onFailure: (
      updateState: (
        kernel: Kernel.IKernelConnection | null | undefined,
        setState: React.Dispatch<React.SetStateAction<Status.IState>>
      ) => void,
      callback: () => void
    ) => void;
  } => ({
    onFailure: (updateState, callback) => {
      StartStopMessaging.sendInitRequest(kernel).onReply(
        ({ success }: StartStopMessaging.ISuccessResponseDto) => {
          setTimeout(() => updateState(kernel, setState), 500);
          success || callback();
        }
      );
    }
  });

  export const startPycompss = (
    kernel: Kernel.IKernelConnection | null | undefined,
    values: Map<string, any>,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ): void =>
    StartStopMessaging.sendStartRequest(kernel, {
      arguments: toObject(
        Array.from(values).map(([key, value]: [string, any]) => [
          key,
          value.default ?? value
        ])
      )
    }).onReply(({ success }: StartStopMessaging.ISuccessResponseDto): void =>
      setState(({ enabled, cluster, monitorStarted }) => ({
        enabled,
        cluster,
        started: success,
        monitorStarted
      }))
    );

  export const stopPycompss = (
    kernel: Kernel.IKernelConnection | null | undefined,
    setState: React.Dispatch<React.SetStateAction<Status.IState>>
  ): void =>
    StartStopMessaging.sendStopRequest(kernel).onReply(
      ({ success }: StartStopMessaging.ISuccessResponseDto) =>
        setState(({ enabled, cluster, monitorStarted }) => ({
          enabled,
          cluster,
          started: !success,
          monitorStarted
        }))
    );
}

export default StartStopManager;
