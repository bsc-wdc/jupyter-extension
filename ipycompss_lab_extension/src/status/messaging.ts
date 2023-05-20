import { Kernel, KernelMessage } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

import Utils from '../utils';

namespace StatusMessaging {
  export interface IStatusResponseDto extends JSONObject {
    cluster: boolean;
    started: boolean;
    monitor_started: boolean;
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

  export const onStop = (
    kernel: Kernel.IKernelConnection,
    callback: () => void
  ): void => {
    kernel.registerCommTarget('ipycompss_stop_target', callback);
  };
}

export default StatusMessaging;
