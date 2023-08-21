import type { Schema } from 'v1/schema'
import type { UpdateItemInput } from 'v1/commands/updateItem/types'

import { UpdateParser, ParsedUpdate } from './expressionParsers/update'

export const parseSchemaUpdate = <
  SCHEMA extends Schema,
  INPUT extends UpdateItemInput<SCHEMA, true>
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
