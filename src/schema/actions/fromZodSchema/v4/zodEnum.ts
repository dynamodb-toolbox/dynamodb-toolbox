import type { $ZodEnum, SomeType } from 'zod/v4/core'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type { NumberSchema, NumberSchema_, StringSchema, StringSchema_ } from '~/index.js'
import { number } from '~/schema/number/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

import type { EnumProps } from './types.js'
import { withMeta, withRefinements } from './utils.js'

type FromZodEnumValues<VALUES, ROOT extends boolean, PROPS extends SchemaProps> = [VALUES] extends [
  string
]
  ? ROOT extends true
    ? StringSchema_<EnumProps<VALUES, PROPS>>
    : StringSchema<EnumProps<VALUES, PROPS>>
  : [VALUES] extends [number]
    ? ROOT extends true
      ? NumberSchema_<EnumProps<VALUES, PROPS>>
      : NumberSchema<EnumProps<VALUES, PROPS>>
    : never

/**
 * DDB-TB schema derived from a `zod` enum schema.
 */
export type FromZodEnum<
  ZOD_SCHEMA extends $ZodEnum,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodEnum<infer ENTRIES>
    ? FromZodEnumValues<ENTRIES[keyof ENTRIES], ROOT, PROPS>
    : never

/**
 * Convert a `zod` enum schema to a DDB-TB schema.
 */
export const fromZodEnum = (zodEnum: SomeType): NumberSchema | StringSchema => {
  /**
   * Read from `_zod.values` rather than `def.entries`: a numeric TS enum also carries its reverse
   * mappings in `entries` (`{ 0: 'A', A: 0 }`), which `values` has already filtered out.
   */
  const values = [...(zodEnum._zod.values ?? [])]
  // An empty value list falls through to the throw, as `firstValue` is then `undefined`
  const [firstValue] = values

  if (isString(firstValue) && values.every(isString)) {
    return withRefinements(withMeta(string().enum(...values), zodEnum), zodEnum)
  }

  if (isNumber(firstValue) && values.every(isNumber)) {
    return withRefinements(withMeta(number().enum(...values), zodEnum), zodEnum)
  }

  throw new DynamoDBToolboxError('fromZodSchema.unrecognizedEnum', {
    message: 'z.enum() values cannot be represented within DynamoDB-Toolbox',
    payload: { received: values }
  })
}
