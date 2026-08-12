import type { ZodBigInt } from 'zod'

import type { NumberSchema, NumberSchema_ } from '~/index.js'
import { number } from '~/schema/number/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta } from './utils.js'

export type FromZodBigInt<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true
  ? NumberSchema_<Overwrite<PROPS, { big: true }>>
  : NumberSchema<Overwrite<PROPS, { big: true }>>

export const fromZodBigInt = (zodSchema: ZodBigInt): NumberSchema =>
  withMeta(number({ big: true }), zodSchema)
