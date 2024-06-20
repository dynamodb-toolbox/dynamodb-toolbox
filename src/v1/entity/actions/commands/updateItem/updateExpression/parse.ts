import type { EntityV2 } from 'v1/entity/index.js'
import type { ParsedItem } from 'v1/entity/actions/parse.js'
import type { Schema } from 'v1/schema/index.js'
import type { ParsedValue } from 'v1/schema/actions/parse/index.js'

import type { UpdateItemInputExtension } from '../types.js'
import type { ParsedUpdate } from './type.js'
import { UpdateExpressionParser } from './parser.js'

export const parseSchemaUpdate = (
  schema: Schema,
  input: ParsedValue<Schema, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => {
  const updateParser = new UpdateExpressionParser(schema)
  updateParser.parseUpdate(input)
  return updateParser.toCommandOptions()
}

export const parseUpdate = (
  entity: EntityV2,
  input: ParsedItem<EntityV2, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
