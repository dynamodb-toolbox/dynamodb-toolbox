import type { z } from 'zod/v4'

import type { ItemSchema, MapSchema, Schema } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

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
 * Deliberately has no type counterpart: `.superRefine` returns the schema it is called on.
 */
export const withValidate = (schema: Schema, zodSchema: z.ZodType): z.ZodType => {
  const { key = false, keyValidator, putValidator } = schema.props

  const validator = key ? keyValidator : putValidator

  if (validator === undefined) {
    return zodSchema
  }

  // `.superRefine` rather than `.refine`: a validator rejects with a message, which is a truthy value
  return zodSchema.superRefine((input, ctx) => {
    const validationResult = validator(input, schema)

    if (validationResult !== true) {
      ctx.addIssue(
        `Custom validation failed${
          isString(validationResult) ? ` with message: ${validationResult}` : ''
        }.`
      )
    }
  })
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
