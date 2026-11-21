import type { z } from 'zod/v3'

import type { ItemSchema, MapSchema, Schema, Validator } from '~/schema/index.js'
import type { Extends, If, Or } from '~/types/index.js'
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
 * Wrap a Zod schema with the schema's custom validator, if any.
 */
export type WithValidate<SCHEMA extends Schema, ZOD_SCHEMA extends z.ZodTypeAny> = If<
  Or<
    Extends<SCHEMA['props'], { key: true; keyValidator: Validator }>,
    Extends<SCHEMA['props'], { key?: false; putValidator: Validator }>
  >,
  z.ZodEffects<ZOD_SCHEMA, z.output<ZOD_SCHEMA>, z.input<ZOD_SCHEMA>>,
  ZOD_SCHEMA
>

/**
 * Apply the schema's custom validator to a Zod schema.
 */
export const withValidate = (schema: Schema, zodSchema: z.ZodTypeAny): z.ZodTypeAny => {
  const { key = false, keyValidator, putValidator } = schema.props

  const validator = key ? keyValidator : putValidator

  if (validator === undefined) {
    return zodSchema
  }

  // `.superRefine` rather than `.refine`: a validator rejects with a message, which is a truthy value
  return zodSchema.superRefine((input, ctx) => {
    const validationResult = validator(input, schema)

    if (validationResult !== true) {
      ctx.addIssue({
        code: 'custom',
        message: `Custom validation failed${
          isString(validationResult) ? ` with message: ${validationResult}` : ''
        }.`
      })
    }
  })
}

/**
 * Apply the schema's meta description to a Zod schema.
 */
export const withDescribe = (schema: Schema, zodSchema: z.ZodTypeAny): z.ZodTypeAny => {
  const { meta } = schema.props

  if (meta?.description !== undefined) {
    return zodSchema.describe(meta.description)
  }

  return zodSchema
}
