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
    children: React.ReactNode;
  }
}

export const CollapsibleElement = ({
  label,
  children
}: CollapsibleElement.IProperties): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [icons, setIcons] = useState({
    main: caretRightIcon,
    other: caretDownIcon
  });
  return (
    <>
      <div className="jp-stack-panel-header">
        <ToolbarButtonComponent
          icon={icons.main}
          onClick={() => {
            setIcons({ main: icons.other, other: icons.main });
            setOpen(!open);
          }}
        />
        <span className="jp-stack-panel-header-text">{label}</span>
      </div>
      <Collapse isOpen={open}>{children}</Collapse>
    </>
  );
};
