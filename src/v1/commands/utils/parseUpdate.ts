import type { Schema } from 'v1/schema'
import type { EntityV2 } from 'v1/entity'
import type { UpdateItemInput } from 'v1/commands/updateItem/types'

import { UpdateParser, ParsedUpdate } from './expressionParsers/update'

export const parseSchemaUpdate = <
  SCHEMA extends Schema,
  // TODO: Set REQUIRE_INDEPENDENT_DEFAULTS to true
  INPUT extends UpdateItemInput<SCHEMA, false>
>(
  schema: SCHEMA,
  input: INPUT
): ParsedUpdate => {
  const updateParser = new UpdateParser(schema)
  /**
   * @debt type "Is this cast fixable?"
   */
  updateParser.parseUpdate(input as UpdateItemInput)
  return updateParser.toCommandOptions()
}

export const parseCondition = <
  ENTITY extends EntityV2,
  INPUT extends UpdateItemInput<ENTITY, false>
>(
  entity: ENTITY,
  input: INPUT
): ParsedUpdate => parseSchemaUpdate(entity.schema, input)
