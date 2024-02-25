import type { SetAttribute } from 'v1/schema'
import type { If } from 'v1/types'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { AttrFormattedValue } from './attribute'
import type { FormatOptions, FormattedValueOptions, UnpackFormatOptions } from './types'
import { formatAttrRawValue, MustBeDefined } from './attribute'

export type SetAttrFormattedValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions
> = SetAttribute extends ATTRIBUTE
  ? Set<AttrFormattedValue<SetAttribute['elements']>>
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | Set<
          AttrFormattedValue<
            ATTRIBUTE['elements'],
            { attributes: undefined; partial: OPTIONS['partial'] }
          >
        >

export const formatSavedSetAttribute = <
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends FormatOptions = FormatOptions
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): SetAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>> => {
  if (!isSet(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path: path,
      payload: {
        received: rawValue,
        expected: type
      }
    })
  }

  const parsedPutItemInput: SetAttrFormattedValue<SetAttribute> = new Set()

  for (const savedElement of rawValue) {
    const parsedElement = formatAttrRawValue<SetAttribute['elements']>(
      attribute.elements,
      savedElement,
      { ...options, attributes: undefined }
    )

    if (parsedElement !== undefined) {
      parsedPutItemInput.add(parsedElement)
    }
  }

  return parsedPutItemInput as SetAttrFormattedValue<ATTRIBUTE, UnpackFormatOptions<OPTIONS>>
}
