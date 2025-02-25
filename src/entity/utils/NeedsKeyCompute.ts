import type { Always } from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Table } from '~/table/index.js'
import type { IndexableKeyType, Key } from '~/table/types/index.js'
import type { Or } from '~/types/or.js'
import type { SelectKeys } from '~/types/selectKeys.js'

type NeedsKeyPartCompute<
  SCHEMA extends Schema,
  KEY_PART_NAME extends string,
  KEY_PART_TYPE extends IndexableKeyType
> =
  // TODO: Use TransformedValue instead
  SCHEMA['attributes'] extends Record<
    KEY_PART_NAME,
    { type: KEY_PART_TYPE; state: { required: Always; key: true; savedAs?: undefined } }
  >
    ? false
    : SelectKeys<
          SCHEMA['attributes'],
          {
            type: KEY_PART_TYPE
            state: { required: Always; key: true; savedAs: KEY_PART_NAME }
          }
        > extends never
      ? true
      : false

/**
 * Whether the provided schema matches the primary key of a given table
 *
 * @param SCHEMA Schema
 * @param TABLE Table
 * @return Boolean
 */
export type NeedsKeyCompute<
  SCHEMA extends Schema,
  TABLE extends Table
> = Key extends TABLE['sortKey']
  ? NeedsKeyPartCompute<SCHEMA, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>
  : NonNullable<TABLE['sortKey']> extends Key
    ? Or<
        NeedsKeyPartCompute<SCHEMA, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>,
        NeedsKeyPartCompute<
          SCHEMA,
          NonNullable<TABLE['sortKey']>['name'],
          NonNullable<TABLE['sortKey']>['type']
        >
      >
    : never
