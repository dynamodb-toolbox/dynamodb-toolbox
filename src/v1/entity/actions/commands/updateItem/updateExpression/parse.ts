import type { EntityV2 } from 'v1/entity'
import type { ParsedItem } from 'v1/entity/actions/parse'
import type { Schema } from 'v1/schema'
import type { ParsedValue } from 'v1/schema/actions/parse'

import type { UpdateItemInputExtension } from '../types'
import type { ParsedUpdate } from './type'
import { UpdateExpressionParser } from './parser'

export const parseSchemaUpdate = (
  schema: Schema,
  input: ParsedValue<Schema, { operation: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => {
  const updateParser = new UpdateExpressionParser(schema)
  updateParser.parseUpdate(input)
  return updateParser.toCommandOptions()
}

export const parseUpdate = (
  entity: EntityV2,
  input: ParsedItem<EntityV2, { operation: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
