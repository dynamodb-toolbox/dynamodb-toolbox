import type { O } from 'ts-toolbelt'

type Updater = <OBJECT extends object, PROPERTY extends string, NEW_VALUE>(
  object: OBJECT,
  property: PROPERTY,
  newValue: NEW_VALUE
) => O.Update<OBJECT, PROPERTY, NEW_VALUE>

export const update: Updater = <OBJECT extends object, PROPERTY extends string, NEW_VALUE>(
  object: OBJECT,
  property: PROPERTY,
  newValue: NEW_VALUE
) => ({ ...object, [property]: newValue } as O.Update<OBJECT, PROPERTY, NEW_VALUE>)
