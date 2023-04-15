import React, { useEffect } from 'react';
import { Utils } from '../utils';

export namespace Parameter {
  export interface ICommonProperties<Type> {
    name: string;
    values: React.MutableRefObject<Map<string, any>>;
    defaultValue: Type;
    children?: React.ReactNode;
  }

  export interface IProperties<Type> extends ICommonProperties<Type> {
    toSend: boolean;
  }
}

export const Parameter = <Type,>({
  name,
  values,
  defaultValue,
  children
}: Parameter.ICommonProperties<Type>): JSX.Element => {
  useEffect(() => {
    values.current.set(name, { default: defaultValue });
  }, []);
  return (
    <div className="ipycompss-parameter">
      {Utils.capitalise(name)}
      {children}
    </div>
  );
};

export const onChange =
  <Type, EventType>(
    name: string,
    values: React.MutableRefObject<Map<string, any>>,
    defaultValue: Type | string,
    getValue: (event: EventType) => Type | string
  ) =>
  (event: EventType): void => {
    const value = getValue(event);
    values.current.set(
      name,
      value === defaultValue ? { default: value } : value
    );
  };
