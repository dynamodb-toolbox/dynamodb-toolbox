import { record } from '~/attributes/record/index.js'
import { string } from '~/attributes/string/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { $attributeDTOSchema } from './attribute.js'
import type { IAttributeDTO } from './attribute.js'

export const schemaDTOAttributes = {
  type: string().const('schema'),
  attributes: record(string(), $attributeDTOSchema)
}

export const schemaDTOSchema = schema(schemaDTOAttributes)

export type ISchemaDTO = Overwrite<
  FormattedValue<typeof schemaDTOSchema>,
  { attributes: { [x: string]: IAttributeDTO } }
>

export const parseSchemaDTO = (input: unknown): ISchemaDTO =>
  schemaDTOSchema.build(Parser).parse(input) as ISchemaDTO
