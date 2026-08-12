import type { ZodNull } from 'zod'

import type { NullSchema, NullSchema_ } from '~/index.js'
import { nul } from '~/schema/null/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { withMeta } from './utils.js'

export type FromZodNull<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? NullSchema_<PROPS> : NullSchema<PROPS>

export const fromZodNull = (zodSchema: ZodNull): NullSchema => withMeta(nul(), zodSchema)
