import type { AtLeastOnce, SchemaRequiredProp } from '~/attributes/index.js'
import type { JSONStringifyDTO } from '~/transformers/jsonStringify.js'
import type { PrefixerDTO } from '~/transformers/prefix.js'

// TODO: Infer from actual list of defaulters
type DefaulterDTO = { defaulterId: 'value'; value: unknown } | { defaulterId: 'custom' }

interface SchemaDefaultsDTO {
  keyDefault?: DefaulterDTO
  putDefault?: DefaulterDTO
  updateDefault?: DefaulterDTO
}

// TODO: Infer from actual list of linkers
type LinkerDTO = { linkerId: 'custom' }

interface SchemaLinksDTO {
  keyLink?: LinkerDTO
  putLink?: LinkerDTO
  updateLink?: LinkerDTO
}

interface SchemaPropsDTO extends SchemaDefaultsDTO, SchemaLinksDTO {
  required?: SchemaRequiredProp
  hidden?: boolean
  key?: boolean
  savedAs?: string
}

export type AnyTransformerDTO = JSONStringifyDTO | { transformerId: 'custom' }

export interface AnySchemaDTO extends SchemaPropsDTO {
  type: 'any'
  transform?: AnyTransformerDTO
}

export interface NullSchemaDTO extends SchemaPropsDTO {
  type: 'null'
}

export interface BooleanSchemaDTO extends SchemaPropsDTO {
  type: 'boolean'
  enum?: boolean[]
}

export interface NumberSchemaDTO extends SchemaPropsDTO {
  type: 'number'
  big?: boolean
  enum?: (number | string)[]
}

type StringTransformerDTO = PrefixerDTO | { transformerId: 'custom' }

export interface StringSchemaDTO extends SchemaPropsDTO {
  type: 'string'
  enum?: string[]
  transform?: StringTransformerDTO
}

export interface BinarySchemaDTO extends SchemaPropsDTO {
  type: 'binary'
  enum?: string[]
}

export type PrimitiveSchemaDTO =
  | NullSchemaDTO
  | BooleanSchemaDTO
  | NumberSchemaDTO
  | StringSchemaDTO
  | BinarySchemaDTO

export interface SetSchemaDTO extends SchemaPropsDTO {
  type: 'set'
  elements: (NumberSchemaDTO | StringSchemaDTO | BinarySchemaDTO) & {
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

export interface ListSchemaDTO extends SchemaPropsDTO {
  type: 'list'
  elements: ISchemaDTO & {
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

export interface MapSchemaDTO extends SchemaPropsDTO {
  type: 'map'
  attributes: { [name: string]: ISchemaDTO }
}

export interface RecordSchemaDTO extends SchemaPropsDTO {
  type: 'record'
  keys: StringSchemaDTO & {
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
  elements: ISchemaDTO & {
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

export interface AnyOfSchemaDTO extends SchemaPropsDTO {
  type: 'anyOf'
  elements: (ISchemaDTO & {
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

export interface ItemSchemaDTO extends SchemaPropsDTO {
  type: 'item'
  attributes: { [name: string]: ISchemaDTO }
}

export type ISchemaDTO =
  | AnySchemaDTO
  | NullSchemaDTO
  | BooleanSchemaDTO
  | NumberSchemaDTO
  | StringSchemaDTO
  | BinarySchemaDTO
  | SetSchemaDTO
  | ListSchemaDTO
  | MapSchemaDTO
  | RecordSchemaDTO
  | AnyOfSchemaDTO
  | ItemSchemaDTO
