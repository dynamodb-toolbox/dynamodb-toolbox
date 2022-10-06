import type { O } from 'ts-toolbelt'
import { GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from '@aws-sdk/client-dynamodb'

import { EntityV2, KeyInput, FormattedItem, format, validateKeyInput, validateSavedItem } from 'v1'

const hasNoItem = (
  commandOutput: GetItemCommandOutput
): commandOutput is Omit<GetItemCommandOutput, 'Item'> & { Item?: undefined } =>
  commandOutput?.Item === undefined

/**
 * Run a GET Item command for a given Entity
 *
 * @param entity Entity
 * @param keyInput Key input
 * @return GetItemCommandOutput
 */
export const getItem = async <EntityInput extends EntityV2>(
  entity: EntityInput,
  keyInput: KeyInput<EntityInput>
): Promise<
  O.Merge<Omit<GetItemCommandOutput, 'Item'>, { Item?: FormattedItem<EntityInput> | undefined }>
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new GetItemCommand(getItemParams<EntityInput>(entity, keyInput))
  )

  if (hasNoItem(commandOutput)) {
    return commandOutput
  }

  // CommandOutput necessarily has Item
  const { Item: item, ...restCommandOutput } = commandOutput as O.Required<
    GetItemCommandOutput,
    'Item'
  >

  if (!validateSavedItem(entity, item)) {
    throw new Error()
  }

  const formattedItem = format(entity, item)

  return { Item: formattedItem, ...restCommandOutput }
}

/**
 * Builds a GET Item command input for a given Entity
 *
 * @param entity Entity
 * @param keyInput Key input
 * @return GetItemCommandInput
 */
export const getItemParams = <EntityInput extends EntityV2>(
  entity: EntityInput,
  keyInput: KeyInput<EntityInput>
): GetItemCommandInput => {
  const { name: tableName } = entity.table

  validateKeyInput(entity, keyInput)

  const Key = entity.computeKey(keyInput)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Key
  }
}
