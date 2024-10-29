import type { AnyAttribute } from '~/attributes/any/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* anyAttrFormatter<OPTIONS extends FormatValueOptions<AnyAttribute> = {}>(
  _: AnyAttribute,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<AnyAttribute>, FormatterReturn<AnyAttribute>> {
  const { transform = true } = options

  let transformedValue = undefined
  if (transform) {
    transformedValue = cloneDeep(rawValue)
    yield transformedValue
  }

  const formattedValue = transformedValue ?? cloneDeep(rawValue)
  return formattedValue
}
