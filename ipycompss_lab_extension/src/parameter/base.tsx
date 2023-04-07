import React, { useEffect } from 'react';

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
      {name.capitalise()}
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
  (event: EventType): void => {
    const value = getValue(event);
    values.current.set(name, value === defaultValue ? null : value);
  };
