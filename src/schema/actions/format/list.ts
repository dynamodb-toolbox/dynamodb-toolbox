import type { ListAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'
import { matchProjection } from './utils.js'

export function* listAttrFormatter<OPTIONS extends FormatValueOptions<ListAttribute> = {}>(
  attribute: ListAttribute,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<ListAttribute, OPTIONS>, FormatterReturn<ListAttribute, OPTIONS>> {
  const { transform = true } = restOptions

  if (!isArray(rawValue)) {
    const { path, type } = attribute

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

  const formatters: Generator<any, any>[] = rawValue.map(element =>
    attrFormatter(attribute.elements, element, { attributes: childrenAttributes, ...restOptions })
  )

  if (transform) {
    const transformedValue = formatters.map(formatter => formatter.next().value)
    yield transformedValue
  }

  const formattedValue = formatters.map(formatter => formatter.next().value)
  return formattedValue
}
