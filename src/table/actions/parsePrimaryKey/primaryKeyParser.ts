import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { BinarySchema } from '~/schema/binary/schema.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { StringSchema } from '~/schema/string/schema.js'
import type { Table } from '~/table/index.js'
import { TableAction } from '~/table/index.js'
import type { Key, KeyValue } from '~/table/types/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

/**
 * Returns the TS type of a Table Primary Key
 *
 * @param TABLE Table
 * @return Object
 */
export type PrimaryKey<TABLE extends Table = Table> = Table extends TABLE
  ? Record<string, KeyValue<Key>>
  : Key extends TABLE['sortKey']
    ? {
        [KEY in TABLE['partitionKey']['name']]: KeyValue<TABLE['partitionKey']>
      }
    : NonNullable<TABLE['sortKey']> extends Key
      ? {
          [KEY in
            | TABLE['partitionKey']['name']
            | NonNullable<TABLE['sortKey']>['name']]: KEY extends TABLE['partitionKey']['name']
            ? KeyValue<TABLE['partitionKey']>
            : KEY extends NonNullable<TABLE['sortKey']>['name']
              ? KeyValue<NonNullable<TABLE['sortKey']>>
              : never
        }
      : never

export class PrimaryKeyParser<TABLE extends Table = Table> extends TableAction<TABLE> {
  static override actionName = 'parsePrimaryKey' as const

  constructor(table: TABLE) {
    super(table)
  }

  parse(keyInput: { [KEY: string]: unknown }): PrimaryKey<TABLE> {
    const table = this.table
    const { partitionKey, sortKey } = table

    const primaryKey: { [KEY: string]: unknown } = {}

    const partitionKeyValue = keyInput[partitionKey.name]

    if (!isValidPrimitive(getKeySchema(partitionKey), partitionKeyValue)) {
      throw new DynamoDBToolboxError('actions.parsePrimaryKey.invalidKeyPart', {
        message: `Invalid partition key: ${partitionKey.name}`,
        path: partitionKey.name,
        payload: {
          expected: partitionKey.type,
          received: partitionKeyValue,
          keyPart: 'partitionKey'
        }
      })
    }

    primaryKey[partitionKey.name] = partitionKeyValue

    if (sortKey === undefined) {
      return primaryKey as PrimaryKey<TABLE>
    }

    const sortKeyValue = keyInput[sortKey.name]
    if (!isValidPrimitive(getKeySchema(sortKey), sortKeyValue)) {
      throw new DynamoDBToolboxError('actions.parsePrimaryKey.invalidKeyPart', {
        message: `Invalid sort key: ${sortKey.name}`,
        path: sortKey.name,
        payload: {
          expected: sortKey.type,
          received: sortKeyValue,
          keyPart: 'sortKey'
        }
      })
    }

    primaryKey[sortKey.name] = sortKeyValue

    return primaryKey as PrimaryKey<TABLE>
  }
}

const getKeySchema = (key: Key) => {
  switch (key.type) {
    case 'number':
      return new NumberSchema({ big: true })
    case 'string':
      return new StringSchema({})
    case 'binary':
      return new BinarySchema({})
  }
}
