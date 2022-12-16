import { PutItemCommandInput } from '@aws-sdk/client-dynamodb'

import { EntityV2, PutItemInput } from 'v1'
import { marshall } from 'v1/utils/marshall'

import { addEntityInitialDefaults } from './addInitialDefaults'
import { parseEntityPutCommandInput } from './parsePutCommandInput'

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param putItemInput Input
 * @return PutItemCommandInput
 */
export const putItemParams = <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY, false>
): PutItemCommandInput => {
  const putItemWithInitialDefaults = addEntityInitialDefaults<ENTITY>(entity, putItemInput)

  const putItemInputWithComputedDefaults = entity.computeDefaults(putItemWithInitialDefaults)

  const parsedPutItemInput = parseEntityPutCommandInput(entity, putItemInputWithComputedDefaults)

  const key = entity.computeKey(putItemInputWithComputedDefaults)

  return {
    TableName: entity.table.name,
    Item: marshall({ ...key, ...parsedPutItemInput })
  }
}
