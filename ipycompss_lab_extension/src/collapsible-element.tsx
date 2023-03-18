import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import {
  caretDownIcon,
  caretRightIcon,
  Collapse
} from '@jupyterlab/ui-components';
import React, { useState } from 'react';

export namespace CollapsibleElement {
  export interface IProperties {
    label: string;
    Element: () => JSX.Element;
  }
}

let icon = caretDownIcon;
let otherIcon = caretRightIcon;
export const CollapsibleElement = ({
  label,
  Element
}: CollapsibleElement.IProperties): JSX.Element => {
  const [open, setOpen] = useState(0);

  return (
    <>
      <div className="jp-stack-panel-header">
        <ToolbarButtonComponent
          icon={icon}
          onClick={() => {
            [icon, otherIcon] = [otherIcon, icon];
            setOpen(Number(!open));
          }}
        />
        <span className="jp-extensionmanager-headerText">{label}</span>
      </div>
      <Collapse isOpen={Boolean(open)}>
        <Element />
      </Collapse>
    </>
  );
};
