import type { SomeType } from 'zod/v4/core'

import type { NumberSchema, NumberSchema_ } from '~/index.js'
import { number } from '~/schema/number/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` bigint schema.
 */
export type FromZodBigInt<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true
  ? NumberSchema_<Overwrite<PROPS, { big: true }>>
  : NumberSchema<Overwrite<PROPS, { big: true }>>

/**
 * Convert a `zod` bigint schema to a DDB-TB schema.
 */
export const fromZodBigInt = (zodSchema: SomeType): NumberSchema =>
  withRefinements(withMeta(number({ big: true }), zodSchema), zodSchema)
