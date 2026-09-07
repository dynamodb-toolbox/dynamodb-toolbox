/** Type guard checking that `obj` owns `key`, narrowing `obj` accordingly. */
export const has = <OBJ extends object, KEY extends string>(
  obj: OBJ,
  key: KEY
): obj is Extract<OBJ, { [key in KEY]: unknown }> => key in obj
