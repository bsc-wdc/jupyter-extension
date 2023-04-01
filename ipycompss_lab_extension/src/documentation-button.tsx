import { JupyterFrontEnd } from '@jupyterlab/application';
import {
  MainAreaWidget,
  ReactWidget,
  ToolbarButtonComponent
} from '@jupyterlab/apputils';
import React from 'react';
import { compss_icon } from './compss_icon';

export namespace DocumentationButton {
  export interface IProperties {
    shell: JupyterFrontEnd.IShell;
  }
}

export const DocumentationButton = ({
  shell
}: DocumentationButton.IProperties): JSX.Element => (
  <ToolbarButtonComponent
    label="Open documentation"
    onClick={openDocumentation(shell)}
  />
);

const PYCOMPSS_REFERENCE_URL =
  'https://compss-doc.readthedocs.io/en/stable/Sections/02_App_Development/02_Python/01_Programming_model.html';
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
      <iframe
        className="ipycompss-pycompss-reference"
        src={PYCOMPSS_REFERENCE_URL}
        title={REFERENCE_TITLE}
      ></iframe>
    );
    const widget = new MainAreaWidget({ content: content });
    widget.title.label = REFERENCE_TITLE;
    widget.title.icon = compss_icon;
    widget.id = REFERENCE_ID;

    shell.add(widget, 'main', { mode: 'split-right' });
  };
