import type { O } from 'ts-toolbelt'
import { PutItemCommand, PutItemCommandInput, PutItemCommandOutput } from '@aws-sdk/client-dynamodb'

import { EntityV2, Input, Output, parse, validateInput, validateSavedAs } from 'v1'

const hasNoAttributes = (
  commandOutput: PutItemCommandOutput
): commandOutput is O.Merge<Omit<PutItemCommandOutput, 'Attributes'>, { Attributes?: undefined }> =>
  commandOutput?.Attributes === undefined

/**
 * Run a PUT Item command for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return PutItemCommandOutput
 */
export const putItem = async <E extends EntityV2>(
  entity: E,
  input: Input<E>
): Promise<
  O.Merge<Omit<PutItemCommandOutput, 'Attributes'>, { Attributes?: Output<E> | undefined }>
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new PutItemCommand(putItemParams(entity, input))
  )

  if (hasNoAttributes(commandOutput)) {
    return commandOutput
  }

  // CommandOutput necessarily has Attributes
  const { Attributes: attributes, ...restCommandOutput } = commandOutput as O.Required<
    PutItemCommandOutput,
    'Attributes'
  >

  if (!validateSavedAs(entity, attributes)) {
    throw new Error()
  }

  const parsedItem = parse(entity, attributes)

  return { Attributes: parsedItem, ...restCommandOutput }
}

/**
 * Builds a PUT Item command input for a given Entity
 *
 * @param entity Entity
 * @param input Input
 * @return PutItemCommandInput
 */
export const putItemParams = <E extends EntityV2>(
  entity: E,
  input: Input<E>
): PutItemCommandInput => {
  const { name: tableName } = entity.table

  if (!validateInput(entity, input)) {
    throw new Error()
  }

  // TODO: Recursively add initial defaults
  const Item = entity.computeDefaults(input as any)
  const Key = entity.computeKey(input)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Item: { ...Item, ...Key }
  }
}
