/* eslint-disable */
import { ReactNode } from 'react';

export interface CustomComponents {
  customHoverRenderer?: (props: { [key: string]: any }) => ReactNode;
  customInfoRenderer?: (props: { [key: string]: any }) => ReactNode;
  customNavArrowsRenderer?: (direction: 'left' | 'right') => ReactNode;
  customImageRenderer?: (props: { [key: string]: any }) => ReactNode;
  customLoadMoreRenderer?: (props: { [key: string]: any }) => ReactNode;
}
/* eslint-enable */
