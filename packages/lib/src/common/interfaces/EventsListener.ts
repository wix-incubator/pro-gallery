/* eslint-disable */
export interface EventsListener {
  (eventName: string, eventData: EventData): void;
}

interface EventData {
  [key: string]: any;
}
/* eslint-enable */
