import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { RecordSchema } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { Formatter, type FormatterReturn, type FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'
import { matchMapProjection } from './utils.js'

export function* recordSchemaFormatter(
  schema: RecordSchema,
  rawValue: unknown,
  { attributes, valuePath, ...restOptions }: FormatAttrValueOptions<RecordSchema> = {}
): Generator<
  FormatterYield<RecordSchema, FormatAttrValueOptions<RecordSchema>>,
  FormatterReturn<RecordSchema, FormatAttrValueOptions<RecordSchema>>
> {
  const { format = true, transform = true, partial = false } = restOptions

  if (!isObject(rawValue)) {
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

  const formatters: [string, Generator<unknown, unknown>][] = []
  const missingEnumKeys = new Set(schema.keys.props.enum)

  for (const [key, element] of Object.entries(rawValue)) {
    if (element === undefined) {
      continue
    }

    // NOTE: If transform is true, `key` is the transformed value which is what we want
    // If not, `key` should already be formatted, which is what we also want
    const elmtValuePath = [...(valuePath ?? []), key]

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formattedKey = new Formatter(schema.keys).format(key, {
      transform,
      valuePath: elmtValuePath
    })!
    missingEnumKeys.delete(formattedKey)

    const { isProjected, childrenAttributes } = matchMapProjection(formattedKey, attributes)
    if (!isProjected) {
      continue
    }

    formatters.push([
      formattedKey,
      schemaFormatter(schema.elements, element, {
        attributes: childrenAttributes,
        valuePath: elmtValuePath,
        ...restOptions
      })
    ])
  }

  if (!schema.props.partial && !partial) {
    for (const missingKey of missingEnumKeys) {
      const { isProjected, childrenAttributes } = matchMapProjection(missingKey, attributes)
      if (!isProjected) {
        continue
      }

      const elmtValuePath =
        transform && schema.keys.props.transform !== undefined
          ? [
              ...(valuePath ?? []),
              (schema.keys.props.transform as Transformer<string>).encode(missingKey)
            ]
          : [...(valuePath ?? []), missingKey]

      formatters.push([
        missingKey,
        schemaFormatter(schema.elements, undefined, {
          attributes: childrenAttributes,
          valuePath: elmtValuePath,
          ...restOptions
        })
      ])
    }
  }

  if (transform) {
    const transformedValue = Object.fromEntries(
      formatters
        .map(([key, formatter]) => [key, formatter.next().value])
        .filter(([, element]) => element !== undefined)
    )

    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = Object.fromEntries(
    formatters
      .map(([key, formatter]) => [key, formatter.next().value])
      .filter(([, element]) => element !== undefined)
  )
  return formattedValue
}
