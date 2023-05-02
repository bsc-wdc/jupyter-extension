import { Kernel } from '@jupyterlab/services';

import InfoButtons from './info-buttons';
import ExecutionInfoMessaging from './messaging';

namespace ExecutionInfo {
  export const getExecutionInfo = (
    kernel: Kernel.IKernelConnection | null | undefined,
    type: InfoButtons.InfoType
  ): void => {
    ExecutionInfoMessaging.sendInfoRequest(kernel, { type });
  };
}

export default ExecutionInfo;
