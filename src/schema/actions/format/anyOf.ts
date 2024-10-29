import type { AnyOfAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* anyOfAttrFormatter<OPTIONS extends FormatValueOptions<AnyOfAttribute> = {}>(
  attribute: AnyOfAttribute,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<AnyOfAttribute, OPTIONS>, FormatterReturn<AnyOfAttribute, OPTIONS>> {
  const { transform = true } = options

  let formatter: Generator<any, any> | undefined = undefined
  let _transformedValue = undefined
  let _formattedValue = undefined

  for (const element of attribute.elements) {
    try {
      formatter = attrFormatter(element, rawValue, options)
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
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting. Attribute does not match any of the possible sub-types${
        path !== undefined ? `: '${path}'` : ''
      }.`,
      path,
      payload: { received: rawValue }
    })
  }

  if (transform) {
    yield transformedValue
  }

  return formattedValue
}
