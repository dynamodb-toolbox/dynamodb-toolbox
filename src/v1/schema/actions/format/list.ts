import type { ListAttribute } from 'v1/schema'
import type { If } from 'v1/types'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions, FormattedValueOptions, UnpackFormatOptions } from './types'
import { formatAttrRawValue, AttrFormattedValue, MustBeDefined } from './attribute'
import { matchProjection } from './utils'

export type ListAttrFormattedValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions,
  FORMATTED_ATTRIBUTE = ListAttribute extends ATTRIBUTE
    ? unknown
    : AttrFormattedValue<
        ATTRIBUTE['elements'],
        {
          attributes: OPTIONS extends { attributes: string }
            ? OPTIONS['attributes'] extends `[${number}]`
              ? undefined
              : OPTIONS['attributes'] extends `[${number}]${infer CHILDREN_FILTERED_ATTRIBUTES}`
              ? CHILDREN_FILTERED_ATTRIBUTES
              : never
            : undefined
          partial: OPTIONS['partial']
        }
      >
  // Possible in case of anyOf subSchema
> = [FORMATTED_ATTRIBUTE] extends [never]
  ? never
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | FORMATTED_ATTRIBUTE[]

export const formatListAttrRawValue = <
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormatOptions = FormatOptions
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): ListAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>> => {
  if (!isArray(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: {
        received: rawValue,
        expected: type
      }
    })
  }

  // We don't need isProjected:
  // - Either whole list is projected and we already know => projectedAttributes undefined
  // - Either some elements are projected => childrenAttributes undefined
  // - Either projection is nested => childrenAttributes defined
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

  return formattedValues as ListAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>>
}
