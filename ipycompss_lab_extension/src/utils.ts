export namespace Utils {
  export const capitalise = (name: string): string => {
    return name[0].toUpperCase() + name.slice(1);
  };

  export interface IOnReply<T> {
    onReply: (callback: (response: T) => void) => void;
  }
}
