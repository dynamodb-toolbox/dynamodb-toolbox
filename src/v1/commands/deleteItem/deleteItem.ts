import type { O } from 'ts-toolbelt'
import { DeleteItemCommand, DeleteItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { EntityV2, FormattedItem, KeyInput } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'

import { deleteItemParams } from './deleteItemParams'

/**
 * Run a Delete Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput KeyInput
 * @return DeleteItemCommandOutput
 */
export const deleteItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>
): Promise<
  O.Merge<Omit<DeleteItemCommandOutput, 'Attributes'>, { Item?: FormattedItem<ENTITY> | undefined }>
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new DeleteItemCommand(deleteItemParams<ENTITY>(entity, keyInput))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, unmarshall(attributes))

  return { Item: formattedItem, ...restCommandOutput }
}
