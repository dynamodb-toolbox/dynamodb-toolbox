import type { RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'

export interface SharedAttributeState {
  required?: RequiredOption
  hidden?: boolean
  key?: boolean
  savedAs?: string
  keyDefault?: unknown
  putDefault?: unknown
  updateDefault?: unknown
  keyLink?: unknown
  putLink?: unknown
  updateLink?: unknown
  keyValidator?: Validator
  putValidator?: Validator
  updateValidator?: Validator
}
