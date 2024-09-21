import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  ListAttribute,
  MapAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  RequiredOption,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'

import { formatAnyAttrRawValue } from './any.js'
import type { AnyAttrFormattedValue } from './any.js'
import { formatAnyOfAttrRawValue } from './anyOf.js'
import type { AnyOfAttrFormattedValue } from './anyOf.js'
import { formatListAttrRawValue } from './list.js'
import type { ListAttrFormattedValue } from './list.js'
import { formatMapAttrRawValue } from './map.js'
import type { MapAttrFormattedValue } from './map.js'
import { formatPrimitiveAttrRawValue } from './primitive.js'
import type { PrimitiveAttrV2FormattedValue } from './primitive.js'
import { formatRecordAttrRawValue } from './record.js'
import type { RecordAttrFormattedValue } from './record.js'
import { formatSavedSetAttribute } from './set.js'
import type { SetAttrFormattedValue } from './set.js'
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
  : ATTRIBUTE extends PrimitiveAttribute | NumberAttribute | StringAttribute
    ? PrimitiveAttrV2FormattedValue<ATTRIBUTE>
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
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
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
