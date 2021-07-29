export interface EventsListener {
  (eventName: string, eventData: Record<string, any>): void;
}
