import type { ZodSet } from 'zod'
import { ZodBigInt, ZodNumber, ZodString } from 'zod'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  NumberSchema,
  NumberSchemaProps,
  SetSchema,
  SetSchema_,
  StringSchema,
  StringSchemaProps
} from '~/index.js'
import { set } from '~/schema/set/index.js'
import type { SetElementProps } from '~/schema/set/types.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type FromZodSet<
  ZOD_SCHEMA extends ZodSet,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodSet<infer ZOD_SCHEMA_ELEMENTS>
    ?
        | (FromZodSchema<ZOD_SCHEMA_ELEMENTS, false> extends NumberSchema<
            NumberSchemaProps & SetElementProps
          >
            ? ROOT extends true
              ? SetSchema_<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
              : SetSchema<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
            : never)
        | (FromZodSchema<ZOD_SCHEMA_ELEMENTS, false> extends StringSchema<
            StringSchemaProps & SetElementProps
          >
            ? ROOT extends true
              ? SetSchema_<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
              : SetSchema<FromZodSchema<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
            : never)
    : never

export const fromZodSet = (zodSet: ZodSet): SetSchema => {
  const { valueType } = zodSet._def

  if (
    !(
      valueType instanceof ZodNumber ||
      valueType instanceof ZodString ||
      valueType instanceof ZodBigInt
    )
  ) {
    throw new DynamoDBToolboxError('fromZodSchema.unsupportedSetValueType', {
      message: 'Sets can only contain binaries, strings or number',
      payload: { received: valueType }
    })
  }

  return set(fromZodSchema(valueType))
}
