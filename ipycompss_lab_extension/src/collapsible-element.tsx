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
  const [open, setOpen] = React.useState(false);
  const [icons, setIcons] = React.useState({
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

export default CollapsibleElement;
