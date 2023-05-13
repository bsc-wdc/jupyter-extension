import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React from 'react';

import { compss_icon } from '../icon';
import { DocumentationButtonView, DocumentationIFrame } from './view';

namespace DocumentationButton {
  export interface IProperties {
    shell: ILabShell;
    restorer?: ILayoutRestorer;
  }
}

const REFERENCE_ID = 'pycompss-reference';
const REFERENCE_TITLE = 'PyCOMPSs reference';

const DocumentationButton = ({
  shell,
  restorer
}: DocumentationButton.IProperties): JSX.Element => (
  <DocumentationButtonView onClick={openDocumentation(shell, restorer)} />
);

const openDocumentation =
  (shell: ILabShell, restorer?: ILayoutRestorer) => async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some(
        (elem: Widget) => elem.id === REFERENCE_ID
      )
    ) {
      return;
    }

    const content = ReactWidget.create(
      <DocumentationIFrame title={REFERENCE_TITLE} />
    );
    const widget = new MainAreaWidget({ content });
    widget.title.label = REFERENCE_TITLE;
    widget.title.icon = compss_icon;
    widget.id = REFERENCE_ID;

    shell.add(widget, 'main', { mode: 'split-right' });
    restorer?.add(widget, REFERENCE_ID);
  };

export default DocumentationButton;
