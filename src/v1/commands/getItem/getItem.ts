import type { O } from 'ts-toolbelt'
import { GetCommand, GetCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem, KeyInput } from 'v1'
import type { AnyAttributePath } from 'v1/commands/types/paths'
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
export const getItem = async <ENTITY extends EntityV2, OPTIONS extends GetItemOptions<ENTITY>>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>,
  getItemOptions: OPTIONS = {} as OPTIONS
): Promise<
  O.Merge<
    Omit<GetCommandOutput, 'Item'>,
    {
      Item?:
        | (OPTIONS['attributes'] extends AnyAttributePath<ENTITY['item']>[]
            ? FormattedItem<ENTITY, OPTIONS['attributes'][number]>
            : FormattedItem<ENTITY>)
        | undefined
    }
  >
> => {
  const commandOutput = await entity.table.documentClient.send(
    new GetCommand(getItemParams(entity, keyInput, getItemOptions))
  )

  const { Item: item, ...restCommandOutput } = commandOutput

  if (item === undefined) {
    return restCommandOutput
  }

  const { attributes } = getItemOptions
  const formattedItem = formatSavedItem(entity, item, { attributes })

  return {
    /**
     * @debt type "Weird bug from TS, casting needed. To investigate"
     */
    Item: formattedItem as any,
    ...restCommandOutput
  }
}
