import type { AnyOfAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'

type AnyOfAttrRawValueFormatter = <
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: AnyOfAttribute,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<AnyOfAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>>

export const formatAnyOfAttrRawValue: AnyOfAttrRawValueFormatter = <
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: AnyOfAttribute,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
) => {
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
      payload: { received: rawValue }
    })
  }

  return formattedValue
}
