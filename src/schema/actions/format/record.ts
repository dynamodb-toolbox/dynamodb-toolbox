import type { RecordAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrFormatter } from './attribute.js'
import { Formatter, type FormatterReturn, type FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

export function* recordAttrFormatter(
  attribute: RecordAttribute,
  rawValue: unknown,
  { attributes, valuePath = [], ...restOptions }: FormatAttrValueOptions<RecordAttribute> = {}
): Generator<
  FormatterYield<RecordAttribute, FormatAttrValueOptions<RecordAttribute>>,
  FormatterReturn<RecordAttribute, FormatAttrValueOptions<RecordAttribute>>
> {
  const { format = true, transform = true } = restOptions

  if (!isObject(rawValue)) {
    const { type } = attribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formatters: [string, Generator<unknown, unknown>][] = []
  for (const [key, element] of Object.entries(rawValue)) {
    if (element === undefined) {
      continue
    }

    // NOTE: If transform is true, `key` is the transformed value which is what we want
    // If not, `key` should already be formatted, which is what we also want
    const elmtValuePath = [...valuePath, key]

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formattedKey = new Formatter(attribute.keys).format(key, {
      transform,
      valuePath: elmtValuePath
    })!
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
      attrFormatter(attribute.elements, element, {
        attributes: childrenAttributes,
        valuePath: elmtValuePath,
        ...restOptions
      })
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
