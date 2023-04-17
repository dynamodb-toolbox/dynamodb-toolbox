type PropertyAdder = <OBJECT extends Record<string, unknown>, NAME extends string, VALUE>(
  object: OBJECT,
  name: NAME,
  value: VALUE
) => Omit<OBJECT, NAME> & Record<NAME, VALUE>

export const addProperty: PropertyAdder = (object, name, value) => ({ ...object, [name]: value })
