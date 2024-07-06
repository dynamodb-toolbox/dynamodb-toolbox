import type { ParsedItem } from '~/entity/actions/parse.js'
import type { Entity } from '~/entity/index.js'
import type { ParsedValue } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'

import type { UpdateItemInputExtension } from '../types.js'
import { UpdateExpressionParser } from './parser.js'
import type { ParsedUpdate } from './type.js'

export const parseSchemaUpdate = (
  schema: Schema,
  input: ParsedValue<Schema, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => {
  const updateParser = new UpdateExpressionParser(schema)
  updateParser.parseUpdate(input)
  return updateParser.toCommandOptions()
}

export const parseUpdate = (
  entity: Entity,
  input: ParsedItem<Entity, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
