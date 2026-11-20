import type { $ZodType, SomeType } from 'zod/v4/core'
import { globalRegistry, safeParse } from 'zod/v4/core'

import type { AnySchema_ } from '~/schema/any/index.js'
import type { Schema, Schema_ } from '~/schema/types/schema.js'

/**
 * Carry a `zod` schema's `meta` store onto the DDB-TB schema derived from it.
 *
 * @debt type "The `meta` prop is not reflected in `FromZodSchema`"
 */
export const withMeta = <SCHEMA extends Schema>(schema: SCHEMA, zodSchema: SomeType): SCHEMA => {
  /**
   * `globalRegistry` is keyed by `$ZodType`, which every schema reaching this action is: `SomeType`
   * is only looser so that the sub-schemas `zod` exposes on its `def`s can be recursed into.
   */
  const meta = globalRegistry.get(zodSchema as $ZodType)

  return meta === undefined ? schema : ((schema as Schema_).meta(meta) as unknown as SCHEMA)
}

/**
 * Carry a `zod` schema's refinements onto the DDB-TB schema derived from it, as a put validator.
 *
 * Refinements are not a node of their own in zod v4 — they append to `def.checks` on the schema
 * they refine — so they are carried by each mapper, next to `withMeta`, rather than by a mapper of
 * their own like v3's `zodEffects.ts`.
 *
 * @debt type "The validator props are not reflected in `FromZodSchema`"
 */
export const withRefinements = <SCHEMA extends Schema>(
  schema: SCHEMA,
  zodSchema: SomeType
): SCHEMA => {
  const { checks } = zodSchema._zod.def

  if (checks === undefined || checks.length === 0) {
    return schema
  }

  /**
   * `.validate` is typed against the schema it is called on, so the `Schema_` union cannot call it.
   * `AnySchema_` is the loosest of them — its validator takes `unknown` — and the method is shared
   * by every builder.
   *
   * `zod` re-runs the whole schema rather than the checks alone, which is what makes this one line:
   * the type has already been validated by the DDB-TB schema, so the checks are all that can fail.
   */
  return (schema as unknown as AnySchema_).validate(value => {
    const { error } = safeParse(zodSchema as $ZodType, value)

    return error === undefined ? true : error.issues.map(issue => issue.message).join(', ')
  }) as unknown as SCHEMA
}
