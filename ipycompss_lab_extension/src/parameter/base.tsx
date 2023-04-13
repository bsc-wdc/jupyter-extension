import React, { useEffect } from 'react';
import { Utils } from '../utils';

export namespace Parameter {
  export interface ICommonProperties {
    name: string;
    values: React.MutableRefObject<Map<string, any>>;
    children?: React.ReactNode;
  }

  export interface IProperties<Type> extends ICommonProperties {
    defaultValue: Type;
    toSend: boolean;
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
      {Utils.capitalise(name)}
      {children}
    </div>
  );
};

export const onChange =
  <Type extends any, EventType extends any>(
    name: string,
    values: React.MutableRefObject<Map<string, Type | string | null>>,
    defaultValue: Type | string,
    getValue: (event: EventType) => Type | string
  ) =>
  (event: EventType): void => {
    const value = getValue(event);
    values.current.set(name, value === defaultValue ? null : value);
  };
