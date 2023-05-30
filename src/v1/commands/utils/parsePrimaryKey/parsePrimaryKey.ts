import type { EntityV2 } from 'v1/entity'
import type { PossiblyUndefinedResolvedItem, PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import type { PrimaryKey } from 'v1/table'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

export const parsePrimaryKey = <ENTITY extends EntityV2>(
  entity: ENTITY,
  keyInput: PossiblyUndefinedResolvedItem
): PrimaryKey<ENTITY['table']> => {
  const { table } = entity
  const { partitionKey, sortKey } = table

  const primaryKey: Record<string, PossiblyUndefinedResolvedAttribute> = {}

  const partitionKeyValidator = validatorsByPrimitiveType[partitionKey.type]
  const partitionKeyValue = keyInput[partitionKey.name]

  if (partitionKeyValidator(partitionKeyValue)) {
    primaryKey[partitionKey.name] = partitionKeyValue
  } else {
    throw new DynamoDBToolboxError('commands.parsePrimaryKey.invalidKeyPart', {
      message: `Invalid partition key: ${partitionKey.name}`,
      path: partitionKey.name,
      payload: {
        expected: partitionKey.type,
        received: partitionKeyValue,
        keyPart: 'partitionKey'
      }
    })
  }

  if (sortKey !== undefined) {
    const sortKeyValidator = validatorsByPrimitiveType[sortKey.type]
    const sortKeyValue = keyInput[sortKey.name]

    if (sortKeyValidator(sortKeyValue)) {
      primaryKey[sortKey.name] = sortKeyValue
    } else {
      throw new DynamoDBToolboxError('commands.parsePrimaryKey.invalidKeyPart', {
        message: `Invalid sort key: ${sortKey.name}`,
        path: sortKey.name,
        payload: {
          expected: sortKey.type,
          received: sortKeyValue,
          keyPart: 'sortKey'
        }
      })
    }
  }

  return primaryKey as PrimaryKey<ENTITY['table']>
}
