import type { ArrayCardinality, ZodArray, ZodTypeAny } from 'zod'

import type { ListSchema, ListSchema_ } from '~/index.js'
import { list } from '~/schema/list/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'
import { withMeta } from './utils.js'

/**
 * Any `zod` array schema.
 */
export type ZodArrayAny = ZodArray<ZodTypeAny, ArrayCardinality>

/**
 * DDB-TB schema derived from a `zod` array schema.
 */
export type FromZodArray<
  ZOD_SCHEMA extends ZodArrayAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodArray<infer ELEMENT_ZOD_SCHEMAS>
    ? ROOT extends true
      ? ListSchema_<FromZodSchema<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
      : ListSchema<FromZodSchema<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
    : never

/**
 * Convert a `zod` array schema to a DDB-TB schema.
 */
export const fromZodArray = (zodArray: ZodArrayAny): ListSchema =>
  withMeta(list(fromZodSchema(zodArray.element)), zodArray)
