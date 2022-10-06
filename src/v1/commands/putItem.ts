import type { O } from 'ts-toolbelt'
import { PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'

import {
  EntityV2,
  PutItemInput,
  validatePutItemInput,
  FormattedItem,
  format,
  validateSavedItem
} from 'v1'

const hasNoAttributes = (
  commandOutput: PutItemCommandOutput
): commandOutput is Omit<PutItemCommandOutput, 'Attributes'> & { Attributes?: undefined } =>
  commandOutput?.Attributes === undefined

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param putItemInput PutItemInput
 * @return PutItemCommandOutput
 */
export const putItem = async <EntityInput extends EntityV2>(
  entity: EntityInput,
  putItemInput: PutItemInput<EntityInput>
): Promise<
  O.Merge<
    Omit<PutItemCommandOutput, 'Attributes'>,
    { Attributes?: FormattedItem<EntityInput> | undefined }
  >
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new PutItemCommand(putItemParams<EntityInput>(entity, putItemInput))
  )

  if (hasNoAttributes(commandOutput)) {
    return commandOutput
  }

  // CommandOutput necessarily has Attributes
  const { Attributes: attributes, ...restCommandOutput } = commandOutput as O.Required<
    PutItemCommandOutput,
    'Attributes'
  >

  if (!validateSavedItem(entity, attributes)) {
    throw new Error()
  }

  const formattedItem = format(entity, attributes)

  return { Attributes: formattedItem, ...restCommandOutput }
}

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param putItemInput Input
 * @return PutItemCommandInput
 */
export const putItemParams = <EntityInput extends EntityV2>(
  entity: EntityInput,
  putItemInput: PutItemInput<EntityInput>
): PutItemCommandInput => {
  const { name: tableName } = entity.table

  if (!validatePutItemInput(entity, putItemInput)) {
    throw new Error()
  }

  // TODO: Recursively add initial defaults
  const Item = entity.computeDefaults(putItemInput as any)
  const Key = entity.computeKey(putItemInput)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Item: { ...Item, ...Key }
  }
}
