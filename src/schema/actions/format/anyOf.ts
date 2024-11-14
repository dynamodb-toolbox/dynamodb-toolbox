import type { AnyOfAttribute, Attribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* anyOfAttrFormatter(
  attribute: AnyOfAttribute,
  rawValue: unknown,
  options: FormatValueOptions<AnyOfAttribute> = {}
): Generator<
  FormatterYield<AnyOfAttribute, FormatValueOptions<AnyOfAttribute>>,
  FormatterReturn<AnyOfAttribute, FormatValueOptions<AnyOfAttribute>>
> {
  const { format = true, transform = true } = options

  let formatter: Generator<unknown, unknown> | undefined = undefined
  let _transformedValue = undefined
  let _formattedValue = undefined

  for (const element of attribute.elements) {
    try {
      formatter = attrFormatter(element, rawValue, options as FormatValueOptions<Attribute>)
      if (transform) {
        _transformedValue = formatter.next().value
      }
      _formattedValue = formatter.next().value
      break
    } catch (error) {
      continue
    }
  }

  const transformedValue = _transformedValue
  const formattedValue = _formattedValue
  if (formatter === undefined || formattedValue === undefined) {
    const { path, savedAs } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting. Attribute does not match any of the possible sub-types${
        path !== undefined ? `: '${path}'` : ''
      }${savedAs !== undefined ? ` (saved as '${savedAs}')` : ''}.`,
      path,
      payload: { received: rawValue }
    })
  }

  if (transform) {
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  return formattedValue
}
