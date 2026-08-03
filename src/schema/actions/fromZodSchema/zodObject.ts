import type { UnknownKeysParam, ZodObject, ZodRawShape } from 'zod'

import type { MapSchema, MapSchema_ } from '~/index.js'
import { map } from '~/schema/map/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodObjectAny = ZodObject<ZodRawShape, UnknownKeysParam>

export type FromZodObject<
  ZOD_SCHEMA extends ZodObjectAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodObject<infer ZOD_SCHEMA_SHAPE, infer ZOD_UNKNOWN_KEYS>
    ? ROOT extends true
      ? MapSchema_<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          ZOD_UNKNOWN_KEYS extends 'strict' ? Overwrite<PROPS, { strict: true }> : PROPS
        >
      : MapSchema<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          ZOD_UNKNOWN_KEYS extends 'strict' ? Overwrite<PROPS, { strict: true }> : PROPS
        >
    : never

export const fromZodObject = (zodObject: ZodObjectAny): MapSchema => {
  const attributes = Object.fromEntries(
    Object.entries(zodObject.shape).map(([key, value]) => [key, fromZodSchema(value)])
  )

  return zodObject._def.unknownKeys === 'strict'
    ? map(attributes, { strict: true })
    : map(attributes)
}
