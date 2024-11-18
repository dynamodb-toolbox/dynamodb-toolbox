import type { ListAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { isArray } from '~/utils/validation/isArray.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { matchProjection } from './utils.js'

export function* listAttrFormatter(
  attribute: ListAttribute,
  rawValue: unknown,
  { attributes, valuePath = [], ...restOptions }: FormatAttrValueOptions<ListAttribute> = {}
): Generator<
  FormatterYield<ListAttribute, FormatAttrValueOptions<ListAttribute>>,
  FormatterReturn<ListAttribute, FormatAttrValueOptions<ListAttribute>>
> {
  const { format = true, transform = true } = restOptions

  if (!isArray(rawValue)) {
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

  // We don't need isProjected:
  // - Either whole list is projected and we already know => projectedAttributes undefined
  // - Either some elements are projected => childrenAttributes undefined
  // - Either projection is deep => childrenAttributes defined
  const { childrenAttributes } = matchProjection(/\[\d+\]/, attributes)

  const formatters = rawValue.map((element, index) =>
    attrFormatter(attribute.elements, element, {
      attributes: childrenAttributes,
      valuePath: [...valuePath, index],
      ...restOptions
    })
  )

  if (transform) {
    const transformedValue = formatters.map(formatter => formatter.next().value)
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = formatters.map(formatter => formatter.next().value)
  return formattedValue
}
