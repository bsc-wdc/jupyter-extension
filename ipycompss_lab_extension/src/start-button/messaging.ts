import { Kernel, KernelMessage } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

export namespace Messaging {
  export interface IStartRequestDto extends JSONObject {
    arguments: JSONObject;
  }

  export interface IStartResponseDto extends JSONObject {
    success: boolean;
  }

  export interface IStatusResponseDto extends JSONObject {
    cluster: boolean;
    started: boolean;
  }

  export interface IOnReply<T> {
    onReply: (callback: (response: T) => void) => void;
  }

  export const sendStartRequest = (
    kernel: Kernel.IKernelConnection,
    data: IStartRequestDto
  ): IOnReply<IStartResponseDto> => {
    const startComm = kernel.createComm('ipycompss_start_target');
    startComm.open(data);
    return {
      onReply: (callback: (response: IStartResponseDto) => void) => {
        startComm.onMsg = (
          message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
        ): void => callback(message.content.data as IStartResponseDto);
      }
    };
  };

  export const sendStatusRequest = (
    kernel: Kernel.IKernelConnection
  ): IOnReply<IStatusResponseDto> => {
    const statusComm = kernel.createComm('ipycompss_status_target');
    statusComm.open();
    return {
      onReply: (callback: (response: IStatusResponseDto) => void) => {
        statusComm.onMsg = (
          message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
        ): void => callback(message.content.data as IStatusResponseDto);
      }
    };
  };

  export const onStop = (
    kernel: Kernel.IKernelConnection,
    callback: () => void
  ): void => {
    kernel.registerCommTarget('ipycompss_stop_target', callback);
  };
}
