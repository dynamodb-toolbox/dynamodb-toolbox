import type { $ZodLiteral, $ZodLiteralDef, SomeType, util } from 'zod/v4/core'

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

import type { EnumProps } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * `true` if VALUES holds several values, i.e. if the literal is a multi-value one.
 *
 * `$ZodLiteralDef.values` is an array at the type level whatever its length, so the arity is only
 * recoverable from VALUES being a union or not.
 */
type IsMultiValue<VALUES, ALL_VALUES = VALUES> = VALUES extends ALL_VALUES
  ? [ALL_VALUES] extends [VALUES]
    ? false
    : true
  : never

type ConstProps<VALUES, PROPS extends SchemaProps> = Overwrite<
  PROPS,
  { enum: [VALUES]; putDefault: unknown }
>

type BigConstProps<VALUES, PROPS extends SchemaProps> = Overwrite<
  PROPS,
  { big: true; enum: [VALUES]; putDefault: unknown }
>

type BigEnumProps<VALUES, PROPS extends SchemaProps> = Overwrite<
  PROPS,
  { big: true; enum: VALUES[] }
>

type FromZodLiteralConst<VALUES, ROOT extends boolean, PROPS extends SchemaProps> =
  | (VALUES extends null
      ? ROOT extends true
        ? NullSchema_<ConstProps<VALUES, PROPS>>
        : NullSchema<ConstProps<VALUES, PROPS>>
      : never)
  | (VALUES extends boolean
      ? ROOT extends true
        ? BooleanSchema_<ConstProps<VALUES, PROPS>>
        : BooleanSchema<ConstProps<VALUES, PROPS>>
      : never)
  | (VALUES extends number
      ? ROOT extends true
        ? NumberSchema_<ConstProps<VALUES, PROPS>>
        : NumberSchema<ConstProps<VALUES, PROPS>>
      : never)
  | (VALUES extends bigint
      ? ROOT extends true
        ? NumberSchema_<BigConstProps<VALUES, PROPS>>
        : NumberSchema<BigConstProps<VALUES, PROPS>>
      : never)
  | (VALUES extends string
      ? ROOT extends true
        ? StringSchema_<ConstProps<VALUES, PROPS>>
        : StringSchema<ConstProps<VALUES, PROPS>>
      : never)

type FromZodLiteralEnum<VALUES, ROOT extends boolean, PROPS extends SchemaProps> = [
  VALUES
] extends [boolean]
  ? ROOT extends true
    ? BooleanSchema_<EnumProps<VALUES, PROPS>>
    : BooleanSchema<EnumProps<VALUES, PROPS>>
  : [VALUES] extends [number]
    ? ROOT extends true
      ? NumberSchema_<EnumProps<VALUES, PROPS>>
      : NumberSchema<EnumProps<VALUES, PROPS>>
    : [VALUES] extends [bigint]
      ? ROOT extends true
        ? NumberSchema_<BigEnumProps<VALUES, PROPS>>
        : NumberSchema<BigEnumProps<VALUES, PROPS>>
      : [VALUES] extends [string]
        ? ROOT extends true
          ? StringSchema_<EnumProps<VALUES, PROPS>>
          : StringSchema<EnumProps<VALUES, PROPS>>
        : never

/**
 * DDB-TB schema derived from a `zod` literal schema.
 */
export type FromZodLiteral<
  ZOD_SCHEMA extends $ZodLiteral,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodLiteral<infer VALUES>
    ? IsMultiValue<VALUES> extends true
      ? FromZodLiteralEnum<VALUES, ROOT, PROPS>
      : FromZodLiteralConst<VALUES, ROOT, PROPS>
    : never

const fromLiteralValue = (
  value: util.Literal
): NullSchema | BooleanSchema | NumberSchema | StringSchema | undefined => {
  if (isNull(value)) {
    return nul().const(null)
  }

  if (isBoolean(value)) {
    return boolean().const(value)
  }

  if (isNumber(value)) {
    return number().const(value)
  }

  if (isBigInt(value)) {
    return number().big().const(value)
  }

  if (isString(value)) {
    return string().const(value)
  }

  return undefined
}

const fromLiteralValues = (
  values: util.Literal[]
): BooleanSchema | NumberSchema | StringSchema | undefined => {
  if (values.every(isBoolean)) {
    return boolean().enum(...values)
  }

  if (values.every(isNumber)) {
    return number().enum(...values)
  }

  if (values.every(isBigInt)) {
    return number()
      .big()
      .enum(...values)
  }

  if (values.every(isString)) {
    return string().enum(...values)
  }

  return undefined
}

/**
 * Convert a `zod` literal schema to a DDB-TB schema.
 */
export const fromZodLiteral = (
  zodLiteral: SomeType,
  { values }: $ZodLiteralDef<util.Literal>
): NullSchema | BooleanSchema | NumberSchema | StringSchema => {
  const [firstValue, ...otherValues] = values

  // An empty value list falls in the first branch, as `firstValue` is then `undefined`
  const schema = otherValues.length === 0 ? fromLiteralValue(firstValue) : fromLiteralValues(values)

  if (schema === undefined) {
    throw new DynamoDBToolboxError('fromZodSchema.unrecognizedLiteral', {
      message: 'z.literal() values cannot be represented within DynamoDB-Toolbox',
      payload: { received: values }
    })
  }

  return withRefinements(withMeta(schema, zodLiteral), zodLiteral)
}
