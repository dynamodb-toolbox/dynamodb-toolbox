import type { O } from 'ts-toolbelt'
import { GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem, KeyInput } from 'v1'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'

import type { GetItemOptions } from './options'
import { getItemParams } from './getItemParams'

/**
 * Run a Get Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput KeyInput
 * @param getItemOptions GetItemOptions
 * @return GetCommandOutput
 */
export const getItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>,
  getItemOptions: GetItemOptions = {}
): Promise<
  O.Merge<Omit<GetCommandOutput, 'Item'>, { Item?: FormattedItem<ENTITY> | undefined }>
> => {
  const commandOutput = await entity.table.documentClient.send(
    new GetCommand(getItemParams<ENTITY>(entity, keyInput, getItemOptions))
  )

  const { Item: item, ...restCommandOutput } = commandOutput

  if (item === undefined) {
    return restCommandOutput
  }

  const formattedItem = formatSavedItem(entity, item)

  return { Item: formattedItem, ...restCommandOutput }
}
