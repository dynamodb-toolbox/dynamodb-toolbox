import { anyOf } from '~/attributes/anyOf/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { map } from '~/attributes/map/index.js'
import { string } from '~/attributes/string/index.js'
import type { ISchemaDTO } from '~/schema/actions/dto/schema/index.js'
import { schemaDTOAttributes } from '~/schema/actions/dto/schema/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ValidValue } from '~/schema/index.js'
import { schema } from '~/schema/index.js'
import { tableDTOAttributes } from '~/table/actions/dto/schema.js'
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

export const entityDTOAttributes = {
  name: string(),
  schema: map(schemaDTOAttributes),
  entityAttributeName: string().optional(),
  entityAttributeHidden: boolean().optional(),
  timestamps: timestampOptions.optional(),
  table: map(tableDTOAttributes)
}

export const entityDTOSchema = schema(entityDTOAttributes)

export const parseEntityDTO = (input: unknown): IEntityDTO =>
  entityDTOSchema.build(Parser).parse(input) as IEntityDTO

export type IEntityDTO = Overwrite<ValidValue<typeof entityDTOSchema>, { schema: ISchemaDTO }>
