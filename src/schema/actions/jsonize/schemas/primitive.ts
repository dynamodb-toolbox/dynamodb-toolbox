import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { nul } from '~/attributes/nul/index.js'
import { number } from '~/attributes/number/index.js'
import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'

import { defaulterSchema, jsonAttrOptionSchemas, linkerSchema } from './common.js'

export const jsonNullAttrSchema = map({
  type: string().const('null'),
  ...jsonAttrOptionSchemas,
  /**
   * @debt feature "Validate unicity with `.validate`"
   */
  enum: list(nul()).optional(),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: nul() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})

export const jsonBooleanAttrSchema = map({
  type: string().const('boolean'),
  ...jsonAttrOptionSchemas,
  /**
   * @debt feature "Validate unicity with `.validate`"
   */
  enum: list(boolean()).optional(),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: boolean() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})

export const jsonNumberAttrSchema = map({
  type: string().const('number'),
  ...jsonAttrOptionSchemas,
  /**
   * @debt feature "Validate unicity with `.validate`"
   */
  enum: list(number()).optional(),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: number() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})

export const jsonStringAttrSchema = map({
  type: string().const('string'),
  ...jsonAttrOptionSchemas,
  /**
   * @debt feature "Validate unicity with `.validate`"
   */
  enum: list(string()).optional(),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: string() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})

export const jsonBinaryAttrSchema = map({
  type: string().const('binary'),
  ...jsonAttrOptionSchemas,
  /**
   * @debt feature "Validate unicity with `.validate`"
   */
  enum: list(string()).optional(),
  defaults: record(
    string().enum('put', 'key', 'update'),
    anyOf(map({ type: string().const('value'), value: string() }), defaulterSchema)
  ).optional(),
  links: record(string().enum('put', 'key', 'update'), linkerSchema).optional()
})
