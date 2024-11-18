import type { SetAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { isSet } from '~/utils/validation/isSet.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* setAttrFormatter(
  attribute: SetAttribute,
  rawValue: unknown,
  { valuePath = [], ...options }: FormatAttrValueOptions<SetAttribute> = {}
): Generator<
  FormatterYield<SetAttribute, FormatAttrValueOptions<SetAttribute>>,
  FormatterReturn<SetAttribute, FormatAttrValueOptions<SetAttribute>>
> {
  const { format = true, transform = true } = options

  if (!isSet(rawValue)) {
    const { type } = attribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  // TODO: Remove this cast
  const formatters: Generator<any, any>[] = [...rawValue.values()].map((value, index) =>
    attrFormatter(attribute.elements, value, {
      ...options,
      valuePath: [...valuePath, index],
      attributes: undefined
    })
  )

  if (transform) {
    const transformedValue = new Set(
      formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
    )
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = new Set(
    formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
  )
  return formattedValue
}
