import type { Entity } from '~/entity/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/primaryKeyParser.js'

import type { TransformedItem } from './transformedItem.js'

export type SavedItem<ENTITY extends Entity> = TransformedItem<ENTITY> & PrimaryKey<ENTITY['table']>
