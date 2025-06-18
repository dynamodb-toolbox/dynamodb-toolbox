import type { AtLeastOnce, SchemaRequiredProp } from '~/schema/index.js'
import type { JSONStringifierDTO } from '~/transformers/jsonStringify.js'
import type { PipeDTO } from '~/transformers/pipe.js'
import type { PrefixerDTO } from '~/transformers/prefix.js'
import type { SuffixerDTO } from '~/transformers/suffix.js'

interface CustomTransformerDTO {
  transformerId: 'custom'
}

export type TransformerDTO =
  | CustomTransformerDTO
  | JSONStringifierDTO
  | PrefixerDTO
  | SuffixerDTO
  | PipeDTO<TransformerDTO[]>

// TODO: Infer from actual list of defaulters
type DefaulterDTO = { defaulterId: 'value'; value: unknown } | { defaulterId: 'custom' }

interface SchemaDefaultsDTO {
  keyDefault?: DefaulterDTO
  putDefault?: DefaulterDTO
  updateDefault?: DefaulterDTO
}

// TODO: Infer from actual list of linkers
type LinkDTO = { linkerId: 'custom' }

interface SchemaLinksDTO {
  keyLink?: LinkDTO
  putLink?: LinkDTO
  updateLink?: LinkDTO
}

interface SchemaPropsDTO extends SchemaDefaultsDTO, SchemaLinksDTO {
  required?: SchemaRequiredProp
  hidden?: boolean
  key?: boolean
  savedAs?: string
}

export type AnySchemaTransformerDTO =
  | CustomTransformerDTO
  | JSONStringifierDTO
  | PipeDTO<TransformerDTO[]>

export interface AnySchemaDTO extends SchemaPropsDTO {
  type: 'any'
  transform?: AnySchemaTransformerDTO
}

export type NullSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

export interface NullSchemaDTO extends SchemaPropsDTO {
  type: 'null'
  transform?: NullSchemaTransformerDTO
}

export type BooleanSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

export interface BooleanSchemaDTO extends SchemaPropsDTO {
  type: 'boolean'
  enum?: boolean[]
  transform?: BooleanSchemaTransformerDTO
}

export type NumberSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

export interface NumberSchemaDTO extends SchemaPropsDTO {
  type: 'number'
  big?: boolean
  enum?: (number | string)[]
  transform?: NumberSchemaTransformerDTO
}

export type StringSchemaTransformerDTO =
  | CustomTransformerDTO
  | PrefixerDTO
  | SuffixerDTO
  | PipeDTO<TransformerDTO[]>

export interface StringSchemaDTO extends SchemaPropsDTO {
  type: 'string'
  enum?: string[]
  transform?: StringSchemaTransformerDTO
}

export type BinarySchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

export interface BinarySchemaDTO extends SchemaPropsDTO {
  type: 'binary'
  enum?: string[]
  transform?: BinarySchemaTransformerDTO
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
  discriminator?: string
}

export interface ItemSchemaDTO extends SchemaPropsDTO {
  type: 'item'
  attributes: {
    [name: string]:
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
  }
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
