import type { Update } from '~/types/update'

type Updater = <OBJECT extends object, PROPERTY extends string, NEW_VALUE>(
  object: OBJECT,
  property: PROPERTY,
  newValue: NEW_VALUE
) => Update<OBJECT, PROPERTY, NEW_VALUE>

export const update: Updater = <OBJECT extends object, PROPERTY extends string, NEW_VALUE>(
  object: OBJECT,
  property: PROPERTY,
  newValue: NEW_VALUE
) => ({ ...object, [property]: newValue }) as Update<OBJECT, PROPERTY, NEW_VALUE>
