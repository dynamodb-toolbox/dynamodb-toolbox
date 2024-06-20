import type { If } from '~/types/index.js'
import type { ListAttribute } from '~/schema/attributes/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import type {
  FormatOptions,
  FormattedValueOptions,
  FormattedValueDefaultOptions,
  FromFormatOptions
} from './types.js'
import { formatAttrRawValue, AttrFormattedValue, MustBeDefined } from './attribute.js'
import { matchProjection } from './utils.js'

export type ListAttrFormattedValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormattedValueOptions<ATTRIBUTE> = FormattedValueDefaultOptions,
  FORMATTED_ELEMENTS = ListAttribute extends ATTRIBUTE
    ? unknown
    : AttrFormattedValue<
        ATTRIBUTE['elements'],
        {
          attributes: OPTIONS extends { attributes: string }
            ? OPTIONS['attributes'] extends `[${number}]`
              ? undefined
              : OPTIONS['attributes'] extends `[${number}]${infer CHILDREN_FILTERED_ATTRIBUTES}`
              ? Extract<CHILDREN_FILTERED_ATTRIBUTES, Paths<ATTRIBUTE['elements']>>
              : never
            : undefined
          partial: OPTIONS['partial']
        }
      >
  // Possible in case of anyOf subSchema
> = [FORMATTED_ELEMENTS] extends [never]
  ? never
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | FORMATTED_ELEMENTS[]

export const formatListAttrRawValue = <
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormatOptions<ATTRIBUTE>
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): ListAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>> => {
  type Formatted = ListAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>>

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

  return formattedValues as Formatted
}
