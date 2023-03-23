import { JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, ToolbarButtonComponent } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import React from 'react';

export namespace TabButton {
  export interface IProperties {
    shell: JupyterFrontEnd.IShell;
  }
}

export const TabButton = ({ shell }: TabButton.IProperties): JSX.Element => (
  <ToolbarButtonComponent label="New tab" onClick={addNewTab(shell)} />
);

const addNewTab =
  (shell: JupyterFrontEnd.IShell) => async (): Promise<void> => {
    const content = new Widget();
    const widget = new MainAreaWidget({ content: content });

    shell.add(widget, 'main', { mode: 'split-right' });
  };
