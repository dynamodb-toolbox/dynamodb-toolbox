import type { SomeType, output } from 'zod/v4/core'

import type { AnySchema, AnySchema_ } from '~/index.js'
import { any } from '~/schema/any/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB `any` schema derived from an arbitrary `zod` schema.
 */
export type FromZodCustom<
  ZOD_SCHEMA extends SomeType,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true
  ? AnySchema_<
      unknown extends output<ZOD_SCHEMA> ? PROPS : Overwrite<PROPS, { castAs: output<ZOD_SCHEMA> }>
    >
  : AnySchema<
      unknown extends output<ZOD_SCHEMA> ? PROPS : Overwrite<PROPS, { castAs: output<ZOD_SCHEMA> }>
    >

/**
 * Convert an arbitrary `zod` schema to a DDB-TB `any` schema.
 */
export const fromZodCustom = (zodSchema: SomeType): AnySchema =>
  withRefinements(withMeta(any(), zodSchema), zodSchema)
