export interface IScrollingElement {
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
    scrollTo?: (x: number, y: number) => void;
}
