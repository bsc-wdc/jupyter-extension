import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';

namespace Utils {
  export interface IOnReply<T> {
    onReply: (callback: (response: T) => void) => void;
  }

  export const capitalise = (name: string): string => {
    return name[0].toUpperCase() + name.slice(1);
  };

  export const getKernel = (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker
  ): Kernel.IKernelConnection | null | undefined =>
    consoleTracker.currentWidget?.sessionContext.session?.kernel ??
    notebookTracker.currentWidget?.sessionContext.session?.kernel;
}

export default Utils;
