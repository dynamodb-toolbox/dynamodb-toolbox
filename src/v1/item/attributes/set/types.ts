import { AtLeastOnce } from '../constants'
import type { FrozenLeafAttribute, LeafAttribute } from '../leaf/interface'
import { LeafAttributeEnumValues } from '../leaf/types'

export type SetAttributeElements = LeafAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  LeafAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>

export type FrozenSetAttributeElements = FrozenLeafAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  LeafAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>
