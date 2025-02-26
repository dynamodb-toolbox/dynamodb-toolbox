import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { StringAttributeState, StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'

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
