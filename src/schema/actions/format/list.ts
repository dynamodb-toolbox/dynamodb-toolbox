import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { ListSchema } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'
import { matchProjection } from './utils.js'

export function* listSchemaFormatter(
  schema: ListSchema,
  rawValue: unknown,
  { attributes, valuePath, ...restOptions }: FormatAttrValueOptions<ListSchema> = {}
): Generator<
  FormatterYield<ListSchema, FormatAttrValueOptions<ListSchema>>,
  FormatterReturn<ListSchema, FormatAttrValueOptions<ListSchema>>
> {
  const { format = true, transform = true } = restOptions

  if (!isArray(rawValue)) {
    const { type } = schema
    const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  // We don't need isProjected:
  // - Either whole list is projected and we already know => projectedAttributes undefined
  // - Either some elements are projected => childrenAttributes undefined
  // - Either projection is deep => childrenAttributes defined
  const { childrenAttributes } = matchProjection(/\[\d+\]/, attributes)

  const formatters = rawValue.map((element, index) =>
    schemaFormatter(schema.elements, element, {
      attributes: childrenAttributes,
      valuePath: [...(valuePath ?? []), index],
      ...restOptions
    })
  )

  if (transform) {
    const transformedValue = formatters.map(formatter => formatter.next().value)
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = formatters.map(formatter => formatter.next().value)
  return formattedValue
}
