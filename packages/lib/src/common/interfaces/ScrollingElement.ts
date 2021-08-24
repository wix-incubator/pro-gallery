/* eslint-disable */
export type ScrollingElement = ScrollingObject | HTMLElement | null;

export interface ScrollingObject {
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener | EventListenerObject
  ): void;
  scrollTo?(x: number, y: number): void;
}
/* eslint-enable */
