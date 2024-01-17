import { ResolvedPrimitiveAttribute } from '../primitive'

import { RequiredOption } from './requiredOptions'

export const $type = Symbol('$type')
export type $type = typeof $type

export const $elements = Symbol('$elements')
export type $elements = typeof $elements

export const $attributes = Symbol('$attributes')
export type $attributes = typeof $attributes

export const $value = Symbol('$value')
export type $value = typeof $value

export const $required = Symbol('$required')
export type $required = typeof $required

export const $hidden = Symbol('$hidden')
export type $hidden = typeof $hidden

export const $keys = Symbol('$keys')
export type $keys = typeof $keys

export const $key = Symbol('$key')
export type $key = typeof $key

export const $defaults = Symbol('$defaults')
export type $defaults = typeof $defaults

export const $links = Symbol('$links')
export type $links = typeof $links

export const $enum = Symbol('$enum')
export type $enum = typeof $enum

export const $savedAs = Symbol('$savedAs')
export type $savedAs = typeof $savedAs

export const $castAs = Symbol('$castAs')
export type $castAs = typeof $castAs

export const $transform = Symbol('$transform')
export type $transform = typeof $transform

export type $AttributeOptionSymbol =
  | $type
  | $keys
  | $elements
  | $attributes
  | $value
  | $required
  | $hidden
  | $key
  | $defaults
  | $links
  | $enum
  | $savedAs
  | $castAs
  | $transform

export type AttributeOptionSymbolName = {
  [$type]: 'type'
  [$keys]: 'keys'
  [$elements]: 'elements'
  [$attributes]: 'attributes'
  [$value]: 'value'
  [$required]: 'required'
  [$hidden]: 'hidden'
  [$key]: 'key'
  [$defaults]: 'defaults'
  [$links]: 'links'
  [$enum]: 'enum'
  [$savedAs]: 'savedAs'
  [$castAs]: 'castAs'
  [$transform]: 'transform'
}

export type AttributeOptionName = AttributeOptionSymbolName[$AttributeOptionSymbol]

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
  enum: ResolvedPrimitiveAttribute[] | undefined
}
