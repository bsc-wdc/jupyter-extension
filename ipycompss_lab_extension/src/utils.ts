import { IConsoleTracker } from '@jupyterlab/console';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IKernelConnection } from '@jupyterlab/services/lib/kernel/kernel';

export namespace Utils {
  export interface IOnReply<T> {
    onReply: (callback: (response: T) => void) => void;
  }

  export const capitalise = (name: string): string => {
    return name[0].toUpperCase() + name.slice(1);
  };

  export const getKernel = (
    consoleTracker: IConsoleTracker,
    notebookTracker: INotebookTracker
  ): IKernelConnection | null | undefined =>
    consoleTracker.currentWidget?.sessionContext.session?.kernel ??
    notebookTracker.currentWidget?.sessionContext.session?.kernel;
}
