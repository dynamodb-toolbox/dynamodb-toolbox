import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { TupleSchema } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'
import { matchTupleProjection } from './utils.js'

export function* tupleSchemaFormatter(
  schema: TupleSchema,
  rawValue: unknown,
  { attributes, valuePath, ...restOptions }: FormatAttrValueOptions<TupleSchema> = {}
): Generator<
  FormatterYield<TupleSchema, FormatAttrValueOptions<TupleSchema>>,
  FormatterReturn<TupleSchema, FormatAttrValueOptions<TupleSchema>>
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

  const formatters: (Generator<unknown, unknown> | undefined)[] = []

  let projectedIndex = 0
  schema.elements.forEach((element, elementIndex) => {
    const { isProjected, childrenAttributes } = matchTupleProjection(elementIndex, attributes)

    if (isProjected) {
      formatters.push(
        isProjected
          ? schemaFormatter(element, rawValue[projectedIndex], {
              attributes: childrenAttributes,
              valuePath: [...(valuePath ?? []), elementIndex],
              ...restOptions,
              ...(!isProjected ? { defined: false } : {})
            })
          : undefined
      )
      projectedIndex++
    }
  })

  if (transform) {
    const transformedValue = formatters.map(formatter => formatter?.next().value)
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = formatters.map(formatter => formatter?.next().value)
  return formattedValue
}
