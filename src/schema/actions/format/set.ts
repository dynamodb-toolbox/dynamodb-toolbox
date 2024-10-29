import type { SetAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { isSet } from '~/utils/validation/isSet.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* setAttrFormatter<OPTIONS extends FormatValueOptions<SetAttribute> = {}>(
  attribute: SetAttribute,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<SetAttribute, OPTIONS>, FormatterReturn<SetAttribute, OPTIONS>> {
  const { transform = true } = options

  if (!isSet(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path: path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formatters: Generator<any, any>[] = [...rawValue.values()].map(value =>
    attrFormatter(attribute.elements, value, options)
  )

  if (transform) {
    const transformedValue = new Set(
      formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
    )
    yield transformedValue
  }

  const formattedValue = new Set(
    formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
  )
  return formattedValue
}
