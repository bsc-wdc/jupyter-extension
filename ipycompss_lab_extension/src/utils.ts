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

export interface IOnReply<T> {
  onReply: (callback: (response: T) => void) => void;
}
