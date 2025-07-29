/* eslint-disable */
declare namespace React {
  type ReactNode = any;
}

export interface CustomComponents {
  customHoverRenderer?: (props: { [key: string]: any }) => React.ReactNode;
  customInfoRenderer?: (props: { [key: string]: any }) => React.ReactNode;
  customNavArrowsRenderer?: (direction: 'left' | 'right') => React.ReactNode;
  customImageRenderer?: (props: { [key: string]: any }) => React.ReactNode;
  customLoadMoreRenderer?: (props: { [key: string]: any }) => React.ReactNode;
}
/* eslint-enable */
