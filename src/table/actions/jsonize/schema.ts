import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { schema } from '~/schema/index.js'
import type { IndexableKeyType } from '~/table/types/keyType.js'

const INDEXABLE_KEY_TYPES: IndexableKeyType[] = ['string', 'number', 'binary']

const keySchema = map({
  name: string(),
  type: string().enum(...INDEXABLE_KEY_TYPES)
})

export const jsonizedTableAttributes = {
  type: string().const('table'),
  name: string().optional(),
  partitionKey: keySchema,
  sortKey: keySchema.optional(),
  entityAttributeSavedAs: string()
}

export const jsonizedTableSchema = schema(jsonizedTableAttributes)

export type JSONizedTable = FormattedValue<typeof jsonizedTableSchema>
