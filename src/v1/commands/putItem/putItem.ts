import type { O } from 'ts-toolbelt'
import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import { EntityV2, PutItemInput, FormattedItem } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'

import { putItemParams } from './putItemParams'

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return PutCommandOutput
 */
export const putItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY>
): Promise<
  O.Merge<Omit<PutCommandOutput, 'Attributes'>, { Attributes?: FormattedItem<ENTITY> | undefined }>
> => {
  const commandOutput = await entity.table.documentClient.send(
    new PutCommand(putItemParams<ENTITY>(entity, putItemInput))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, attributes)

  return { Attributes: formattedItem, ...restCommandOutput }
}
