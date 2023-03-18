import { IChangedArgs } from '@jupyterlab/coreutils';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Kernel } from '@jupyterlab/services';
import { ICommOpenMsg } from '@jupyterlab/services/lib/kernel/messages';
import { setEnabled } from './start-button';

export const watchNewNotebooks = ({}, notebook: NotebookPanel) => {
  notebook.context.sessionContext.kernelChanged.connect(watchKernelChanges);
};

const watchKernelChanges = (
  {},
  change: IChangedArgs<
    Kernel.IKernelConnection | null,
    Kernel.IKernelConnection | null
  >
) => {
  change.newValue?.registerCommTarget('ipycompss_init_target', setStartState);
};

const setStartState = ({}, msg: ICommOpenMsg) => {
  setEnabled(Number(Boolean(msg.content.data.cluster)));
};
