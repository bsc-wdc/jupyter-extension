import { output } from '@jupyter-widgets/jupyterlab-manager';
import { ILabShell } from '@jupyterlab/application';

import { compss_icon } from '../icon';
import { toArray } from '@lumino/algorithm';
import { Widget } from '@lumino/widgets';

function WidgetView(shell: ILabShell): typeof output.OutputView {
  return class extends output.OutputView {
    render() {
      super.render();

      const outputArea = this._outputView;
      outputArea.addClass('jp-LinkedOutputView');
      outputArea.title.closable = true;
      outputArea.title.label = this.model.get('title');
      outputArea.title.icon = compss_icon;
      outputArea.id = WidgetView.INFO_ID + this.model.get('type');

      shell.add(outputArea, 'main', { mode: 'split-right' });
      shell.layoutModified.connect(() => {
        if (
          toArray(shell.widgets('main')).every(
            (widget: Widget) => widget.id !== outputArea.id
          )
        ) {
          this.model.close();
        }
      });
    }
  };
}

namespace WidgetView {
  export const INFO_ID = 'pycompss-execution-info-';
}

export default WidgetView;
