import cloneDeep from 'lodash.clonedeep'

import type {
  RequiredOption,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Extension,
  AtLeastOnce,
  Always
} from 'v1/schema'
import type { If, IsConstraint } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isFunction, isString } from 'v1/utils/validation'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions, ExtensionParser } from './types'
import { anyAttrWorkflow, ValidAnyAttrValue } from './any'
import { primitiveAttrWorkflow, ValidPrimitiveAttrValue } from './primitive'
import { setAttrWorkflow, ValidSetAttrValue } from './set'
import { listAttrWorkflow, ValidListAttrValue } from './list'
import { mapAttributeParser, ValidMapAttrValue } from './map'
import { recordAttributeParser, ValidRecordAttrValue } from './record'
import { anyOfAttributeParser, ValidAnyOfAttrValue } from './anyOf'
import { defaultParseExtension } from './utils'

type MustBeDefined<ATTRIBUTE extends Attribute> = ATTRIBUTE extends {
  required: AtLeastOnce | Always
}
  ? true
  : false

export type ValidAttrValue<ATTRIBUTE extends Attribute, EXTENSION extends Extension = never> = If<
  IsConstraint<ATTRIBUTE, Attribute>,
  unknown,
  | If<MustBeDefined<ATTRIBUTE>, never, undefined>
  | (ATTRIBUTE extends AnyAttribute
      ? ValidAnyAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends PrimitiveAttribute
      ? ValidPrimitiveAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends SetAttribute
      ? ValidSetAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends ListAttribute
      ? ValidListAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends MapAttribute
      ? ValidMapAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends RecordAttribute
      ? ValidRecordAttrValue<ATTRIBUTE, EXTENSION>
      : ATTRIBUTE extends AnyOfAttribute
      ? ValidAnyOfAttrValue<ATTRIBUTE, EXTENSION>
      : never)
>

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export function* attrWorkflow<
  ATTRIBUTE extends Attribute,
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: ATTRIBUTE,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidValue<ATTRIBUTE, INPUT_EXTENSION>,
  ValidValue<ATTRIBUTE, INPUT_EXTENSION>,
  ValidValue<ATTRIBUTE, SCHEMA_EXTENSION> | undefined
> {
  const {
    requiringOptions = defaultRequiringOptions,
    fill = true,
    transform = true,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = (defaultParseExtension as unknown) as ExtensionParser<
      INPUT_EXTENSION,
      SCHEMA_EXTENSION
    >
  } = options

  let filledValue: ValidValue<ATTRIBUTE, INPUT_EXTENSION> | undefined = inputValue as any
  let nextFill = fill

  if (nextFill && filledValue === undefined) {
    let defaultedValue: ValidValue<ATTRIBUTE, INPUT_EXTENSION> | undefined = undefined
    const isFillString = isString(fill)

    if (isFillString) {
      const operationDefault = attribute.defaults[attribute.key ? 'key' : fill]
      defaultedValue = isFunction(operationDefault)
        ? operationDefault()
        : (cloneDeep(operationDefault) as any)
    }

    const itemInput = yield defaultedValue as ValidValue<ATTRIBUTE, INPUT_EXTENSION>

    let linkedValue: ValidValue<ATTRIBUTE, INPUT_EXTENSION> | undefined = defaultedValue
    if (isFillString && linkedValue === undefined && itemInput !== undefined) {
      const operationLink = attribute.links[attribute.key ? 'key' : fill]
      linkedValue = (isFunction(operationLink) ? operationLink(itemInput) : linkedValue) as any
    }
    yield linkedValue as ValidValue<ATTRIBUTE, INPUT_EXTENSION>

    filledValue = linkedValue
    nextFill = false
  }

  const nextOpts = { ...options, fill: nextFill }

  const { isExtension, extensionParser, basicInput } = parseExtension(
    attribute,
    filledValue,
    nextOpts
  )

  if (isExtension) {
    return yield* extensionParser() as any
  }

  if (basicInput === undefined) {
    const { required, path } = attribute

    // We don't need to fill
    if (requiringOptions.has(required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${path !== undefined ? `'${path}' ` : ''}is required.`,
        path
      })
    }

    const parsedValue = basicInput

    if (transform) {
      yield parsedValue as any
    } else {
      return parsedValue as any
    }

    const transformedValue = parsedValue
    return transformedValue as any
  }

  switch (attribute.type) {
    case 'any':
      return yield* anyAttrWorkflow<INPUT_EXTENSION, SCHEMA_EXTENSION>(basicInput, nextOpts) as any
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* primitiveAttrWorkflow<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
    case 'set':
      return yield* setAttrWorkflow<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
    case 'list':
      return yield* listAttrWorkflow<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
    case 'map':
      return yield* mapAttributeParser<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
    case 'record':
      return yield* recordAttributeParser<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
    case 'anyOf':
      return yield* anyOfAttributeParser<INPUT_EXTENSION, SCHEMA_EXTENSION>(
        attribute,
        basicInput,
        nextOpts
      ) as any
  }
}
