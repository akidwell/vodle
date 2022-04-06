/** Return a deep clone of any non-cyclical object */
export function deepClone<T extends object | null | undefined>(obj: T): T {
  return obj ? JSON.parse(JSON.stringify(obj)) : null;
}
