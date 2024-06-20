import type { O } from 'ts-toolbelt'

import type { MapAttribute, AnyAttribute, Never } from '~/schema/attributes/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { If, OptionalizeUndefinableProperties } from '~/types/index.js'
import { isObject } from '~/utils/validation/isObject.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import type {
  MatchKeys,
  FormatOptions,
  FormattedValueOptions,
  FormattedValueDefaultOptions,
  FromFormatOptions
} from './types.js'
import { formatAttrRawValue, AttrFormattedValue, MustBeDefined } from './attribute.js'
import { matchProjection } from './utils.js'

export type MapAttrFormattedValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends FormattedValueOptions<ATTRIBUTE> = FormattedValueDefaultOptions,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof ATTRIBUTE['attributes'], string>,
    '.',
    OPTIONS['attributes']
  >
> = MapAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  : // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
  ? never
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | (OPTIONS extends { partial: true }
          ? {
              // Keep only non-hidden attributes
              [KEY in O.SelectKeys<
                // Pick only filtered keys
                O.Pick<ATTRIBUTE['attributes'], MATCHING_KEYS>,
                { hidden: false }
              >]?: AttrFormattedValue<
                ATTRIBUTE['attributes'][KEY],
                {
                  partial: OPTIONS['partial']
                  attributes: OPTIONS extends { attributes: string }
                    ? `.${KEY}` extends OPTIONS['attributes']
                      ? undefined
                      : OPTIONS['attributes'] extends `.${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                      ? Extract<CHILDREN_FILTERED_ATTRIBUTES, Paths<ATTRIBUTE['attributes'][KEY]>>
                      : never
                    : undefined
                }
              >
            }
          : OptionalizeUndefinableProperties<
              {
                // Keep only non-hidden attributes
                [KEY in O.SelectKeys<
                  // Pick only filtered keys
                  O.Pick<ATTRIBUTE['attributes'], MATCHING_KEYS>,
                  { hidden: false }
                >]: AttrFormattedValue<
                  ATTRIBUTE['attributes'][KEY],
                  {
                    partial: OPTIONS['partial']
                    attributes: OPTIONS extends { attributes: string }
                      ? `.${KEY}` extends OPTIONS['attributes']
                        ? undefined
                        : OPTIONS['attributes'] extends `.${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                        ? Extract<CHILDREN_FILTERED_ATTRIBUTES, Paths<ATTRIBUTE['attributes'][KEY]>>
                        : never
                      : undefined
                  }
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
            >)

export const formatMapAttrRawValue = <
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends FormatOptions<ATTRIBUTE>
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): MapAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>> => {
  type Formatted = MapAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>>

  if (!isObject(rawValue)) {
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

  const formattedMap: Record<string, unknown> = {}

  Object.entries(attribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^\\.' + attributeName),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatAttrRawValue(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = formattedAttribute
    }
  })

  return formattedMap as Formatted
}
