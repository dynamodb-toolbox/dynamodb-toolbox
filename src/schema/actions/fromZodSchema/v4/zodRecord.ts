import type { $ZodRecord, $ZodRecordDef, SomeType } from 'zod/v4/core'

import { DynamoDBToolboxError } from '~/errors/index.js'
import type { RecordSchema, RecordSchema_, StringSchema } from '~/index.js'
import { record } from '~/schema/record/index.js'
import type { RecordKeySchema } from '~/schema/record/types.js'
import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import { hasDefinedDefault } from '~/schema/utils/hasDefinedDefault.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` record schema.
 */
export type FromZodRecord<
  ZOD_SCHEMA extends $ZodRecord,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodRecord<infer ZOD_SCHEMA_KEYS, infer ZOD_SCHEMA_VALUES>
    ? FromZodSchema<ZOD_SCHEMA_KEYS, false> extends StringSchema
      ? ROOT extends true
        ? RecordSchema_<
            FromZodSchema<ZOD_SCHEMA_KEYS, false>,
            FromZodSchema<ZOD_SCHEMA_VALUES, false>,
            PROPS
          >
        : RecordSchema<
            FromZodSchema<ZOD_SCHEMA_KEYS, false>,
            FromZodSchema<ZOD_SCHEMA_VALUES, false>,
            PROPS
          >
      : never
    : never

/**
 * Convert a `zod` record schema to a DDB-TB schema.
 */
export const fromZodRecord = (
  zodRecord: SomeType,
  { keyType, valueType }: $ZodRecordDef
): RecordSchema => {
  // The cast widens the inferred `any` schema back to the union, so that `type` can be inspected
  const keys = fromZodSchema(keyType) as Schema

  const { required, hidden, savedAs } = keys.props

  /**
   * The props a record key forbids, as `RecordSchema.check` enforces them. This action does produce
   * them — `z.record(z.string().default('foo'), …)` converts to a defaulted key — so they are
   * rejected here rather than later, from another error namespace.
   */
  if (
    keys.type !== 'string' ||
    (required !== undefined && required !== 'atLeastOnce') ||
    (hidden !== undefined && hidden !== false) ||
    savedAs !== undefined ||
    hasDefinedDefault(keys)
  ) {
    throw new DynamoDBToolboxError('fromZodSchema.unsupportedRecordKeyType', {
      message:
        'Record keys can only be strings or enums, with no optionality, default value or renaming',
      payload: { received: keyType }
    })
  }

  /**
   * The guard above has proven both halves of what `RecordKeySchema` requires: the key type, and
   * that it carries none of the props a record key forbids.
   */
  return withRefinements(
    withMeta(record(keys as RecordKeySchema, fromZodSchema(valueType)), zodRecord),
    zodRecord
  )
}
