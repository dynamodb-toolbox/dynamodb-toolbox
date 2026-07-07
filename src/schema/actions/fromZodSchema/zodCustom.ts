import type { ZodType } from 'zod'

import type { AnySchema, AnySchema_ } from '~/index.js'
import { any } from '~/schema/any/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

export type FromZodCustom<
  ZOD_SCHEMA extends ZodType,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true
  ? AnySchema_<
      unknown extends ZOD_SCHEMA['_output']
        ? PROPS
        : Overwrite<PROPS, { castAs: ZOD_SCHEMA['_output'] }>
    >
  : AnySchema<
      unknown extends ZOD_SCHEMA['_output']
        ? PROPS
        : Overwrite<PROPS, { castAs: ZOD_SCHEMA['_output'] }>
    >

export const fromZodCustom = (): AnySchema => any()
