import { Kernel } from '@jupyterlab/services';

import MonitorMessaging from './messaging';
import Monitor from './monitor';

namespace MonitorManager {
  export const executeAction = (
    kernel: Kernel.IKernelConnection | null | undefined,
    action: Monitor.ActionType
  ): void => {
    MonitorMessaging.sendMonitorRequest(kernel, { action });
  };
}

export default MonitorManager;
