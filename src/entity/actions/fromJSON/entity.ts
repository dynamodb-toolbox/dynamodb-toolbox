import { Entity } from '~/entity/index.js'
import type { TimestampsDefaultOptions } from '~/entity/utils/addInternalAttributes/options.js'
import { fromJSON as fromJSONizedSchema } from '~/schema/actions/fromJSON/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { fromJSON as fromJSONizedTable } from '~/table/actions/fromJSON/index.js'

import type { JSONizedEntity } from '../jsonize/index.js'
import { jsonizedEntitySchema } from '../jsonize/schema.js'

export const fromJSON = (inputEntity: JSONizedEntity): Entity => {
  const {
    name: entityName,
    schema,
    entityAttributeName,
    entityAttributeHidden,
    timestamps,
    table
  } = jsonizedEntitySchema.build(Parser).parse(inputEntity) as JSONizedEntity

  return new Entity({
    name: entityName,
    schema: fromJSONizedSchema(schema),
    entityAttributeName,
    entityAttributeHidden,
    timestamps: timestamps as TimestampsDefaultOptions,
    table: fromJSONizedTable(table),
    computeKey: () => ({})
  })
}
