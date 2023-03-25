import React from 'react';

import { capitalise } from '../utils';

export namespace Parameter {
  export interface ICommonProperties {
    name: string;
    children?: React.ReactNode;
  }

  export interface IProperties<Type> {
    common: ICommonProperties;
    state: [Map<string, any>, (value: Map<string, any>) => void];
    defaultValue: Type;
  }
}

export const Parameter = ({
  name,
  children
}: Parameter.ICommonProperties): JSX.Element => (
  <div className="ipycompss-parameter">
    {capitalise(name)}
    {children}
  </div>
);

export const onChange =
  <Type extends any, EventType extends any>(
    name: string,
    [values, setValues]: [Map<string, any>, (values: Map<string, any>) => void],
    defaultValue: Type,
    getValue: (event: EventType) => Type
  ) =>
  (event: any): void => {
    const value = getValue(event);
    if (value === defaultValue) {
      values.delete(name);
    } else {
      values.set(name, value);
    }
    setValues(values);
    console.log(value, values);
  };
