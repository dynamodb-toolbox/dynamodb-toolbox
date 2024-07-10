type Omitter = <OBJECT extends object, KEYS extends string[]>(
  obj: OBJECT,
  ...keys: KEYS
) => Omit<OBJECT, KEYS[number]>

export const omit: Omitter = <OBJECT extends object, KEYS extends string[]>(
  obj: OBJECT,
  ...keys: KEYS
) => {
  const keySet = new Set<KEYS[number]>(keys)

  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keySet.has(key))) as Omit<
    OBJECT,
    KEYS[number]
  >
}
