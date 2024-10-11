import type { ListAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { matchProjection } from './utils.js'

type ListAttrRawValueFormatter = <
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<ListAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>>

export const formatListAttrRawValue: ListAttrRawValueFormatter = <
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
) => {
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

  const formattedValues: unknown[] = []
  for (const rawElement of rawValue) {
    const formattedElement = formatAttrRawValue(attribute.elements, rawElement, {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedElement !== undefined) {
      formattedValues.push(formattedElement)
    }
  }

  return formattedValues
}
