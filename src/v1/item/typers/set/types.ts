import { AtLeastOnce } from '../constants'
import type { Leaf } from '../leaf/interface'
import { EnumValues } from '../leaf/types'

export type SetAttributeElements = Leaf<
  'string' | 'number' | 'binary',
  AtLeastOnce,
  false,
  boolean,
  undefined,
  EnumValues<'string' | 'number' | 'binary'>,
  undefined
>
