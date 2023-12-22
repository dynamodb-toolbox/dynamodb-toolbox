import type { EntityV2 } from 'v1/entity'
import type { Item, Schema } from 'v1/schema'

import type { UpdateItemInputExtension } from '../types'
import type { ParsedUpdate } from './type'
import { UpdateExpressionParser } from './parser'

export const parseSchemaUpdate = <SCHEMA extends Schema>(
  schema: SCHEMA,
  input: Item<UpdateItemInputExtension>
): ParsedUpdate => {
  const updateParser = new UpdateExpressionParser(schema)
  updateParser.parseUpdate(input)
  return updateParser.toCommandOptions()
}

export const parseUpdate = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: Item<UpdateItemInputExtension>
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
