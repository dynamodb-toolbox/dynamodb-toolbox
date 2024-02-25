import type { Attribute, AnyOfAttribute } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'
import type { If } from 'v1/types'

import type { FormatOptions, FormattedValueOptions, UnpackFormatOptions } from './types'
import { formatAttrRawValue, AttrFormattedValue, MustBeDefined } from './attribute'

export type AnyOfAttrFormattedValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  : If<MustBeDefined<ATTRIBUTE>, never, undefined> | AnyOfAttrFormattedValueRec<ATTRIBUTE, OPTIONS>

type AnyOfAttrFormattedValueRec<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormattedValueOptions,
  ELEMENTS extends Attribute[] = ATTRIBUTE['elements'],
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrFormattedValueRec<
          ATTRIBUTE,
          OPTIONS,
          ELEMENTS_TAIL,
          RESULTS | AttrFormattedValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
  ? unknown
  : RESULTS

export const formatAnyOfAttrRawValue = <
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormatOptions = FormatOptions
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): AnyOfAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>> => {
  let formattedValue: AttrFormattedValue<Attribute> | undefined = undefined

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

  return formattedValue as AnyOfAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>>
}
