import type { StringSchema, StringSchema_ } from '~/index.js'
import { string } from '~/schema/string/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

export type FromZodString<
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> = ROOT extends true ? StringSchema_<PROPS> : StringSchema<PROPS>

export const fromZodString = (): StringSchema => string()
