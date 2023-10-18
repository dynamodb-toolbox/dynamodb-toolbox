import type { AtLeastOnce } from '../constants'
import type { $PrimitiveAttributeState, PrimitiveAttribute } from '../primitive/interface'
import type { PrimitiveAttributeEnumValues } from '../primitive/types'

interface SetAttributeElementState {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  enum: PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export type $SetAttributeElements = $PrimitiveAttributeState<
  'string' | 'number' | 'binary',
  SetAttributeElementState
>

export type SetAttributeElements = PrimitiveAttribute<
  'string' | 'number' | 'binary',
  SetAttributeElementState
>
