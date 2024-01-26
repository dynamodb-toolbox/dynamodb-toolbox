import cloneDeep from 'lodash.clonedeep'

import type { RequiredOption, Attribute, Extension, AttributeValue, Item } from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isFunction, isString } from 'v1/utils/validation'

import type { HasExtension, ParsingOptions, ExtensionParser } from './types'
import { anyAttributeParser } from './any'
import { primitiveAttributeParser } from './primitive'
import { setAttributeParser } from './set'
import { listAttributeParser } from './list'
import { mapAttributeParser } from './map'
import { recordAttributeParser } from './record'
import { anyOfAttributeParser } from './anyOf'
import { defaultParseExtension } from './utils'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export function* attributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: Attribute,
  inputValue: AttributeValue<INPUT_EXTENSION> | undefined,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  AttributeValue<INPUT_EXTENSION>,
  AttributeValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const {
    requiringOptions = defaultRequiringOptions,
    fill = true,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = (defaultParseExtension as unknown) as ExtensionParser<
      INPUT_EXTENSION,
      SCHEMA_EXTENSION
    >
  } = options

  let filledValue: AttributeValue<INPUT_EXTENSION> | undefined = inputValue
  let nextFill = fill

  if (nextFill && filledValue === undefined) {
    let defaultedValue: AttributeValue<INPUT_EXTENSION> | undefined = undefined
    const isFillString = isString(fill)

    if (isFillString) {
      const operationDefault = attribute.defaults[attribute.key ? 'key' : fill]
      defaultedValue = isFunction(operationDefault)
        ? operationDefault()
        : cloneDeep(operationDefault)
    }

    const itemInput = yield defaultedValue

    let linkedValue: AttributeValue<INPUT_EXTENSION> | undefined = defaultedValue
    if (isFillString && linkedValue === undefined && itemInput !== undefined) {
      const operationLink = attribute.links[attribute.key ? 'key' : fill]
      linkedValue = isFunction(operationLink) ? operationLink(itemInput) : linkedValue
    }
    yield linkedValue

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
    return yield* extensionParser()
  }

  if (basicInput === undefined) {
    // We don't need to fill
    if (requiringOptions.has(attribute.required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    }

    const parsedValue = basicInput
    yield parsedValue

    const transformedValue = parsedValue
    return transformedValue
  }

  switch (attribute.type) {
    case 'any':
      return yield* anyAttributeParser(basicInput, nextOpts)
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* primitiveAttributeParser(attribute, basicInput, nextOpts)
    case 'set':
      return yield* setAttributeParser(attribute, basicInput, nextOpts)
    case 'list':
      return yield* listAttributeParser(attribute, basicInput, nextOpts)
    case 'map':
      return yield* mapAttributeParser(attribute, basicInput, nextOpts)
    case 'record':
      return yield* recordAttributeParser(attribute, basicInput, nextOpts)
    case 'anyOf':
      return yield* anyOfAttributeParser(attribute, basicInput, nextOpts)
  }
}
