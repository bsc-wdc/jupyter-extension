import { Kernel, KernelMessage } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

export namespace ExecutionInfoMessaging {
  export interface IInfoResponseDto extends JSONObject {
    code: string;
  }

  export const sendInfoRequest = (
    kernel: Kernel.IKernelConnection | null | undefined
  ): void => {
    const infoComm = kernel?.createComm('ipycompss_execution_info_target');
    infoComm?.open();
    infoComm &&
      (infoComm.onMsg = (
        message: KernelMessage.ICommMsgMsg<'iopub' | 'shell'>
      ) => {
        kernel?.requestExecute({
          code: (message.content.data as IInfoResponseDto).code,
          silent: true
        });
      });
  };
}
