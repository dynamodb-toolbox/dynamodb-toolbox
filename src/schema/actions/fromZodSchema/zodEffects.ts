import type { ZodEffects, ZodTypeAny } from 'zod'

import type { Schema, Validator } from '~/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodEffectsAny = ZodEffects<ZodTypeAny>

export type FromZodEffects<
  ZOD_SCHEMA extends ZodEffectsAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodEffects<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { putValidator: Validator }>>
    : never

export const fromZodEffects = (zodSchema: ZodEffectsAny): Schema => {
  const schema = fromZodSchema(zodSchema._def.schema)
  const effect = zodSchema._def.effect

  if (effect.type === 'refinement') {
    return schema.validate(candidate =>
      effect.refinement(candidate, { path: [], addIssue: () => undefined })
    )
  }

  return schema
}
