import type { Attribute, RequiredOption } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'

import { anyAttrFormatter } from './any.js'
import { anyOfAttrFormatter } from './anyOf.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import { listAttrFormatter } from './list.js'
import { mapAttrFormatter } from './map.js'
import type { FormatAttrValueOptions } from './options.js'
import { primitiveAttrFormatter } from './primitive.js'
import { recordAttrFormatter } from './record.js'
import { setAttrFormatter } from './set.js'

export const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export function* attrFormatter<
  ATTRIBUTE extends Attribute,
  OPTIONS extends FormatAttrValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  FormatterYield<Attribute, FormatAttrValueOptions<Attribute>>,
  FormatterReturn<Attribute, FormatAttrValueOptions<Attribute>>
> {
  const { format = true, transform = true, valuePath } = options

  if (rawValue === undefined) {
    if (isRequired(attribute) && options.partial !== true) {
      const path = formatValuePath(valuePath)

      throw new DynamoDBToolboxError('formatter.missingAttribute', {
        message: `Missing required attribute for formatting${
          path !== undefined ? `: '${path}'` : ''
        }.`,
        path,
        payload: {}
      })
    }

    if (transform) {
      if (format) {
        yield undefined
      } else {
        return undefined
      }
    }

    return undefined
  }

  switch (attribute.type) {
    case 'any':
      return yield* anyAttrFormatter(attribute, rawValue, options)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return yield* primitiveAttrFormatter(attribute, rawValue, {
        ...options,
        attributes: undefined
      })
    case 'set':
      return yield* setAttrFormatter(attribute, rawValue, options)
    case 'list':
      return yield* listAttrFormatter(attribute, rawValue, options)
    case 'map':
      return yield* mapAttrFormatter(attribute, rawValue, options)
    case 'record':
      return yield* recordAttrFormatter(attribute, rawValue, options)
    case 'anyOf':
      return yield* anyOfAttrFormatter(attribute, rawValue, options)
  }
}
