import type { ZodDefault, ZodTypeAny } from 'zod'

import type { Schema } from '~/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodDefaultAny = ZodDefault<ZodTypeAny>

export type FromZodDefault<
  ZOD_SCHEMA extends ZodDefaultAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodDefault<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { putDefault: unknown }>>
    : never

export const fromZodDefault = (zodSchema: ZodDefaultAny): Schema =>
  fromZodSchema(zodSchema.removeDefault()).default(zodSchema._def.defaultValue())
