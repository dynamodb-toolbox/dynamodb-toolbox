import { PutItemCommandInput } from '@aws-sdk/client-dynamodb'

import { EntityV2, PutItemInput } from 'v1'
import { marshall } from 'v1/utils/marshall'
import { parsePrimaryKey } from 'v1/commands/utils/parsePrimaryKey'

import { parseEntityPutCommandInput } from './parsePutCommandInput'
import { renameSavedAsAttributes } from './renameSavedAsAttributes'

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return PutItemCommandInput
 */
export const putItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  input: PutItemInput<ENTITY, false>
): PutItemCommandInput => {
  const validInput = parseEntityPutCommandInput<ENTITY>(entity, input)

  // Important to do it before renaming as validInput is muted (to improve?)
  let keyInput = entity.computeKey ? entity.computeKey(validInput) : undefined

  const renamedInput = renameSavedAsAttributes(entity.item, validInput)

  const primaryKey = parsePrimaryKey(entity, keyInput ?? renamedInput)

  return {
    TableName: entity.table.name,
    Item: marshall({ ...renamedInput, ...primaryKey })
  }
}
