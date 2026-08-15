import type { ZodNumber } from 'zod'

import type { NumberSchema, NumberSchema_ } from '~/index.js'
import { number } from '~/schema/number/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta } from './utils.js'

export type FromZodNumber<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? NumberSchema_<PROPS> : NumberSchema<PROPS>

export const fromZodNumber = (zodSchema: ZodNumber): NumberSchema => withMeta(number(), zodSchema)
