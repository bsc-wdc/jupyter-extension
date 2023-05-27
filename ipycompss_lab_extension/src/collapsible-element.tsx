import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import {
  caretDownIcon,
  caretRightIcon,
  Collapse
} from '@jupyterlab/ui-components';
import React from 'react';

namespace CollapsibleElement {
  export interface IProperties {
    label: string;
    children: React.ReactNode;
  }
}

const CollapsibleElement = ({
  label,
  children
}: CollapsibleElement.IProperties): JSX.Element => {
  const [state, setState] = React.useState({
    open: false,
    mainIcon: caretRightIcon,
    otherIcon: caretDownIcon
  });
  return (
    <>
      <div className="jp-stack-panel-header">
        <ToolbarButtonComponent
          icon={state.mainIcon}
          onClick={() => {
            setState(({ mainIcon, otherIcon }) => ({
              open: !open,
              mainIcon: otherIcon,
              otherIcon: mainIcon
            }));
          }}
        />
        <span className="jp-stack-panel-header-text">{label}</span>
      </div>
      <Collapse isOpen={state.open}>{children}</Collapse>
    </>
  );
};

export default CollapsibleElement;
