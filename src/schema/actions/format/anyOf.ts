import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { $discriminators } from '~/schema/anyOf/constants.js'
import type { AnyOfSchema, Schema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'
import { isString } from '~/utils/validation/isString.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'

export function* anyOfSchemaFormatter(
  schema: AnyOfSchema,
  rawValue: unknown,
  options: FormatAttrValueOptions<AnyOfSchema> = {}
): Generator<
  FormatterYield<AnyOfSchema, FormatAttrValueOptions<AnyOfSchema>>,
  FormatterReturn<AnyOfSchema, FormatAttrValueOptions<AnyOfSchema>>
> {
  const { discriminator } = schema.props
  const { format = true, transform = true, valuePath } = options

  let formatter: Generator<unknown, unknown> | undefined = undefined
  let _transformedValue = undefined
  let _formattedValue = undefined

  const discriminatorSavedAs =
    discriminator && transform ? schema[$discriminators][discriminator] : discriminator

  if (
    discriminatorSavedAs !== undefined &&
    isObject(rawValue) &&
    discriminatorSavedAs in rawValue
  ) {
    const discriminatorValue = rawValue[discriminatorSavedAs]
    const matchingElement = isString(discriminatorValue)
      ? schema.match(discriminatorValue)
      : undefined

    if (matchingElement !== undefined) {
      formatter = schemaFormatter(
        matchingElement,
        rawValue,
        options as FormatAttrValueOptions<Schema>
      )
      if (transform) {
        _transformedValue = formatter.next().value
      }
      if (format) {
        _formattedValue = formatter.next().value
      }
    }
  }

  if (formatter === undefined) {
    for (const element of schema.elements) {
      try {
        formatter = schemaFormatter(element, rawValue, options as FormatAttrValueOptions<Schema>)
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
