import type { AnyAttribute } from '~/attributes/any/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* anyAttrFormatter(
  _: AnyAttribute,
  rawValue: unknown,
  options: FormatAttrValueOptions<AnyAttribute> = {}
): Generator<
  FormatterYield<AnyAttribute, FormatAttrValueOptions<AnyAttribute>>,
  FormatterReturn<AnyAttribute, FormatAttrValueOptions<AnyAttribute>>
> {
  const { format = true, transform = true } = options

  let transformedValue = undefined
  if (transform) {
    transformedValue = cloneDeep(rawValue)

    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = transformedValue ?? cloneDeep(rawValue)
  return formattedValue
}
