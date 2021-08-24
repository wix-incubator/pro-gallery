/* eslint-disable */
import { ReactNode } from 'react';

export interface CustomComponents {
  customHoverRenderer?: (props: { [key: string]: any }) => ReactNode; // eslint-disable-line
  customInfoRenderer?: (props: { [key: string]: any }) => ReactNode; // eslint-disable-line
  customSlideshowInfoRenderer?: (props: { [key: string]: any }) => ReactNode; // eslint-disable-line
  customNavArrowsRenderer?: (direction: 'left' | 'right') => ReactNode; // eslint-disable-line
  customImageRenderer?: (props: { [key: string]: any }) => ReactNode; // eslint-disable-line
  customLoadMoreRenderer?: (props: { [key: string]: any }) => ReactNode; // eslint-disable-line
}
/* eslint-enable */
