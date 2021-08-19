export interface EventsListener {
  (eventName: string, eventData: EventData): void; // eslint-disable-line
}

interface EventData {
  [key: string]: any;
}
