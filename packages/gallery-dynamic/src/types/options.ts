/* eslint-disable @typescript-eslint/ban-types */
import { IColor, IItemCss } from './css';
import { ItemLocation } from './item';

export enum StyleType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  ROTATION = 'ROTATION',
  COLOR = 'COLOR',
  LOCATION = 'LOCATION',
  BORDER_RADIUS = 'BORDER_RADIUS',
}

export type StyleTypesValues = {
  [StyleType.NUMBER]: number;
  [StyleType.STRING]: string;
  [StyleType.BOOLEAN]: boolean;
  [StyleType.ROTATION]: number;
  [StyleType.COLOR]: IColor;
  [StyleType.LOCATION]: Omit<ItemLocation, 'height' | 'width'>;
  [StyleType.BORDER_RADIUS]: IItemCss['borderRadius'];
};

export interface StyleTypesMetaData extends Record<StyleType, unknown> {
  [StyleType.NUMBER]: {
    min: number;
    max: number;
  };
  [StyleType.STRING]: {
    values?: string[];
    maxLength?: number;
  };
  [StyleType.BOOLEAN]: {
    type: 'switch' | 'checkbox';
  };
  [StyleType.ROTATION]: {
    min: number;
    max: number;
  };
}

type ValueOf<T extends Record<string, unknown>> = T[keyof T];

type FlattenObject<T extends object, BaseName extends string = ''> = ValueOf<{
  [D in keyof T]: ValueOf<{
    [K in keyof T]: Exclude<T[K], undefined> extends object
      ? FlattenObject<
          Exclude<T[K], undefined>,
          `${BaseName}.${K extends string ? K : ''}`
        >
      : K extends string
      ? {
          [Sub in `${BaseName}.${K}`]: T[K];
        }
      : never;
  }>;
}>;

type Combine<T> = T extends infer K ? keyof K : never;

// type FlattenObject<T extends object> = FlattenObjectR<T>;

type FlattenStyles = Combine<FlattenObject<IItemCss>>;

export interface StyleOptionController<
  T extends StyleType = StyleType.BOOLEAN
> {
  type: T;
  onChange:
    | ((value: StyleTypesValues[T], style: IItemCss) => IItemCss)
    | FlattenStyles;
  getValue:
    | ((style: IItemCss) => StyleTypesValues[T] | undefined)
    | FlattenStyles;
  metaData?: StyleTypesMetaData[T];
}
