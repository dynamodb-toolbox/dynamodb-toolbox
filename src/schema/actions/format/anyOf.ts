import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { AnyOfAttribute, Attribute } from '~/schema/attributes/index.js'
import type { If } from '~/types/index.js'

import { formatAttrRawValue } from './attribute.js'
import type { AttrFormattedValue, MustBeDefined } from './attribute.js'
import type {
  FormatOptions,
  FormattedValueDefaultOptions,
  FormattedValueOptions,
  FromFormatOptions
} from './types.js'

export type AnyOfAttrFormattedValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormattedValueOptions<ATTRIBUTE> = FormattedValueDefaultOptions
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | AnyOfAttrFormattedValueRec<ATTRIBUTE, OPTIONS>

type AnyOfAttrFormattedValueRec<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormattedValueOptions<ATTRIBUTE>,
  ELEMENTS extends Attribute[] = ATTRIBUTE['elements'],
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrFormattedValueRec<
          ATTRIBUTE,
          OPTIONS,
          ELEMENTS_TAIL,
          | RESULTS
          | AttrFormattedValue<
              ELEMENTS_HEAD,
              {
                attributes: OPTIONS extends { attributes: string }
                  ? Extract<OPTIONS['attributes'], Paths<ELEMENTS_HEAD>>
                  : undefined
                partial: OPTIONS['partial']
              }
            >
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS

export const formatAnyOfAttrRawValue = <
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormatOptions<ATTRIBUTE>
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): AnyOfAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>> => {
  type Formatted = AnyOfAttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>>

  let formattedValue: unknown = undefined

  for (const element of attribute.elements) {
    try {
      formattedValue = formatAttrRawValue(element, rawValue, options)
      break
    } catch (error) {
      continue
    }
  }

  if (formattedValue === undefined) {
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting. Attribute does not match any of the possible sub-types${
        path !== undefined ? `: '${path}'` : ''
      }.`,
      path,
      payload: {
        received: rawValue
      }
    })
  }

  return formattedValue as Formatted
}
