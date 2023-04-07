declare global {
  /* eslint-disable @typescript-eslint/naming-convention */
  interface String {
    capitalise(): string;
  }
  /* eslint-enable @typescript-eslint/naming-convention */
}

String.prototype.capitalise = function (this: string): string {
  return this[0].toUpperCase() + this.slice(1);
};

export const withNullable = (f: (...args: any) => any): any => {
  return (...args: Array<any>): any => {
    if (args.some((arg: any) => arg === null || arg === undefined)) {
      return;
    }

    return f(...args);
  };
};
