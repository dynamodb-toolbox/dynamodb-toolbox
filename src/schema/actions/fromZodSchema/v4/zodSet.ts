import type { $ZodSet, $ZodSetDef, SomeType } from 'zod/v4/core'

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
import type { SetElementProps, SetElementSchema } from '~/schema/set/types.js'
import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import { hasDefinedDefault } from '~/schema/utils/hasDefinedDefault.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` set schema.
 */
export type FromZodSet<
  ZOD_SCHEMA extends $ZodSet,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodSet<infer ZOD_SCHEMA_ELEMENTS>
    ? | (FromZodSchema<ZOD_SCHEMA_ELEMENTS, false> extends NumberSchema<
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

/**
 * Convert a `zod` set schema to a DDB-TB schema.
 */
export const fromZodSet = (zodSet: SomeType, { valueType }: $ZodSetDef): SetSchema => {
  // The cast widens the inferred `any` schema back to the union, so that `type` can be inspected
  const elements = fromZodSchema(valueType) as Schema

  const { required, hidden, savedAs } = elements.props

  /**
   * The props a set element forbids, as `SetSchema.check` enforces them. This action does produce
   * them — `z.set(z.string().optional())` converts to an optional element — so they are rejected
   * here rather than later, from another error namespace.
   */
  if (
    (elements.type !== 'string' && elements.type !== 'number') ||
    (required !== undefined && required !== 'atLeastOnce') ||
    (hidden !== undefined && hidden !== false) ||
    savedAs !== undefined ||
    hasDefinedDefault(elements)
  ) {
    throw new DynamoDBToolboxError('fromZodSchema.unsupportedSetValueType', {
      message:
        'Sets can only contain strings, numbers or bigints, with no optionality, default value or renaming',
      payload: { received: valueType }
    })
  }

  /**
   * The guard above has proven both halves of what `SetElementSchema` requires: the element type,
   * and that it carries none of the props a set element forbids.
   */
  return withRefinements(withMeta(set(elements as SetElementSchema), zodSet), zodSet)
}
