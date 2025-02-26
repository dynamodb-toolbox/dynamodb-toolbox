import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { AttrSchema, Attribute } from '../types/index.js'

interface ListElementState extends SharedAttributeState {
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
export type ListElementSchema = AttrSchema & { state: ListElementState }

/**
 * @deprecated
 */
export type ListAttributeElements = Attribute & { state: ListElementState }
