import type { RecordAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { formatPrimitiveAttrRawValue } from './primitive.js'
import { sanitize } from './utils.js'
import { matchProjection } from './utils.js'

type RecordAttrRawValueFormatter = <
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<RecordAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>>

export const formatRecordAttrRawValue: RecordAttrRawValueFormatter = <
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
) => {
  if (!isObject(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formattedRecord: Record<string, unknown> = {}

  Object.entries(rawValue).forEach(([key, element]) => {
    const parsedKey = formatPrimitiveAttrRawValue(attribute.keys, key) as string

    const sanitizedKey = sanitize(parsedKey)
    // We don't need isProjected: We used the saved value key so we know it is
    const { childrenAttributes } = matchProjection(
      new RegExp(`^\\.${sanitizedKey}|^\\['${sanitizedKey}']`),
      attributes
    )

    const formattedAttribute = formatAttrRawValue(attribute.elements, element, {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedRecord[parsedKey] = formattedAttribute
    }
  })

  return formattedRecord
}
