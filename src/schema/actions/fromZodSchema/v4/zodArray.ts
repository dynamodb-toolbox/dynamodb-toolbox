import type { $ZodArray, $ZodArrayDef, SomeType } from 'zod/v4/core'

import type { ListSchema, ListSchema_ } from '~/index.js'
import { list } from '~/schema/list/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` array schema.
 */
export type FromZodArray<
  ZOD_SCHEMA extends $ZodArray,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodArray<infer ZOD_SCHEMA_ELEMENTS>
    ? ROOT extends true
      ? ListSchema_<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
      : ListSchema<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
    : never

/**
 * Convert a `zod` array schema to a DDB-TB schema.
 */
export const fromZodArray = (zodArray: SomeType, { element }: $ZodArrayDef): ListSchema =>
  withRefinements(withMeta(list(fromZodSchema(element)), zodArray), zodArray)
