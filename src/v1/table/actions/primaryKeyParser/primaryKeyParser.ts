import { TableV2, TableAction, $table } from 'v1/table'
import type { Schema } from 'v1/schema'
import type { ParsedValue } from 'v1/schema/actions/parse'
import type { PrimaryKey } from 'v1/table/generics'
import { validatorsByPrimitiveType } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

export class PrimaryKeyParser<TABLE extends TableV2 = TableV2> extends TableAction<TABLE> {
  static operationName = 'parsePrimaryKey' as const

  constructor(table: TABLE) {
    super(table)
  }

  parse(keyInput: ParsedValue<Schema, { operation: 'key' }>): PrimaryKey<TABLE> {
    const table = this[$table]
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
      return primaryKey as PrimaryKey<TABLE>
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

    return primaryKey as PrimaryKey<TABLE>
  }
}
