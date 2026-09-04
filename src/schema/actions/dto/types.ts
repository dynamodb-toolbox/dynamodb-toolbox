import type { AtLeastOnce, SchemaMeta, SchemaRequiredProp } from '~/schema/index.js'
import type { JSONStringifierDTO } from '~/transformers/jsonStringify.js'
import type { PipeDTO } from '~/transformers/pipe.js'
import type { PrefixerDTO } from '~/transformers/prefix.js'
import type { SuffixerDTO } from '~/transformers/suffix.js'

interface CustomTransformerDTO {
  transformerId: 'custom'
}

/**
 * Serialized form of a transformer.
 */
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
  meta?: SchemaMeta
}

/**
 * Transformers serializable on an `any` schema.
 */
export type AnySchemaTransformerDTO =
  | CustomTransformerDTO
  | JSONStringifierDTO
  | PipeDTO<TransformerDTO[]>

/**
 * DTO of an `any` schema.
 */
export interface AnySchemaDTO extends SchemaPropsDTO {
  type: 'any'
  transform?: AnySchemaTransformerDTO
}

/**
 * Transformers serializable on a `null` schema.
 */
export type NullSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

/**
 * DTO of a `null` schema.
 */
export interface NullSchemaDTO extends SchemaPropsDTO {
  type: 'null'
  transform?: NullSchemaTransformerDTO
}

/**
 * Transformers serializable on a `boolean` schema.
 */
export type BooleanSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

/**
 * DTO of a `boolean` schema.
 */
export interface BooleanSchemaDTO extends SchemaPropsDTO {
  type: 'boolean'
  enum?: boolean[]
  transform?: BooleanSchemaTransformerDTO
}

/**
 * Transformers serializable on a `number` schema.
 */
export type NumberSchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

/**
 * DTO of a `number` schema.
 */
export interface NumberSchemaDTO extends SchemaPropsDTO {
  type: 'number'
  big?: boolean
  enum?: (number | string)[]
  transform?: NumberSchemaTransformerDTO
}

/**
 * Transformers serializable on a `string` schema.
 */
export type StringSchemaTransformerDTO =
  | CustomTransformerDTO
  | PrefixerDTO
  | SuffixerDTO
  | PipeDTO<TransformerDTO[]>

/**
 * DTO of a `string` schema.
 */
export interface StringSchemaDTO extends SchemaPropsDTO {
  type: 'string'
  enum?: string[]
  transform?: StringSchemaTransformerDTO
}

/**
 * Transformers serializable on a `binary` schema.
 */
export type BinarySchemaTransformerDTO = CustomTransformerDTO | PipeDTO<TransformerDTO[]>

/**
 * DTO of a `binary` schema.
 */
export interface BinarySchemaDTO extends SchemaPropsDTO {
  type: 'binary'
  enum?: string[]
  transform?: BinarySchemaTransformerDTO
}

/**
 * DTO of a primitive schema.
 */
export type PrimitiveSchemaDTO =
  | NullSchemaDTO
  | BooleanSchemaDTO
  | NumberSchemaDTO
  | StringSchemaDTO
  | BinarySchemaDTO

/**
 * DTO of a `set` schema.
 */
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

/**
 * DTO of a `list` schema.
 */
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

/**
 * DTO of a `tuple` schema.
 */
export interface TupleSchemaDTO extends SchemaPropsDTO {
  type: 'tuple'
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

/**
 * DTO of a `map` schema.
 */
export interface MapSchemaDTO extends SchemaPropsDTO {
  type: 'map'
  attributes: { [name: string]: ISchemaDTO }
  strict?: boolean
}

/**
 * DTO of a `record` schema.
 */
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

/**
 * DTO of an `anyOf` schema.
 */
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

/**
 * DTO of an `item` schema.
 */
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
  strict?: boolean
}

/**
 * DTO of any schema type.
 */
export type ISchemaDTO =
  | AnySchemaDTO
  | NullSchemaDTO
  | BooleanSchemaDTO
  | NumberSchemaDTO
  | StringSchemaDTO
  | BinarySchemaDTO
  | SetSchemaDTO
  | ListSchemaDTO
  | TupleSchemaDTO
  | MapSchemaDTO
  | RecordSchemaDTO
  | AnyOfSchemaDTO
  | ItemSchemaDTO
