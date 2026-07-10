import type { ZodObject, ZodRawShape } from 'zod'

import type { MapSchema, MapSchema_ } from '~/index.js'
import { map } from '~/schema/map/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodObjectAny = ZodObject<ZodRawShape>

export type FromZodObject<
  ZOD_SCHEMA extends ZodObjectAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodObject<infer ZOD_SCHEMA_SHAPE>
    ? ROOT extends true
      ? MapSchema_<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          PROPS
        >
      : MapSchema<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          PROPS
        >
    : never

export const fromZodObject = (zodObject: ZodObjectAny): MapSchema =>
  map(
    Object.fromEntries(
      Object.entries(zodObject.shape).map(([key, value]) => [key, fromZodSchema(value)])
    )
  )
