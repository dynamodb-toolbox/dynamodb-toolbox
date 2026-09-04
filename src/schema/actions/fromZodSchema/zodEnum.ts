import type { ZodEnum } from 'zod'

import type { StringSchema, StringSchema_ } from '~/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta } from './utils.js'

/**
 * Any `zod` enum schema.
 */
export type ZodEnumAny = ZodEnum<[string, ...string[]]>

/**
 * DDB-TB schema derived from a `zod` enum schema.
 */
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

/**
 * Convert a `zod` enum schema to a DDB-TB schema.
 */
export const fromZodEnum = (zodEnum: ZodEnumAny): StringSchema =>
  withMeta(string().enum(...zodEnum.options), zodEnum)
