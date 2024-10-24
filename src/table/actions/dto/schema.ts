import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ValidValue } from '~/schema/index.js'
import { schema } from '~/schema/index.js'
import type { IndexableKeyType } from '~/table/types/keyType.js'

const INDEXABLE_KEY_TYPES: IndexableKeyType[] = ['string', 'number', 'binary']

const keySchema = map({
  name: string(),
  type: string().enum(...INDEXABLE_KEY_TYPES)
})

export const tableDTOAttributes = {
  name: string().optional(),
  partitionKey: keySchema,
  sortKey: keySchema.optional(),
  entityAttributeSavedAs: string()
}

export const tableDTOSchema = schema(tableDTOAttributes)

export type ITableDTO = ValidValue<typeof tableDTOSchema>

export const parseTableDTO = (input: unknown): ITableDTO =>
  tableDTOSchema.build(Parser).parse(input)
