import type { ZodOptional, ZodTypeAny } from 'zod'

import type { Schema } from '~/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodOptionalAny = ZodOptional<ZodTypeAny>

export type FromZodOptional<
  ZOD_SCHEMA extends ZodOptional<ZodTypeAny>,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodOptional<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { required: 'never' }>>
    : never

export const fromZodOptional = (zodSchema: ZodOptionalAny): Schema =>
  fromZodSchema(zodSchema.unwrap()).optional()
