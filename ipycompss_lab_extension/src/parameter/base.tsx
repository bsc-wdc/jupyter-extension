import React, { useEffect } from 'react';

import { capitalise } from '../utils';

export namespace Parameter {
  export interface ICommonProperties {
    name: string;
    values: React.MutableRefObject<Map<string, string | null>>;
    children?: React.ReactNode;
  }

  export interface IProperties<Type> {
    common: ICommonProperties;
    defaultValue: Type;
  }
}

export const Parameter = ({
  name,
  values,
  children
}: Parameter.ICommonProperties): JSX.Element => {
  useEffect(() => {
    values.current.set(name, null);
  }, []);
  return (
    <div className="ipycompss-parameter">
      {capitalise(name)}
      {children}
    </div>
  );
};

export const onChange =
  <Type extends any, EventType extends any>(
    name: string,
    values: React.MutableRefObject<Map<string, string | null>>,
    defaultValue: Type,
    getValue: (event: EventType) => string
  ) =>
  (event: any): void => {
    const value = getValue(event);
    values.current.set(name, value === defaultValue ? null : value);
  };
