export interface EventsListener {
  (eventName: string, eventData: EventData): void;
}

interface EventData {
  [key: string]: any;
}
