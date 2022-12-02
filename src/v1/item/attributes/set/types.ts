import { AtLeastOnce } from '../constants'
import type { LeafAttribute, _LeafAttribute } from '../leaf/interface'
import { LeafAttributeEnumValues } from '../leaf/types'

export type _SetAttributeElements = _LeafAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  LeafAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>

export type SetAttributeElements = LeafAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  LeafAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>
