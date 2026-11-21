import type { SomeType } from 'zod/v4/core'

import type { BooleanSchema, BooleanSchema_ } from '~/index.js'
import { boolean } from '~/schema/boolean/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta, withRefinements } from './utils.js'

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
export const fromZodBoolean = (zodSchema: SomeType): BooleanSchema =>
  withRefinements(withMeta(boolean(), zodSchema), zodSchema)
