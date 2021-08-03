export interface CustomComponents {
  customHoverRenderer?: (props: { [key: string]: any }) => unknown;
  customInfoRenderer?: (props: { [key: string]: any }) => unknown;
  customSlideshowInfoRenderer?: (props: { [key: string]: any }) => unknown;
  customNavArrowsRenderer?: (direction: NavArrowDirection) => unknown;
  customImageRenderer?: (props: { [key: string]: any }) => unknown;
  customLoadMoreRenderer?: (props: { [key: string]: any }) => unknown;
}

type NavArrowDirection = 'left' | 'right';
