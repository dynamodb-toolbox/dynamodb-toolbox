import type { RequiredOption } from '~/attributes/constants/requiredOptions.js'
import type { AtLeastOnce } from '~/attributes/index.js'
import type { JSONStringifyDTO } from '~/transformers/jsonStringify.js'
import type { PrefixerDTO } from '~/transformers/prefix.js'

// TODO: Infer from actual list of defaulters
type AttrDefaulterDTO = { defaulterId: 'value'; value: unknown } | { defaulterId: 'custom' }

interface AttrDefaultsDTO {
  keyDefault?: AttrDefaulterDTO
  putDefault?: AttrDefaulterDTO
  updateDefault?: AttrDefaulterDTO
}

// TODO: Infer from actual list of linkers
type AttrLinkerDTO = { linkerId: 'custom' }

interface AttrLinksDTO {
  keyLink?: AttrLinkerDTO
  putLink?: AttrLinkerDTO
  updateLink?: AttrLinkerDTO
}

interface SchemaPropsDTO extends AttrDefaultsDTO, AttrLinksDTO {
  required?: RequiredOption
  hidden?: boolean
  key?: boolean
  savedAs?: string
}

export type AnyAttrTransformerDTO = JSONStringifyDTO | { transformerId: 'custom' }

export interface AnyAttrDTO extends SchemaPropsDTO {
  type: 'any'
  transform?: AnyAttrTransformerDTO
}

export interface NullAttrDTO extends SchemaPropsDTO {
  type: 'null'
}

export interface BooleanAttrDTO extends SchemaPropsDTO {
  type: 'boolean'
  enum?: boolean[]
}

export interface NumberAttrDTO extends SchemaPropsDTO {
  type: 'number'
  big?: boolean
  enum?: (number | string)[]
}

type StringAttrTransformerDTO = PrefixerDTO | { transformerId: 'custom' }

export interface StringAttrDTO extends SchemaPropsDTO {
  type: 'string'
  enum?: string[]
  transform?: StringAttrTransformerDTO
}

export interface BinaryAttrDTO extends SchemaPropsDTO {
  type: 'binary'
  enum?: string[]
}

export type PrimitiveAttrDTO =
  | NullAttrDTO
  | BooleanAttrDTO
  | NumberAttrDTO
  | StringAttrDTO
  | BinaryAttrDTO

export interface SetAttrDTO extends SchemaPropsDTO {
  type: 'set'
  elements: (NumberAttrDTO | StringAttrDTO | BinaryAttrDTO) & {
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
}

export interface ListAttrDTO extends SchemaPropsDTO {
  type: 'list'
  elements: AttributeDTO & {
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
}

export interface MapAttrDTO extends SchemaPropsDTO {
  type: 'map'
  attributes: { [name: string]: AttributeDTO }
}

export interface RecordAttrDTO extends SchemaPropsDTO {
  type: 'record'
  keys: StringAttrDTO & {
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
  elements: AttributeDTO & {
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
}

export interface AnyOfAttrDTO extends SchemaPropsDTO {
  type: 'anyOf'
  elements: (AttributeDTO & {
    required?: AtLeastOnce
    hidden?: false
    savedAs?: undefined
    keyDefault?: undefined
    putDefault?: undefined
    updateDefault?: undefined
    keyLink?: undefined
    putLink?: undefined
    updateLink?: undefined
  })[]
}

export type AttributeDTO =
  | AnyAttrDTO
  | NullAttrDTO
  | BooleanAttrDTO
  | NumberAttrDTO
  | StringAttrDTO
  | BinaryAttrDTO
  | SetAttrDTO
  | ListAttrDTO
  | MapAttrDTO
  | RecordAttrDTO
  | AnyOfAttrDTO

export interface ISchemaDTO {
  type: 'schema'
  attributes: { [name: string]: AttributeDTO }
}
