type Picker = <OBJECT extends object, KEYS extends string[]>(
  obj: OBJECT,
  ...keys: KEYS
) => Pick<OBJECT, Extract<KEYS[number], keyof OBJECT>>

export const pick: Picker = <OBJECT extends object, KEYS extends string[]>(
  obj: OBJECT,
  ...keys: KEYS
) => {
  const keySet = new Set<KEYS[number]>(keys)

  return Object.fromEntries(Object.entries(obj).filter(([key]) => keySet.has(key))) as Pick<
    OBJECT,
    Extract<KEYS[number], keyof OBJECT>
  >
}
