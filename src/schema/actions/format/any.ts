import type { AnyAttribute } from '~/attributes/any/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* anyAttrFormatter(
  _: AnyAttribute,
  rawValue: unknown,
  options: FormatValueOptions<AnyAttribute> = {}
): Generator<
  FormatterYield<AnyAttribute, FormatValueOptions<AnyAttribute>>,
  FormatterReturn<AnyAttribute, FormatValueOptions<AnyAttribute>>
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
