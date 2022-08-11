import { O } from 'ts-toolbelt'
import {
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput
} from '@aws-sdk/client-dynamodb'

import { EntityV2, Input, Output, parse, validateInput, validateSavedAs } from 'v2/entity'

const hasNoAttributes = (
  commandOutput: UpdateItemCommandOutput
): commandOutput is O.Merge<
  Omit<UpdateItemCommandOutput, 'Attributes'>,
  { Attributes?: undefined }
> => commandOutput?.Attributes === undefined

export const updateItem = async <E extends EntityV2>(
  entity: E,
  input: Input<E>
): Promise<
  O.Merge<Omit<UpdateItemCommandOutput, 'Attributes'>, { Attributes?: Output<E> | undefined }>
> => {
  const commandOutput = await entity.table.dynamoDbClient.send(
    new UpdateItemCommand(updateItemParams(entity, input))
  )

  if (hasNoAttributes(commandOutput)) {
    return commandOutput
  }

  const { Attributes: attributes, ...restCommandOutput } = commandOutput as O.Required<
    UpdateItemCommandOutput,
    'Attributes'
  >

  if (!validateSavedAs(entity, attributes)) {
    throw new Error()
  }

  const parsedItem = parse(entity, attributes)

  return { Attributes: parsedItem, ...restCommandOutput }
}

export const updateItemParams = <E extends EntityV2>(
  entity: E,
  input: Input<E>
): UpdateItemCommandInput => {
  const { name: tableName } = entity.table

  if (!validateInput(entity, input)) {
    throw new Error()
  }

  const Item = entity.item?._computeDefaults ? entity.item._computeDefaults(input) : input
  const Key = entity.computeKey(input)

  return {
    TableName: tableName,
    // @ts-ignore TODO parse input
    Item: { ...Item, ...Key }
  }
}
