import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { SetSchema } from '~/schema/index.js'
import { isSet } from '~/utils/validation/isSet.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'

export function* setSchemaFormatter(
  schema: SetSchema,
  rawValue: unknown,
  { valuePath = [], ...options }: FormatAttrValueOptions<SetSchema> = {}
): Generator<
  FormatterYield<SetSchema, FormatAttrValueOptions<SetSchema>>,
  FormatterReturn<SetSchema, FormatAttrValueOptions<SetSchema>>
> {
  const { format = true, transform = true } = options

  if (!isSet(rawValue)) {
    const { type } = schema
    const path = formatArrayPath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  // TODO: Remove this cast
  const formatters: Generator<any, any>[] = [...rawValue.values()].map((value, index) =>
    schemaFormatter(schema.elements, value, {
      ...options,
      valuePath: [...valuePath, index],
      attributes: undefined
    })
  )

  if (transform) {
    const transformedValue = new Set(
      formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
    )
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = new Set(
    formatters.map(formatter => formatter.next().value).filter(value => value !== undefined)
  )
  return formattedValue
}
