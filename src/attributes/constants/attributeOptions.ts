import type { ResolvedPrimitiveAttribute } from '../primitive/types.js'
import type { Validator } from '../types/validator.js'
import type { RequiredOption } from './requiredOptions.js'

export const $type = Symbol('$type')
export type $type = typeof $type

export const $state = Symbol('$state')
export type $state = typeof $state

export const $elements = Symbol('$elements')
export type $elements = typeof $elements

export const $attributes = Symbol('$attributes')
export type $attributes = typeof $attributes

export const $keys = Symbol('$keys')
export type $keys = typeof $keys

export type AttributeOptions = {
  required: RequiredOption
  hidden: boolean
  key: boolean
  savedAs: string | undefined
  defaults: {
    key: undefined | unknown
    put: undefined | unknown
    update: undefined | unknown
  }
  links: {
    key: undefined | unknown
    put: undefined | unknown
    update: undefined | unknown
  }
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
  big: boolean
  enum: ResolvedPrimitiveAttribute[] | undefined
  castAs: unknown
  transform: unknown
}
