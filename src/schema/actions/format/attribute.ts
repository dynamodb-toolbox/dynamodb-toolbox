import type { Attribute, RequiredOption } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'

import { formatAnyAttrRawValue } from './any.js'
import { formatAnyOfAttrRawValue } from './anyOf.js'
import { formatListAttrRawValue } from './list.js'
import { formatMapAttrRawValue } from './map.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { formatPrimitiveAttrRawValue } from './primitive.js'
import { formatRecordAttrRawValue } from './record.js'
import { formatSavedSetAttribute } from './set.js'

export const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const formatAttrRawValue = <
  ATTRIBUTE extends Attribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): FormattedValue<Attribute, InferValueOptions<ATTRIBUTE, OPTIONS>> => {
  if (rawValue === undefined) {
    if (isRequired(attribute) && options.partial !== true) {
      const { path } = attribute

      throw new DynamoDBToolboxError('formatter.missingAttribute', {
        message: `Missing required attribute for formatting${
          path !== undefined ? `: '${path}'` : ''
        }.`,
        path,
        payload: {}
      })
    } else {
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return formatAnyAttrRawValue(attribute, rawValue)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return formatPrimitiveAttrRawValue(attribute, rawValue)
    case 'set':
      return formatSavedSetAttribute(attribute, rawValue, options)
    case 'list':
      return formatListAttrRawValue(attribute, rawValue, options)
    case 'map':
      return formatMapAttrRawValue(attribute, rawValue, options)
    case 'record':
      return formatRecordAttrRawValue(attribute, rawValue, options)
    case 'anyOf':
      return formatAnyOfAttrRawValue(attribute, rawValue, options)
  }
}
