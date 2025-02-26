import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type {
  $StringAttributeNestedState,
  StringAttribute,
  StringAttributeState,
  StringSchema
} from '../string/index.js'
import type { $AttributeNestedState, AttrSchema } from '../types/index.js'

interface RecordKeyAndElementState extends SharedAttributeState {
  required?: AtLeastOnce
  hidden?: false
  key?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

// TODO: Re-introduce constraint in interface (not only in typer)
export type RecordElementSchema = AttrSchema & { state: RecordKeyAndElementState }

// TODO: Re-introduce constraint in interface (not only in typer)
export type RecordKeySchema = StringSchema<StringAttributeState & RecordKeyAndElementState>

/**
 * @deprecated
 */
export type $RecordAttributeKeys = $StringAttributeNestedState & {
  state: RecordKeyAndElementState
}

/**
 * @deprecated
 */
export type $RecordAttributeElements = $AttributeNestedState & {
  state: RecordKeyAndElementState
}

/**
 * @deprecated
 */
export type RecordAttributeKeys = StringAttribute
