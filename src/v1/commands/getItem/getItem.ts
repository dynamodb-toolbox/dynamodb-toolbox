import type { O } from 'ts-toolbelt'
import { GetItemCommand, GetItemCommandOutput } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { EntityV2, FormattedItem, KeyInput } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'

import { getItemParams } from './getItemParams'

/**
 * Run a Get Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput KeyInput
 * @return GetItemCommandOutput
 */
export const getItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>
): Promise<
  O.Merge<Omit<GetItemCommandOutput, 'Attributes'>, { Item?: FormattedItem<ENTITY> | undefined }>
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new GetItemCommand(getItemParams<ENTITY>(entity, keyInput))
  )

  const { Item: item, ...restCommandOutput } = commandOutput

  if (item === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, unmarshall(item))

  return { Item: formattedItem, ...restCommandOutput }
}
