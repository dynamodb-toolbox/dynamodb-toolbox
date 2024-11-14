import type { RecordAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrFormatter } from './attribute.js'
import { Formatter, type FormatterReturn, type FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

export function* recordAttrFormatter(
  attribute: RecordAttribute,
  rawValue: unknown,
  { attributes, ...restOptions }: FormatValueOptions<RecordAttribute> = {}
): Generator<
  FormatterYield<RecordAttribute, FormatValueOptions<RecordAttribute>>,
  FormatterReturn<RecordAttribute, FormatValueOptions<RecordAttribute>>
> {
  const { format = true, transform = true } = restOptions

  if (!isObject(rawValue)) {
    const { path, type, savedAs } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }${savedAs !== undefined ? ` (saved as '${savedAs}')` : ''}. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formatters: [string, Generator<unknown, unknown>][] = []
  for (const [key, element] of Object.entries(rawValue)) {
    if (element === undefined) {
      continue
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formattedKey = new Formatter(attribute.keys).format(key, { transform })!
    const sanitizedKey = sanitize(formattedKey)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^\\.${sanitizedKey}|^\\['${sanitizedKey}']`),
      attributes
    )

    if (!isProjected) {
      continue
    }

    formatters.push([
      formattedKey,
      attrFormatter(attribute.elements, element, { attributes: childrenAttributes, ...restOptions })
    ])
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
