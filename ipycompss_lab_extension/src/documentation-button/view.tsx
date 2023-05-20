import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { launchIcon } from '@jupyterlab/ui-components';
import React from 'react';

const PYCOMPSS_REFERENCE_URL =
  'https://compss-doc.readthedocs.io/en/stable/Sections/02_App_Development/02_Python/01_Programming_model.html';

function DocumentationButtonView({
  onClick
}: DocumentationButtonView.IProperties): JSX.Element {
  return (
    <ToolbarButtonComponent
      className="ipycompss-button"
      label="Open documentation"
      icon={launchIcon}
      onClick={onClick}
    />
  );
}

namespace DocumentationButtonView {
  export interface IProperties {
    onClick: () => Promise<void>;
  }

  export namespace DocumentationIFrame {
    export interface IProperties {
      title: string;
    }
  }

  export const DocumentationIFrame = ({
    title
  }: DocumentationIFrame.IProperties): JSX.Element => (
    <iframe
      className="ipycompss-pycompss-reference"
      src={PYCOMPSS_REFERENCE_URL}
      title={title}
    />
  );
}

export default DocumentationButtonView;
