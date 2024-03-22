import type { EntityV2 } from 'v1/entity/class'
import type { Schema } from 'v1/schema/schema'
import type { ParsedValue } from 'v1/schema/actions/parse'
import type { PrimaryKey } from 'v1/table/generics'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

import { $entity, EntityOperation } from '../class'

// TODO: Move to table operations
export class PrimaryKeyParser<ENTITY extends EntityV2 = EntityV2> extends EntityOperation<ENTITY> {
  static operationName = 'parsePrimaryKey' as const

  constructor(entity: ENTITY) {
    super(entity)
  }

  parse(keyInput: ParsedValue<Schema, { operation: 'key' }>): PrimaryKey<ENTITY['table']> {
    const { table } = this[$entity]
    const { partitionKey, sortKey } = table

    const primaryKey: ParsedValue<Schema, { operation: 'key' }> = {}

    const partitionKeyValidator = validatorsByPrimitiveType[partitionKey.type]
    const partitionKeyValue = keyInput[partitionKey.name]

    if (!partitionKeyValidator(partitionKeyValue)) {
      throw new DynamoDBToolboxError('operations.parsePrimaryKey.invalidKeyPart', {
        message: `Invalid partition key: ${partitionKey.name}`,
        path: partitionKey.name,
        payload: {
          expected: partitionKey.type,
          received: partitionKeyValue,
          keyPart: 'partitionKey'
        }
      })
    }

    /**
     * @debt type "TODO: Make validator act as primitive typeguard"
     */
    primaryKey[partitionKey.name] = partitionKeyValue as number | string | Buffer

    if (sortKey === undefined) {
      return primaryKey as PrimaryKey<ENTITY['table']>
    }

    const sortKeyValidator = validatorsByPrimitiveType[sortKey.type]
    const sortKeyValue = keyInput[sortKey.name]

    if (!sortKeyValidator(sortKeyValue)) {
      throw new DynamoDBToolboxError('operations.parsePrimaryKey.invalidKeyPart', {
        message: `Invalid sort key: ${sortKey.name}`,
        path: sortKey.name,
        payload: {
          expected: sortKey.type,
          received: sortKeyValue,
          keyPart: 'sortKey'
        }
      })
    }

    /**
     * @debt type "TODO: Make validator act as primitive typeguard"
     */
    primaryKey[sortKey.name] = sortKeyValue as number | string | Buffer

    return primaryKey as PrimaryKey<ENTITY['table']>
  }
}
