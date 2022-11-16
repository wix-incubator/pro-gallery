export function proxy<T extends Record<string, any>>(
  getter: (key: keyof T) => T[keyof T]
): T {
  return new Proxy(
    {},
    {
      get: (_, key) => getter(key as keyof T),
    }
  ) as T;
}
