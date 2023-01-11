import { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, PutItemInput } from 'v1'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'
import { renameSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes'

import { parseEntityPutCommandInput } from './parsePutCommandInput'

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return PutCommandInput
 */
export const putItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PutItemInput<ENTITY, false>
): PutCommandInput => {
  const validInput = parseEntityPutCommandInput<ENTITY>(entity, input)

  // Important to do it before renaming as validInput is muted (to improve?)
  let keyInput = entity.computeKey ? entity.computeKey(validInput) : undefined

  const renamedInput = renameSavedAsAttributes(entity.item, validInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  return {
    TableName: entity.table.name,
    Item: { ...renamedInput, ...primaryKey }
  }
}
