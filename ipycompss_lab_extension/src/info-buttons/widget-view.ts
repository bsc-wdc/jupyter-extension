import { output } from '@jupyter-widgets/jupyterlab-manager';
import { JupyterFrontEnd } from '@jupyterlab/application';

import { compss_icon } from '../icon';

export const INFO_ID = 'pycompss-execution-info-';

export const WidgetView = (
  shell: JupyterFrontEnd.IShell
): typeof output.OutputView =>
  class extends output.OutputView {
    render() {
      super.render();

      const outputArea = this._outputView;
      outputArea.addClass('jp-LinkedOutputView');
      outputArea.title.closable = true;
      outputArea.title.label = this.model.get('title');
      outputArea.title.icon = compss_icon;
      outputArea.id = INFO_ID + this.model.get('type');

      //outputArea.parent?.disposed.connect(() => this.model.destroy());
      shell.add(outputArea, 'main', { mode: 'split-right' });
    }
  };
