import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import * as React from 'react';

import '../style/index.css';
import compss_svg from '../resources/compss.svg';

const compss_icon = new LabIcon({
  name: 'ipycompss_lab_extension:compss',
  svgstr: compss_svg
});

/**
 * Initialization data for the ipycompss_lab_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'ipycompss_lab_extension:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    const title = 'IPyCOMPSs';
    const hello = () => {
      console.log("Hello, World!");
    };
    const jsx = (
      <div className="ipycompss-PyCOMPSsSidebar">
        <div className="jp-stack-panel-header">{title}</div>
        <button onClick={hello}>Test button</button>
      </div>
    );

    const widget = ReactWidget.create(jsx);
    widget.id = 'pycompss-left-menu';
    widget.title.icon = compss_icon;
    widget.addClass('ipycompss_lab_extension-PyCOMPSsSidebar');

    app.shell.add(widget, 'left', { rank: 550 });
  }
};

export default plugin;
