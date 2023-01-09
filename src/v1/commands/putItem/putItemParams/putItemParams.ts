import { PutItemCommandInput } from '@aws-sdk/client-dynamodb'

import { EntityV2, PutItemInput } from 'v1'
import { marshall } from 'v1/utils/marshall'

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

  // TODO: Create a parseKey function that will throw an error if the key is invalid
  const key = entity.computeKey ? entity.computeKey(validInput) : {}

  const renamedInput = renameSavedAsAttributes(entity.item, validInput)

  return {
    TableName: entity.table.name,
    Item: marshall({ ...renamedInput, ...key })
  }
}
