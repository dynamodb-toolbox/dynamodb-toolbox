import type { ZodDiscriminatedUnion, ZodDiscriminatedUnionOption } from 'zod'

import type { AnyOfSchema, AnyOfSchema_ } from '~/index.js'
import { anyOf } from '~/schema/anyOf/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchemaRec } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodDiscriminatedUnionAny = ZodDiscriminatedUnion<
  string,
  ZodDiscriminatedUnionOption<string>[]
>

export type FromZodDiscriminatedUnion<
  ZOD_SCHEMA extends ZodDiscriminatedUnionAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodDiscriminatedUnion<infer DISCRIMINATOR, infer ELEMENT_ZOD_SCHEMAS>
    ? ROOT extends true
      ? AnyOfSchema_<
          FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>,
          Overwrite<PROPS, { discriminator: DISCRIMINATOR }>
        >
      : AnyOfSchema<
          FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>,
          Overwrite<PROPS, { discriminator: DISCRIMINATOR }>
        >
    : never

export const fromZodDiscriminatedUnion = (
  zodDiscriminatedUnion: ZodDiscriminatedUnionAny
): AnyOfSchema =>
  anyOf(...zodDiscriminatedUnion.options.map(option => fromZodSchema(option))).discriminate(
    zodDiscriminatedUnion._def.discriminator
  )
