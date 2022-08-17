import type { O } from 'ts-toolbelt'
import { GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from '@aws-sdk/client-dynamodb'

import { EntityV2, KeyInput, Output, parse, validateKeyInput, validateSavedAs } from 'v2'

const hasNoItem = (
  commandOutput: GetItemCommandOutput
): commandOutput is O.Merge<Omit<GetItemCommandOutput, 'Item'>, { Item?: undefined }> =>
  commandOutput?.Item === undefined

/**
 * Run a GET Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput Key input
 * @return GetItemCommandOutput
 */
export const getItem = async <E extends EntityV2>(
  entity: E,
  keyInput: KeyInput<E>
): Promise<O.Merge<Omit<GetItemCommandOutput, 'Item'>, { Item?: Output<E> | undefined }>> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new GetItemCommand(getItemParams(entity, keyInput))
  )

  if (hasNoItem(commandOutput)) {
    return commandOutput
  }

  // CommandOutput necessarily has Item
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

/**
 * Builds a GET Item command input for a given Entity
 *
 * @param entity Entity
 * @param keyInput Key input
 * @return GetItemCommandInput
 */
export const getItemParams = <E extends EntityV2>(
  entity: E,
  keyInput: KeyInput<E>
): GetItemCommandInput => {
  const { name: tableName } = entity.table

  if (!validateKeyInput(entity, keyInput)) {
    throw new Error()
  }

  const Key = entity.computeKey(keyInput)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Key
  }
}
