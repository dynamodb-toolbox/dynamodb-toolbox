import type { ZodLiteral } from 'zod'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  BooleanSchema,
  BooleanSchema_,
  NullSchema,
  NullSchema_,
  NumberSchema,
  NumberSchema_,
  StringSchema,
  StringSchema_
} from '~/index.js'
import { boolean } from '~/schema/boolean/index.js'
import { nul } from '~/schema/null/index.js'
import { number } from '~/schema/number/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'
import { isBigInt } from '~/utils/validation/isBigInt.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'
import { isNull } from '~/utils/validation/isNull.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

export type ZodLiteralAny = ZodLiteral<any>

export type FromZodLiteral<
  ZOD_SCHEMA extends ZodLiteralAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodLiteral<infer ZOD_SCHEMA_LITERAL>
    ?
        | (ZOD_SCHEMA_LITERAL extends null
            ? ROOT extends true
              ? NullSchema_<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
              : NullSchema<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
            : never)
        | (ZOD_SCHEMA_LITERAL extends boolean
            ? ROOT extends true
              ? BooleanSchema_<
                  Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>
                >
              : BooleanSchema<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
            : never)
        | (ZOD_SCHEMA_LITERAL extends number
            ? ROOT extends true
              ? NumberSchema_<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
              : NumberSchema<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
            : never)
        | (ZOD_SCHEMA_LITERAL extends bigint
            ? ROOT extends true
              ? NumberSchema_<
                  Overwrite<PROPS, { big: true; enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>
                >
              : NumberSchema<
                  Overwrite<PROPS, { big: true; enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>
                >
            : never)
        | (ZOD_SCHEMA_LITERAL extends string
            ? ROOT extends true
              ? StringSchema_<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
              : StringSchema<Overwrite<PROPS, { enum: [ZOD_SCHEMA_LITERAL]; putDefault: unknown }>>
            : never)
    : never

export const fromZodLiteral = (
  zodLiteral: ZodLiteralAny
): NullSchema | BooleanSchema | NumberSchema | StringSchema => {
  if (isNull(zodLiteral.value)) {
    return nul().const(null)
  }

  if (isBoolean(zodLiteral.value)) {
    return boolean().const(zodLiteral.value)
  }

  if (isNumber(zodLiteral.value)) {
    return number().const(zodLiteral.value)
  }

  if (isBigInt(zodLiteral.value)) {
    return number().big().const(zodLiteral.value)
  }

  if (isString(zodLiteral.value)) {
    return string().const(zodLiteral.value)
  }

  throw new DynamoDBToolboxError('fromZodSchema.unrecognizedLiteral', {
    message: 'ZodLiteral schema cannot be represented within DynamoDB-Toolbox',
    payload: { received: zodLiteral.value }
  })
}
