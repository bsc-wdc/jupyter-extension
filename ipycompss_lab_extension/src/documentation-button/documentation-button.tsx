import { ILabShell, ILayoutRestorer } from '@jupyterlab/application';
import { MainAreaWidget, ReactWidget } from '@jupyterlab/apputils';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';
import React from 'react';

import Icon from '../icon';
import DocumentationButtonView from './view';

namespace DocumentationButton {
  export interface IProperties {
    shell: ILabShell;
    restorer?: ILayoutRestorer;
  }
}

const REFERENCE_ID = 'pycompss-reference';
const REFERENCE_TITLE = 'PyCOMPSs reference';

const DocumentationButton = (
  props: DocumentationButton.IProperties
): JSX.Element => (
  <DocumentationButtonView onClick={openDocumentation(props)} />
);

const openDocumentation =
  ({ shell, restorer }: DocumentationButton.IProperties) =>
  async (): Promise<void> => {
    if (
      toArray(shell.widgets('main')).some(
        (elem: Widget) => elem.id === REFERENCE_ID
      )
    ) {
      return;
    }

    const content = ReactWidget.create(
      <DocumentationButtonView.DocumentationIFrame title={REFERENCE_TITLE} />
    );
    const widget = new MainAreaWidget({ content });
    widget.title.label = REFERENCE_TITLE;
    widget.title.icon = Icon.compss_icon;
    widget.id = REFERENCE_ID;

    shell.add(widget, 'main', { mode: 'split-right' });
    restorer?.add(widget, REFERENCE_ID);
  };

export default DocumentationButton;
