import type { O } from 'ts-toolbelt'
import { GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from '@aws-sdk/client-dynamodb'

import { EntityV2, KeyInputs, Output, parse, validateKeyInputs, validateSavedAs } from 'v2'

const hasNoItem = (
  commandOutput: GetItemCommandOutput
): commandOutput is O.Merge<Omit<GetItemCommandOutput, 'Item'>, { Item?: undefined }> =>
  commandOutput?.Item === undefined

export const getItem = async <E extends EntityV2>(
  entity: E,
  key: KeyInputs<E>
): Promise<O.Merge<Omit<GetItemCommandOutput, 'Item'>, { Item?: Output<E> | undefined }>> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new GetItemCommand(getItemParams(entity, key))
  )

  if (hasNoItem(commandOutput)) {
    return commandOutput
  }

  const { Item: item, ...restCommandOutput } = commandOutput as O.Required<
    GetItemCommandOutput,
    'Item'
  >

  if (!validateSavedAs(entity, item)) {
    throw new Error()
  }

  const parsedItem = parse(entity, item)

  return { Item: parsedItem, ...restCommandOutput }
}

export const getItemParams = <E extends EntityV2>(
  entity: E,
  key: KeyInputs<E>
): GetItemCommandInput => {
  const { name: tableName } = entity.table

  if (!validateKeyInputs(entity, key)) {
    throw new Error()
  }

  const Key = entity.computeKey(key)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Key
  }
}
