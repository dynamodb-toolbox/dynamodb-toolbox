import type { SomeType } from 'zod/v4/core'

import type { StringSchema, StringSchema_ } from '~/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` string schema.
 */
export type FromZodString<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? StringSchema_<PROPS> : StringSchema<PROPS>

/**
 * Convert a `zod` string schema to a DDB-TB schema.
 */
export const fromZodString = (zodSchema: SomeType): StringSchema =>
  withRefinements(withMeta(string(), zodSchema), zodSchema)
