const memoryMap = new Map<any, any>();

export function isNew(pre, next, value) {
  memoryMap.set(next, value);
  const old = memoryMap.get(pre);
  memoryMap.delete(pre);
  return old !== value;
}
