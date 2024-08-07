import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'
import type { FormattedValue } from '~/schema/actions/format/index.js'
import { schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { jsonAttrSchema } from './attribute.js'
import type { JSONizedAttr } from './attribute.js'

export const jsonizedSchemaSchema = schema({
  type: string().const('schema'),
  attributes: record(string(), jsonAttrSchema)
})

export type JSONizedSchema = Overwrite<
  FormattedValue<typeof jsonizedSchemaSchema>,
  { attributes: { [x: string]: JSONizedAttr } }
>
