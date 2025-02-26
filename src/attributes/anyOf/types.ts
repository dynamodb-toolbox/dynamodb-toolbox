import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { AttrSchema } from '../types/index.js'

interface AnyOfElementState extends SharedAttributeState {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

// TODO: Re-introduce constraint in interface (not only in typer)
export type AnyOfElementSchema = AttrSchema & { state: AnyOfElementState }
