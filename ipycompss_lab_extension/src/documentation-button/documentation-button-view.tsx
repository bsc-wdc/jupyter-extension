import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import React from 'react';

export namespace DocumentationButtonView {
  export interface IProperties {
    onClick: () => Promise<void>;
  }
}

export namespace DocumentationIFrame {
  export interface IProperties {
    title: string;
  }
}

const PYCOMPSS_REFERENCE_URL =
  'https://compss-doc.readthedocs.io/en/stable/Sections/02_App_Development/02_Python/01_Programming_model.html';

export const DocumentationButtonView = ({
  onClick
}: DocumentationButtonView.IProperties): JSX.Element => (
  <ToolbarButtonComponent label="Open documentation" onClick={onClick} />
);

export const DocumentationIFrame = ({
  title
}: DocumentationIFrame.IProperties): JSX.Element => (
  <iframe
    className="ipycompss-pycompss-reference"
    src={PYCOMPSS_REFERENCE_URL}
    title={title}
  />
);
