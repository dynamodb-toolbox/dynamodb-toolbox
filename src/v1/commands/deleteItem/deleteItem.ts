import type { O } from 'ts-toolbelt'
import { DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, FormattedItem, KeyInput } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'
import type {
  NoneReturnValuesOption,
  AllOldReturnValuesOption
} from 'v1/commands/constants/options/returnValues'

import { deleteItemParams } from './deleteItemParams'
import type { DeleteItemCommandReturnValuesOption, DeleteItemOptions } from './options'

type ReturnedAttributes<
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY>
> = DeleteItemCommandReturnValuesOption extends OPTIONS['returnValues']
  ? undefined
  : OPTIONS['returnValues'] extends NoneReturnValuesOption
  ? undefined
  : OPTIONS['returnValues'] extends AllOldReturnValuesOption
  ? FormattedItem<ENTITY> | undefined
  : never

/**
 * Run a Delete Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput KeyInput
 * @param deleteItemOptions DeleteItemOptions
 * @return DeleteItemCommandOutput
 */
export const deleteItem = async <
  ENTITY extends EntityV2,
  OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>
>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>,
  deleteItemOptions: OPTIONS = {} as OPTIONS
): Promise<
  O.Merge<
    Omit<DeleteCommandOutput, 'Attributes'>,
    { Attributes?: ReturnedAttributes<ENTITY, OPTIONS> | undefined }
  >
> => {
  const commandOutput = await entity.table.documentClient.send(
    new DeleteCommand(deleteItemParams<ENTITY, OPTIONS>(entity, keyInput, deleteItemOptions))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, attributes)

  return {
    Attributes: formattedItem as ReturnedAttributes<ENTITY, OPTIONS>,
    ...restCommandOutput
  }
}
