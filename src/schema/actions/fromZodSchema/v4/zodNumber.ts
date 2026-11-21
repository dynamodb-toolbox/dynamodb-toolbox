import type { SomeType } from 'zod/v4/core'

import type { NumberSchema, NumberSchema_ } from '~/index.js'
import { number } from '~/schema/number/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` number schema.
 */
export type FromZodNumber<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? NumberSchema_<PROPS> : NumberSchema<PROPS>

/**
 * Convert a `zod` number schema to a DDB-TB schema.
 */
export const fromZodNumber = (zodSchema: SomeType): NumberSchema =>
  withRefinements(withMeta(number(), zodSchema), zodSchema)
