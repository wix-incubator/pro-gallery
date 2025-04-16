import { proxy } from './proxy';

export default class Emitter<T extends Record<string, (...args: any[]) => void>> {
  private listeners: Partial<{
    [K in keyof T]: T[K][];
  }> = {};

  on<K extends keyof T>(event: K, listener: T[K]) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]!.push(listener);
    return {
      remove: () => {
        this.off(event, listener);
      },
    };
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const listener = this.listeners[event];
    if (listener) {
      listener.forEach((listener) => listener(...args));
    }
  }

  off<K extends keyof T>(event: K, listener: T[K]): void {
    const listeners = this.listeners[event];
    if (listeners) {
      listeners.splice(listeners.indexOf(listener), 1);
    }
  }

  get call() {
    return proxy<{
      [K in keyof T]: (...args: Parameters<T[K]>) => void;
    }>((property) => {
      return (...args: Parameters<T[typeof property]>) => {
        this.emit(property, ...args);
      };
    });
  }

  get listen() {
    return proxy<{
      [K in keyof T]: (listener: T[K]) => () => void;
    }>((property) => {
      return (listener) => {
        this.on(property, listener);
        return () => {
          this.off(property, listener);
        };
      };
    });
  }
}
