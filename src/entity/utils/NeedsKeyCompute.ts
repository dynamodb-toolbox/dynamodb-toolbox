import type { Always } from '~/attributes/index.js'
import type { Table } from '~/table/index.js'
import type { IndexableKeyType, Key } from '~/table/types/index.js'
import type { Or } from '~/types/or.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import type { EntityAttributes } from './entityAttributes.js'

type NeedsKeyPartCompute<
  ATTRIBUTES extends EntityAttributes,
  KEY_PART_NAME extends string,
  KEY_PART_TYPE extends IndexableKeyType
> =
  // TODO: Use TransformedValue instead
  ATTRIBUTES extends Record<
    KEY_PART_NAME,
    { type: KEY_PART_TYPE; props: { required: Always; key: true; savedAs?: undefined } }
  >
    ? false
    : SelectKeys<
          ATTRIBUTES,
          {
            type: KEY_PART_TYPE
            props: { required: Always; key: true; savedAs: KEY_PART_NAME }
          }
        > extends never
      ? true
      : false

export type NeedsKeyCompute<
  ATTRIBUTES extends EntityAttributes,
  TABLE extends Table
> = Key extends TABLE['sortKey']
  ? NeedsKeyPartCompute<ATTRIBUTES, TABLE['partitionKey']['name'], TABLE['partitionKey']['type']>
  : NonNullable<TABLE['sortKey']> extends Key
    ? Or<
        NeedsKeyPartCompute<
          ATTRIBUTES,
          TABLE['partitionKey']['name'],
          TABLE['partitionKey']['type']
        >,
        NeedsKeyPartCompute<
          ATTRIBUTES,
          NonNullable<TABLE['sortKey']>['name'],
          NonNullable<TABLE['sortKey']>['type']
        >
      >
    : never
