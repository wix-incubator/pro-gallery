export type ScrollingElement = ScrollingObject | HTMLElement | null;

export interface ScrollingObject {
  addEventListener(
    type: string, // eslint-disable-line
    listener: EventListenerOrEventListenerObject // eslint-disable-line
  ): void; // eslint-disable-line
  removeEventListener( // eslint-disable-line
    type: string, // eslint-disable-line
    listener: EventListener | EventListenerObject // eslint-disable-line
  ): void; // eslint-disable-line
  scrollTo?(x: number, y: number): void; // eslint-disable-line
}
