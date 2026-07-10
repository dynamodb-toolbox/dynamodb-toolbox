import type { BooleanSchema, BooleanSchema_ } from '~/index.js'
import { boolean } from '~/schema/boolean/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

export type FromZodBoolean<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? BooleanSchema_<PROPS> : BooleanSchema<PROPS>

export const fromZodBoolean = (): BooleanSchema => boolean()
