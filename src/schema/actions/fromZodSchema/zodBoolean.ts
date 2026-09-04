import type { ZodBoolean } from 'zod'

import type { BooleanSchema, BooleanSchema_ } from '~/index.js'
import { boolean } from '~/schema/boolean/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` boolean schema.
 */
export type FromZodBoolean<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? BooleanSchema_<PROPS> : BooleanSchema<PROPS>

/**
 * Convert a `zod` boolean schema to a DDB-TB schema.
 */
export const fromZodBoolean = (zodSchema: ZodBoolean): BooleanSchema =>
  withMeta(boolean(), zodSchema)
