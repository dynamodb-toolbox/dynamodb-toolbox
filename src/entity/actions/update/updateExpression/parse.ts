import type { Entity, TransformedItem } from '~/entity/index.js'
import type { ItemSchema } from '~/schema/index.js'
import type { TransformedValue } from '~/schema/index.js'

import type { UpdateItemInputExtension } from '../types.js'
import { UpdateExpressionParser } from './parser.js'
import type { ParsedUpdate } from './type.js'

export const parseSchemaUpdate = (
  schema: ItemSchema,
  input: TransformedValue<ItemSchema, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => {
  const updateParser = new UpdateExpressionParser(schema)
  updateParser.parseUpdate(input)
  return updateParser.toCommandOptions()
}

export const parseUpdate = (
  entity: Entity,
  input: TransformedItem<Entity, { mode: 'update'; extension: UpdateItemInputExtension }>
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
