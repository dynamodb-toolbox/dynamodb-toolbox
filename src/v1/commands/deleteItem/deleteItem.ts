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
  RETURN_VALUES extends DeleteItemCommandReturnValuesOption
> = DeleteItemCommandReturnValuesOption extends RETURN_VALUES
  ? undefined
  : RETURN_VALUES extends NoneReturnValuesOption
  ? undefined
  : RETURN_VALUES extends AllOldReturnValuesOption
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
  RETURN_VALUES extends DeleteItemCommandReturnValuesOption = DeleteItemCommandReturnValuesOption
>(
  entity: ENTITY,
  keyInput: KeyInput<ENTITY>,
  deleteItemOptions: DeleteItemOptions<RETURN_VALUES> = {}
): Promise<
  O.Merge<
    Omit<DeleteCommandOutput, 'Attributes'>,
    { Attributes?: ReturnedAttributes<ENTITY, RETURN_VALUES> | undefined }
  >
> => {
  const commandOutput = await entity.table.documentClient.send(
    new DeleteCommand(deleteItemParams<ENTITY>(entity, keyInput, deleteItemOptions))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, attributes)

  return {
    Attributes: formattedItem as ReturnedAttributes<ENTITY, RETURN_VALUES>,
    ...restCommandOutput
  }
}
