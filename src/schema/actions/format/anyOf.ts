import type { AnyOfSchema, AttrSchema } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* anyOfSchemaFormatter(
  schema: AnyOfSchema,
  rawValue: unknown,
  options: FormatAttrValueOptions<AnyOfSchema> = {}
): Generator<
  FormatterYield<AnyOfSchema, FormatAttrValueOptions<AnyOfSchema>>,
  FormatterReturn<AnyOfSchema, FormatAttrValueOptions<AnyOfSchema>>
> {
  const { format = true, transform = true, valuePath } = options

  let formatter: Generator<unknown, unknown> | undefined = undefined
  let _transformedValue = undefined
  let _formattedValue = undefined

  for (const element of schema.elements) {
    try {
      formatter = attrFormatter(element, rawValue, options as FormatAttrValueOptions<AttrSchema>)
      if (transform) {
        _transformedValue = formatter.next().value
      }
      if (format) {
        _formattedValue = formatter.next().value
      }
      break
    } catch (error) {
      continue
    }
  }

  const transformedValue = _transformedValue
  const formattedValue = _formattedValue
  if ((transform && transformedValue === undefined) || (format && formattedValue === undefined)) {
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting. Attribute does not match any of the possible sub-types${
        path !== undefined ? `: '${path}'` : ''
      }.`,
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
