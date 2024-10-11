import type { SetAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { isSet } from '~/utils/validation/isSet.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'

type SetAttrRawValueFormatter = <
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<SetAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>>

export const formatSavedSetAttribute: SetAttrRawValueFormatter = <
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
) => {
  if (!isSet(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path: path,
      payload: { received: rawValue, expected: type }
    })
  }

  const parsedPutItemInput: FormattedValue<
    SetAttribute,
    InferValueOptions<ATTRIBUTE, OPTIONS>
  > = new Set()

  for (const savedElement of rawValue) {
    const parsedElement = formatAttrRawValue(attribute.elements, savedElement, {
      ...options,
      attributes: undefined
    }) as FormattedValue<SetAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>> extends Set<
      infer ELEMENTS
    >
      ? ELEMENTS
      : never

    if (parsedElement !== undefined) {
      parsedPutItemInput.add(parsedElement)
    }
  }

  return parsedPutItemInput
}
