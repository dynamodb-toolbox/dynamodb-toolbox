import { DynamoDBToolboxError } from '~/errors/index.js'
import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  ListAttribute,
  MapAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  RequiredOption,
  SetAttribute
} from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'

import { AnyAttrFormattedValue, formatAnyAttrRawValue } from './any.js'
import { AnyOfAttrFormattedValue, formatAnyOfAttrRawValue } from './anyOf.js'
import { ListAttrFormattedValue, formatListAttrRawValue } from './list.js'
import { MapAttrFormattedValue, formatMapAttrRawValue } from './map.js'
import { PrimitiveAttrFormattedValue, formatPrimitiveAttrRawValue } from './primitive.js'
import { RecordAttrFormattedValue, formatRecordAttrRawValue } from './record.js'
import { SetAttrFormattedValue, formatSavedSetAttribute } from './set.js'
import type {
  FormatOptions,
  FormattedValueDefaultOptions,
  FormattedValueOptions,
  FromFormatOptions
} from './types.js'

export type MustBeDefined<ATTRIBUTE extends Attribute> = ATTRIBUTE extends {
  required: AtLeastOnce | Always
}
  ? true
  : false

export type AttrFormattedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends FormattedValueOptions<ATTRIBUTE> = FormattedValueDefaultOptions
> = ATTRIBUTE extends AnyAttribute
  ? AnyAttrFormattedValue<ATTRIBUTE>
  : ATTRIBUTE extends PrimitiveAttribute
  ? PrimitiveAttrFormattedValue<ATTRIBUTE>
  : ATTRIBUTE extends SetAttribute
  ? SetAttrFormattedValue<ATTRIBUTE, OPTIONS>
  : ATTRIBUTE extends ListAttribute
  ? ListAttrFormattedValue<ATTRIBUTE, OPTIONS>
  : ATTRIBUTE extends Schema | MapAttribute
  ? MapAttrFormattedValue<ATTRIBUTE, OPTIONS>
  : ATTRIBUTE extends RecordAttribute
  ? RecordAttrFormattedValue<ATTRIBUTE, OPTIONS>
  : ATTRIBUTE extends AnyOfAttribute
  ? AnyOfAttrFormattedValue<ATTRIBUTE, OPTIONS>
  : never

export const requiringOptions = new Set<RequiredOption>(['always', 'atLeastOnce'])

export const isRequired = (attribute: Attribute): boolean =>
  requiringOptions.has(attribute.required)

export const formatAttrRawValue = <
  ATTRIBUTE extends Attribute,
  OPTIONS extends FormatOptions<ATTRIBUTE>
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): AttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>> => {
  type Formatted = AttrFormattedValue<ATTRIBUTE, FromFormatOptions<ATTRIBUTE, OPTIONS>>

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
      return undefined as Formatted
    }
  }

  switch (attribute.type) {
    case 'any':
      return formatAnyAttrRawValue(attribute, rawValue) as Formatted
    case 'string':
    case 'binary':
    case 'boolean':
    case 'number':
      return formatPrimitiveAttrRawValue(attribute, rawValue) as Formatted
    case 'set':
      return formatSavedSetAttribute(attribute, rawValue, options) as Formatted
    case 'list':
      return formatListAttrRawValue(attribute, rawValue, options) as Formatted
    case 'map':
      return formatMapAttrRawValue(attribute, rawValue, options) as Formatted
    case 'record':
      return formatRecordAttrRawValue(attribute, rawValue, options) as Formatted
    case 'anyOf':
      return formatAnyOfAttrRawValue(attribute, rawValue, options) as Formatted
  }
}
