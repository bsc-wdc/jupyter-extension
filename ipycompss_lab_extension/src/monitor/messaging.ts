import { Kernel } from '@jupyterlab/services';
import { JSONObject } from '@lumino/coreutils';

import Monitor from './monitor';

namespace MonitorMessaging {
  export interface IMonitorRequestDto extends JSONObject {
    action: Monitor.ActionType;
  }

  export const sendMonitorRequest = (
    kernel: Kernel.IKernelConnection | null | undefined,
    data: IMonitorRequestDto
  ): void => {
    const monitorComm = kernel?.createComm('ipycompss_monitor_target');
    monitorComm?.open(data);
  };
}

export default MonitorMessaging;
