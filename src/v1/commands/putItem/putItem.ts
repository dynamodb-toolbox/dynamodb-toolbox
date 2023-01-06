import type { O } from 'ts-toolbelt'
import { PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { EntityV2, PutItemInput, FormattedItem } from 'v1'

import { putItemParams } from './putItemParams'
import { parseSavedItem } from './parseSavedItem'

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return PutItemCommandOutput
 */
export const putItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY>
): Promise<
  O.Merge<
    Omit<PutItemCommandOutput, 'Attributes'>,
    { Attributes?: FormattedItem<ENTITY> | undefined }
  >
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new PutItemCommand(putItemParams<ENTITY>(entity, putItemInput))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, unmarshall(attributes))

  return { Attributes: formattedItem, ...restCommandOutput }
}
