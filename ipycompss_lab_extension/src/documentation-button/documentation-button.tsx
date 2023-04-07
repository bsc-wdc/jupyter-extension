import { JupyterFrontEnd } from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import { compss_icon } from '../icon';
import {
  DocumentationButtonView,
  DocumentationIFrame
} from './documentation-button-view';

export namespace DocumentationButton {
  export interface IProperties {
    shell: JupyterFrontEnd.IShell;
  }
}

export const DocumentationButton = ({
  shell
}: DocumentationButton.IProperties): JSX.Element => (
  <DocumentationButtonView onClick={openDocumentation(shell)} />
);

const REFERENCE_ID = 'pycompss-reference';
const REFERENCE_TITLE = 'PyCOMPSs reference';

const openDocumentation =
  (shell: JupyterFrontEnd.IShell) => async (): Promise<void> => {
    const iterator = shell.widgets('main');
    let elem = iterator.next();
    let found = false;
    while (!found && elem !== undefined) {
      found = elem.id === REFERENCE_ID;
      elem = iterator.next();
    }
    if (found) {
      return;
    }
    const content = ReactWidget.create(
      <DocumentationIFrame title={REFERENCE_TITLE} />
    );
    const widget = new MainAreaWidget({ content: content });
    widget.title.label = REFERENCE_TITLE;
    widget.title.icon = compss_icon;
    widget.id = REFERENCE_ID;

    shell.add(widget, 'main', { mode: 'split-right' });
  };
