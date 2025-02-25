import type { AnyAttribute } from '~/attributes/any/index.js'
import type { Transformer } from '~/transformers/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* anyAttrFormatter(
  attribute: AnyAttribute,
  rawValue: unknown,
  options: FormatAttrValueOptions<AnyAttribute> = {}
): Generator<
  FormatterYield<AnyAttribute, FormatAttrValueOptions<AnyAttribute>>,
  FormatterReturn<AnyAttribute, FormatAttrValueOptions<AnyAttribute>>
> {
  const { format = true, transform = true } = options

  let transformedValue = undefined
  if (transform) {
    const transformer = attribute.state.transform as Transformer
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
