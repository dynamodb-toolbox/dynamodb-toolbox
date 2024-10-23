import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'
import { jsonizedSchemaAttributes } from '~/schema/actions/jsonize/schema/index.js'
import type { JSONizedSchema } from '~/schema/actions/jsonize/schema/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { schema } from '~/schema/index.js'
import { jsonizedTableAttributes } from '~/table/actions/jsonize/schema.js'
import type { Overwrite } from '~/types/overwrite.js'

const timestampOption = anyOf(
  boolean(),
  map({
    name: string().optional(),
    savedAs: string().optional(),
    hidden: boolean().optional()
  })
)

const timestampOptions = anyOf(
  boolean(),
  map({
    created: timestampOption,
    modified: timestampOption
  })
)

export const jsonizedEntitySchema = schema({
  type: string().const('entity'),
  name: string(),
  schema: map(jsonizedSchemaAttributes),
  entityAttributeName: string().optional(),
  entityAttributeHidden: boolean().optional(),
  timestamps: timestampOptions.optional(),
  table: map(jsonizedTableAttributes)
})

export type JSONizedEntity = Overwrite<
  FormattedValue<typeof jsonizedEntitySchema>,
  { schema: JSONizedSchema }
>
