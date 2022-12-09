import { AtLeastOnce } from '../constants'
import type { PrimitiveAttribute, _PrimitiveAttribute } from '../primitive/interface'
import { PrimitiveAttributeEnumValues } from '../primitive/types'

export type _SetAttributeElements = _PrimitiveAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>

export type SetAttributeElements = PrimitiveAttribute<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>,
  undefined
>
