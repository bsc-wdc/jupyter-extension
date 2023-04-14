import { MenuItem } from '@blueprintjs/core';
import { Button, Select } from '@jupyterlab/ui-components';
import React, { useState } from 'react';

import { onChange, Parameter } from './base';

export namespace EnumerationParameter {
  export interface IProperties extends Parameter.IProperties<string> {
    options: string[];
  }
}

export const EnumerationParameter = ({
  name,
  values,
  defaultValue,
  toSend,
  options
}: EnumerationParameter.IProperties): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState(defaultValue);
  return (
    <Parameter name={name} values={values}>
      <Select
        filterable={false}
        items={options}
        itemRenderer={(item: string, { handleClick }): JSX.Element => (
          <MenuItem key={item} text={item} onClick={handleClick} />
        )}
        onItemSelect={item => {
          setSelectedItem(item);
          onChange<string, string>(
            name,
            values,
            ...((toSend
              ? [defaultValue, getValueToSend]
              : [`"${defaultValue}"`, getValue]) as [
              string,
              (item: string) => string
            ])
          )(item);
        }}
        popoverProps={{ usePortal: false }}
      >
        <Button text={selectedItem} rightIcon="double-caret-vertical" />
      </Select>
    </Parameter>
  );
};

const getValue = (item: string): string => `"${getValueToSend(item)}"`;

const getValueToSend = (item: string): string => item;
