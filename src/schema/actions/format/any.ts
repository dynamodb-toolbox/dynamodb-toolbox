import type { AnySchema } from '~/attributes/any/index.js'
import type { Transformer } from '~/transformers/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* anySchemaFormatter(
  schema: AnySchema,
  rawValue: unknown,
  options: FormatAttrValueOptions<AnySchema> = {}
): Generator<
  FormatterYield<AnySchema, FormatAttrValueOptions<AnySchema>>,
  FormatterReturn<AnySchema, FormatAttrValueOptions<AnySchema>>
> {
  const { format = true, transform = true } = options

  let transformedValue = undefined
  if (transform) {
    const transformer = schema.props.transform as Transformer
    transformedValue =
      transformer !== undefined ? transformer.decode(rawValue) : cloneDeep(rawValue)

    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = transformedValue ?? cloneDeep(rawValue)
  return formattedValue
}
