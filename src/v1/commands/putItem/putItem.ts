import type { O } from 'ts-toolbelt'
import { PutCommand, PutCommandOutput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2, PutItemInput, FormattedItem } from 'v1'
import { parseSavedItem } from 'v1/commands/utils/parseSavedItem'

import type { PutItemOptions } from './options'
import { putItemParams } from './putItemParams'

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @param putItemOptions PutItemOptions
 * @return PutCommandOutput
 */
export const putItem = async <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemInput: PutItemInput<ENTITY>,
  putItemOptions: PutItemOptions = {}
): Promise<
  O.Merge<Omit<PutCommandOutput, 'Attributes'>, { Attributes?: FormattedItem<ENTITY> | undefined }>
> => {
  const commandOutput = await entity.table.documentClient.send(
    new PutCommand(putItemParams<ENTITY>(entity, putItemInput, putItemOptions))
  )

  const { Attributes: attributes, ...restCommandOutput } = commandOutput

  if (attributes === undefined) {
    return restCommandOutput
  }

  const formattedItem = parseSavedItem(entity, attributes)

  return { Attributes: formattedItem, ...restCommandOutput }
}
