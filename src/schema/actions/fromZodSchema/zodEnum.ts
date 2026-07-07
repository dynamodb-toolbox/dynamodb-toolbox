import type { ZodEnum } from 'zod'

import type { StringSchema, StringSchema_ } from '~/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

export type ZodEnumAny = ZodEnum<[string, ...string[]]>

export type FromZodEnum<
  ZOD_SCHEMA extends ZodEnumAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodEnum<infer ZOD_SCHEMA_ENUM>
    ? ROOT extends true
      ? StringSchema_<Overwrite<PROPS, { enum: ZOD_SCHEMA_ENUM }>>
      : StringSchema<Overwrite<PROPS, { enum: ZOD_SCHEMA_ENUM }>>
    : never

export const fromZodEnum = (zodEnum: ZodEnumAny): StringSchema => string().enum(...zodEnum.options)
