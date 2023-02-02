import { ResolvedPrimitiveAttribute } from '../primitive'

import { RequiredOption } from './requiredOptions'

export const $type = Symbol()
export type $type = typeof $type

export const $elements = Symbol()
export type $elements = typeof $elements

export const $attributes = Symbol()
export type $attributes = typeof $attributes

export const $value = Symbol()
export type $value = typeof $value

export const $required = Symbol()
export type $required = typeof $required

export const $hidden = Symbol()
export type $hidden = typeof $hidden

export const $key = Symbol()
export type $key = typeof $key

export const $open = Symbol()
export type $open = typeof $open

export const $default = Symbol()
export type $default = typeof $default

export const $enum = Symbol()
export type $enum = typeof $enum

export const $savedAs = Symbol()
export type $savedAs = typeof $savedAs

export type $AttributeOptionSymbol =
  | $type
  | $elements
  | $attributes
  | $value
  | $required
  | $hidden
  | $key
  | $open
  | $default
  | $enum
  | $savedAs

export type AttributeOptionSymbolName = {
  [$type]: 'type'
  [$elements]: 'elements'
  [$attributes]: 'attributes'
  [$value]: 'value'
  [$required]: 'required'
  [$hidden]: 'hidden'
  [$key]: 'key'
  [$open]: 'open'
  [$default]: 'default'
  [$enum]: 'enum'
  [$savedAs]: 'savedAs'
}

export type AttributeOptionNameSymbol = {
  type: $type
  elements: $elements
  attributes: $attributes
  value: $value
  required: $required
  hidden: $hidden
  key: $key
  open: $open
  default: $default
  enum: $enum
  savedAs: $savedAs
}

export type AttributeOptionName = AttributeOptionSymbolName[$AttributeOptionSymbol]

export type AttributeOptionsConstraints = {
  required: RequiredOption
  hidden: boolean
  key: boolean
  open: boolean
  savedAs: string | undefined
  enum: ResolvedPrimitiveAttribute[] | undefined
}
