import { jsonizedSchemaSchema } from '~/schema/actions/jsonize/schema/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import { schema } from '~/schema/index.js'

import type { JSONizedSchema } from '../jsonize/index.js'
import { fromJSONAttr } from './attribute/index.js'

export const fromJSON = (inputSchema: JSONizedSchema): Schema => {
  const jsonizedSchema = jsonizedSchemaSchema.build(Parser).parse(inputSchema) as JSONizedSchema

  return schema(
    Object.fromEntries(
      Object.entries(jsonizedSchema.attributes).map(([attributeName, jsonizedAttribute]) => [
        attributeName,
        fromJSONAttr(jsonizedAttribute)
      ])
    )
  )
}
