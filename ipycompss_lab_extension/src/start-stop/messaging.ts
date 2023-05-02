import { Kernel, KernelMessage } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

import Utils from '../utils';

namespace StartStopMessaging {
  export interface IStartRequestDto extends JSONObject {
    arguments: JSONObject;
  }

  export interface ISuccessResponseDto extends JSONObject {
    success: boolean;
  }

  export interface IStatusResponseDto extends JSONObject {
    started: boolean;
  }

  export const sendStatusRequest = (
    kernel: Kernel.IKernelConnection | null | undefined
  ): Utils.IOnReply<IStatusResponseDto> => {
    const statusComm = kernel?.createComm('ipycompss_status_target');
    statusComm?.open();
    return {
      onReply: (callback: (response: IStatusResponseDto) => void) => {
        statusComm &&
          (statusComm.onMsg = (
            message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
          ): void => callback(message.content.data as IStatusResponseDto));
      }
    };
  };

  export const sendInitRequest = (
    kernel: Kernel.IKernelConnection | null | undefined
  ): Utils.IOnReply<ISuccessResponseDto> => {
    const initComm = kernel?.createComm('ipycompss_init_target');
    initComm?.open();
    return {
      onReply: (callback: (response: ISuccessResponseDto) => void) => {
        initComm &&
          (initComm.onMsg = (
            message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
          ): void => callback(message.content.data as ISuccessResponseDto));
      }
    };
  };

  export const sendStartRequest = (
    kernel: Kernel.IKernelConnection | null | undefined,
    data: IStartRequestDto
  ): Utils.IOnReply<ISuccessResponseDto> => {
    const startComm = kernel?.createComm('ipycompss_start_target');
    startComm?.open(data);
    return {
      onReply: (callback: (response: ISuccessResponseDto) => void) => {
        startComm &&
          (startComm.onMsg = (
            message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
          ): void => callback(message.content.data as ISuccessResponseDto));
      }
    };
  };

  export const sendStopRequest = (
    kernel: Kernel.IKernelConnection | null | undefined
  ): Utils.IOnReply<ISuccessResponseDto> => {
    const stopComm = kernel?.createComm('ipycompss_stop_target');
    stopComm?.open();
    return {
      onReply: (callback: (response: ISuccessResponseDto) => void) => {
        stopComm &&
          (stopComm.onMsg = (
            message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
          ): void => callback(message.content.data as ISuccessResponseDto));
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

export default StartStopMessaging;
