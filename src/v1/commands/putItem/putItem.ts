import type { O } from 'ts-toolbelt'
import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, PutItemInput, FormattedItem } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'
import type {
  NoneReturnValuesOption,
  UpdatedOldReturnValuesOption,
  UpdatedNewReturnValuesOption,
  AllOldReturnValuesOption,
  AllNewReturnValuesOption
} from 'v1/commands/constants/options/returnValues'

import type { PutItemCommandReturnValuesOption, PutItemOptions } from './options'
import { putItemParams } from './putItemParams'

type ReturnedAttributes<
  ENTITY extends EntityV2,
  RETURN_VALUES extends PutItemCommandReturnValuesOption
> = PutItemCommandReturnValuesOption extends RETURN_VALUES
  ? undefined
  : RETURN_VALUES extends NoneReturnValuesOption
  ? undefined
  : RETURN_VALUES extends UpdatedOldReturnValuesOption | UpdatedNewReturnValuesOption
  ? Partial<FormattedItem<ENTITY>> | undefined
  : RETURN_VALUES extends AllNewReturnValuesOption | AllOldReturnValuesOption
  ? FormattedItem<ENTITY> | undefined
  : never

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @param putItemOptions PutItemOptions
 * @return PutCommandOutput
 */
export const putItem = async <
  ENTITY extends EntityV2,
  RETURN_VALUES extends PutItemCommandReturnValuesOption = PutItemCommandReturnValuesOption
>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY>,
  putItemOptions: PutItemOptions<RETURN_VALUES> = {}
): Promise<
  O.Merge<
    Omit<PutCommandOutput, 'Attributes'>,
    { Attributes?: ReturnedAttributes<ENTITY, RETURN_VALUES> }
  >
> => {
  const commandOutput = await entity.table.documentClient.send(
    new PutCommand(putItemParams<ENTITY>(entity, putItemInput, putItemOptions))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  // TODO: Create parseSavedAttributes util that handles partial Items (for the moment, it will throw)
  // (returned for UpdatedOld/UpdatedNew returnValues option)
  // (Also: is the partial flat or deep ?)
  const formattedItem = parseSavedItem(entity, attributes)

  return {
    Attributes: formattedItem as ReturnedAttributes<ENTITY, RETURN_VALUES>,
    ...restCommandOutput
  }
}
