import { cloneDeep } from 'lodash'

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
  SetAttribute
} from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

import { anyAttrParser } from './any.js'
import type { AnyAttrParsedValue } from './any.js'
import { anyOfAttributeParser } from './anyOf.js'
import type { AnyOfAttrParsedValue } from './anyOf.js'
import { listAttrParser } from './list.js'
import type { ListAttrParsedValue } from './list.js'
import { mapAttributeParser } from './map.js'
import type { MapAttrParsedValue } from './map.js'
import type { ParsedValue } from './parser.js'
import { primitiveAttrParser } from './primitive.js'
import type { PrimitiveAttrParsedValue } from './primitive.js'
import { recordAttributeParser } from './record.js'
import type { RecordAttrParsedValue } from './record.js'
import { setAttrParser } from './set.js'
import type { SetAttrParsedValue } from './set.js'
import type {
  FromParsingOptions,
  ParsedValueDefaultOptions,
  ParsedValueOptions,
  ParsingDefaultOptions,
  ParsingOptions
} from './types/options.js'
import { defaultParseExtension, isRequired } from './utils.js'

export type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions
> = OPTIONS extends { mode: 'update' | 'key' }
  ? ATTRIBUTE extends { required: Always }
    ? true
    : false
  : ATTRIBUTE extends { required: AtLeastOnce | Always }
    ? true
    : false

export type AttrParsedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = ATTRIBUTE extends AnyAttribute
  ? AnyAttrParsedValue<ATTRIBUTE, OPTIONS>
  : ATTRIBUTE extends PrimitiveAttribute
    ? PrimitiveAttrParsedValue<ATTRIBUTE, OPTIONS>
    : ATTRIBUTE extends SetAttribute
      ? SetAttrParsedValue<ATTRIBUTE, OPTIONS>
      : ATTRIBUTE extends ListAttribute
        ? ListAttrParsedValue<ATTRIBUTE, OPTIONS>
        : ATTRIBUTE extends MapAttribute
          ? MapAttrParsedValue<ATTRIBUTE, OPTIONS>
          : ATTRIBUTE extends RecordAttribute
            ? RecordAttrParsedValue<ATTRIBUTE, OPTIONS>
            : ATTRIBUTE extends AnyOfAttribute
              ? AnyOfAttrParsedValue<ATTRIBUTE, OPTIONS>
              : never

export function* attrParser<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsingOptions = ParsingDefaultOptions
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  AttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  AttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>,
  ParsedValue<Schema, FromParsingOptions<OPTIONS, true>> | undefined
> {
  type Parsed = AttrParsedValue<ATTRIBUTE, FromParsingOptions<OPTIONS>>

  const {
    mode = 'put',
    fill = true,
    transform = true,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = defaultParseExtension as unknown as NonNullable<OPTIONS['parseExtension']>
  } = options

  let filledValue: Parsed | undefined = inputValue as any
  let nextFill = fill

  if (nextFill && filledValue === undefined) {
    let defaultedValue: Parsed | undefined = undefined

    const modeDefault = attribute.defaults[attribute.key ? 'key' : mode]
    defaultedValue = isFunction(modeDefault) ? modeDefault() : (cloneDeep(modeDefault) as any)

    const itemInput = yield defaultedValue as Parsed

    let linkedValue: Parsed | undefined = defaultedValue
    if (linkedValue === undefined && itemInput !== undefined) {
      const modeLink = attribute.links[attribute.key ? 'key' : mode]
      linkedValue = (isFunction(modeLink) ? modeLink(itemInput) : linkedValue) as any
    }
    yield linkedValue as Parsed

    filledValue = linkedValue
    nextFill = false
  }

  const nextOpts = { ...options, fill: nextFill } as OPTIONS

  const { isExtension, extensionParser, basicInput } = parseExtension(attribute, filledValue, {
    transform
  })

  if (isExtension) {
    if (nextFill) {
      // parseExtension does not fill values
      // If fill was set to `true` and input was defined, we yield it twice for fill steps
      const defaultedValue = filledValue as Parsed
      yield defaultedValue

      const linkedValue = defaultedValue as Parsed
      yield linkedValue
    }
    return yield* extensionParser() as any
  }

  if (basicInput === undefined) {
    const { path } = attribute

    // We don't need to fill
    if (isRequired(attribute, mode)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${path !== undefined ? `'${path}' ` : ''}is required.`,
        path
      })
    }

    const parsedValue = basicInput

    if (transform) {
      yield parsedValue as Parsed
    } else {
      return parsedValue as Parsed
    }

    const transformedValue = parsedValue
    return transformedValue as Parsed
  }

  switch (attribute.type) {
    case 'any':
      return yield* anyAttrParser(attribute, basicInput, nextOpts) as any
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* primitiveAttrParser(attribute, basicInput, nextOpts) as any
    case 'set':
      return yield* setAttrParser(attribute, basicInput, nextOpts) as any
    case 'list':
      return yield* listAttrParser(attribute, basicInput, nextOpts) as any
    case 'map':
      return yield* mapAttributeParser(attribute, basicInput, nextOpts) as any
    case 'record':
      return yield* recordAttributeParser(attribute, basicInput, nextOpts) as any
    case 'anyOf':
      return yield* anyOfAttributeParser(attribute, basicInput, nextOpts) as any
  }
}
