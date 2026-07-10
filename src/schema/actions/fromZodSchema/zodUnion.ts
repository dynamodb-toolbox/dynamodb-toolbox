import type { ZodUnion, ZodUnionOptions } from 'zod'

import type { AnyOfSchema, AnyOfSchema_ } from '~/index.js'
import { anyOf } from '~/schema/anyOf/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchemaRec } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodUnionAny = ZodUnion<ZodUnionOptions>

export type FromZodUnion<
  ZOD_SCHEMA extends ZodUnionAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodUnion<infer ELEMENT_ZOD_SCHEMAS>
    ? ROOT extends true
      ? AnyOfSchema_<FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
      : AnyOfSchema<FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
    : never

export const fromZodUnion = (zodUnion: ZodUnionAny): AnyOfSchema =>
  anyOf(...zodUnion.options.map(option => fromZodSchema(option)))
