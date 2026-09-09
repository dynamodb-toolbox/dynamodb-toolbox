import type { Entity } from '~/entity/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/primaryKeyParser.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { TransformedItem } from './transformedItem.js'

/** Item of an entity as saved in DynamoDB, primary key included. */
export type SavedItem<ENTITY extends Entity> = ComputeObject<
  TransformedItem<ENTITY> & PrimaryKey<ENTITY['table']>
>
