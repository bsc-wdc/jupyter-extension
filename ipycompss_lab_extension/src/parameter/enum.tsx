import { MenuItem } from '@blueprintjs/core';
import { Button, Select } from '@jupyterlab/ui-components';
import React, { useState } from 'react';

import { onChange, Parameter } from './base';

export namespace EnumerationParameter {
  export interface IProperties {
    properties: Parameter.IProperties<string>;
    options: string[];
  }
}

export const EnumerationParameter = ({
  properties: {
    common: { name },
    state: [values, setValues],
    defaultValue
  },
  options
}: EnumerationParameter.IProperties): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState(defaultValue);
  return (
    <Parameter name={name}>
      <Select
        items={options}
        itemRenderer={(item: string, { handleClick }): JSX.Element => (
          <MenuItem key={item} text={item} onClick={handleClick} />
        )}
        onItemSelect={item => {
          setSelectedItem(item);
          onChange<string, string>(
            name,
            [values, setValues],
            defaultValue,
            getValue
          )(item);
        }}
        filterable={false}
      >
        <Button text={selectedItem} rightIcon="double-caret-vertical" />
      </Select>
    </Parameter>
  );
};

const getValue = (item: string): string => item;
