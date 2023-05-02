import { Kernel, KernelMessage } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

import InfoButtons from './info-buttons';

namespace ExecutionInfoMessaging {
  export interface IInfoRequestDto extends JSONObject {
    type: InfoButtons.InfoType;
  }

  export interface IInfoResponseDto extends JSONObject {
    code: string;
  }

  export const sendInfoRequest = (
    kernel: Kernel.IKernelConnection | null | undefined,
    data: IInfoRequestDto
  ): void => {
    const infoComm = kernel?.createComm('ipycompss_execution_info_target');
    infoComm?.open(data);
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

export default ExecutionInfoMessaging;
