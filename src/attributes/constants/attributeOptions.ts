import type { ResolvedBinaryAttribute } from '../binary/index.js'
import type { ResolvedBooleanAttribute } from '../boolean/index.js'
import type { ResolvedNullAttribute } from '../null/index.js'
import type { ResolvedNumberAttribute } from '../number/index.js'
import type { ResolvedStringAttribute } from '../string/index.js'
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
  // TODO: Really needed?
  enum:
    | (
        | ResolvedNullAttribute
        | ResolvedBooleanAttribute
        | ResolvedNumberAttribute
        | ResolvedStringAttribute
        | ResolvedBinaryAttribute
      )[]
    | undefined
  castAs: unknown
  transform: unknown
}
