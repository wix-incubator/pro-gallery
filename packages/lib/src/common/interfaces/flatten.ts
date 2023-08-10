import { Options } from './options';

export type OmitUndefinedRecursive<T> = T extends object
  ? {
      [K in keyof T]-?: OmitUndefinedRecursive<T[K]>;
    }
  : T;

export type FlattenTypePossibilities<T extends object, Prefix extends string = ''> = keyof T extends string
  ? {
      [K in keyof T]: T[K] extends object
        ? FlattenTypePossibilities<T[K], `${Prefix}${K}_`>
        : // eslint-disable-next-line no-unused-vars
          { [P in `${Prefix}${K}`]: T[K] };
    }[keyof T]
  : never;

// convert typescript OR to union, e.g. { a: 1 } | { b: 2 } => { a: 1 } & { b: 2 }
type UnionToType<U extends Record<string, unknown>> = {
  [K in U extends unknown ? keyof U : never]: U extends unknown ? (K extends keyof U ? U[K] : never) : never;
};

export type FlattenOptions = UnionToType<FlattenTypePossibilities<OmitUndefinedRecursive<Options>>>;
