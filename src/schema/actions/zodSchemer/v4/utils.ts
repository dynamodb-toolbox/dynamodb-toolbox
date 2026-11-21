import type { z } from 'zod/v4'

import type { ItemSchema, MapSchema, Schema } from '~/schema/index.js'

/**
 * Attribute keys of a `map`/`item` renamed via `savedAs`.
 */
export type SavedAsAttributes<SCHEMA extends MapSchema | ItemSchema> = {
  [KEY in keyof SCHEMA['attributes']]: SCHEMA['attributes'][KEY]['props'] extends {
    savedAs: string
  }
    ? KEY
    : never
}[keyof SCHEMA['attributes']]

/**
 * Apply the schema's custom validator to a Zod schema.
 *
 * Has no type counterpart, where v3 needed a `WithValidate`: in zod v4 `.refine` appends a check to
 * the schema it is called on and returns it, rather than wrapping it in a `ZodEffects`.
 */
export const withValidate = (schema: Schema, zodSchema: z.ZodType): z.ZodType => {
  const { key = false, keyValidator, putValidator } = schema.props

  if (key && keyValidator !== undefined) {
    return zodSchema.refine(input => keyValidator(input, schema))
  }

  if (!key && putValidator !== undefined) {
    return zodSchema.refine(input => putValidator(input, schema))
  }

  return zodSchema
}

/**
 * Apply the schema's meta store to a Zod schema.
 *
 * The whole store is carried, where v3 carried the description alone: zod v4 has a meta store of its
 * own (`z.globalRegistry`), which `.meta` writes to.
 */
export const withMeta = (schema: Schema, zodSchema: z.ZodType): z.ZodType => {
  const { meta } = schema.props

  if (meta === undefined) {
    return zodSchema
  }

  return zodSchema.meta(meta)
}
