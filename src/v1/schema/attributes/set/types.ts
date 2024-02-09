import type { AtLeastOnce } from '../constants'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive/interface'
import type { PrimitiveAttributeEnumValues, PrimitiveAttributeType } from '../primitive/types'

interface SetAttributeElementState<TYPE extends PrimitiveAttributeType> {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  enum: PrimitiveAttributeEnumValues<TYPE>
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
  links: {
    key: undefined
    put: undefined
    update: undefined
  }
  transform: undefined | unknown
}

export type $SetAttributeElements =
  | $PrimitiveAttributeNestedState<'string', SetAttributeElementState<'string'>>
  | $PrimitiveAttributeNestedState<'number', SetAttributeElementState<'number'>>
  | $PrimitiveAttributeNestedState<'binary', SetAttributeElementState<'binary'>>

export type SetAttributeElements =
  | PrimitiveAttribute<'string', SetAttributeElementState<'string'>>
  | PrimitiveAttribute<'number', SetAttributeElementState<'number'>>
  | PrimitiveAttribute<'binary', SetAttributeElementState<'binary'>>
