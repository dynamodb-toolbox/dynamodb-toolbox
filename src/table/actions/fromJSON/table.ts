import { Parser } from '~/schema/actions/parse/index.js'
import { Table } from '~/table/index.js'

import type { JSONizedTable } from '../jsonize/index.js'
import { jsonizedTableSchema } from '../jsonize/schema.js'

export const fromJSON = (jsonizedTable: JSONizedTable): Table => {
  const { name, partitionKey, sortKey, entityAttributeSavedAs } = jsonizedTableSchema
    .build(Parser)
    .parse(jsonizedTable)

  return new Table({
    name,
    partitionKey,
    sortKey,
    entityAttributeSavedAs
  })
}
