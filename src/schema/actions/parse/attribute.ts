import type { Attribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { InputValue, Schema, WriteMode } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isFunction } from '~/utils/validation/isFunction.js'

import { anyAttrParser } from './any.js'
import { anyOfAttributeParser } from './anyOf.js'
import { listAttrParser } from './list.js'
import { mapAttrParser } from './map.js'
import type { InferWriteValueOptions, ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { primitiveAttrParser } from './primitive.js'
import { recordAttributeParser } from './record.js'
import { setAttrParser } from './set.js'
import { defaultParseExtension, isRequired } from './utils.js'

export function* attrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  attribute: Attribute,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  ParserYield<Attribute, OPTIONS>,
  ParserReturn<Attribute, OPTIONS>,
  // TODO: Define & use DefaultedValue here
  InputValue<Schema, InferWriteValueOptions<OPTIONS, true>> | undefined
> {
  const {
    mode = 'put',
    fill = true,
    transform = true,
    defined = false,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = defaultParseExtension as unknown as NonNullable<OPTIONS['parseExtension']>,
    valuePath = []
  } = options

  let filledValue = inputValue
  let nextFill = fill

  if (nextFill && filledValue === undefined) {
    let defaultedValue = undefined

    const modeDefault = getDefaulter(attribute, mode)
    defaultedValue = isFunction(modeDefault) ? modeDefault() : (cloneDeep(modeDefault) as any)

    const itemInput = yield defaultedValue

    let linkedValue = defaultedValue
    if (linkedValue === undefined && itemInput !== undefined) {
      const modeLink = getLinker(attribute, mode)
      linkedValue = (isFunction(modeLink) ? modeLink(itemInput) : linkedValue) as any
    }
    yield linkedValue

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
      const defaultedValue = filledValue
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
    return yield* extensionParser()
  }

  if (basicInput === undefined) {
    const path = formatValuePath(valuePath)

    // We don't need to fill
    if (isRequired(attribute, mode) || defined) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute${path !== undefined ? ` '${path}'` : ''} is required.`,
        path
      })
    }

    const parsedValue = basicInput

    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = parsedValue
    return transformedValue
  }

  switch (attribute.type) {
    case 'any':
      return yield* anyAttrParser(attribute, basicInput, nextOpts)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return yield* primitiveAttrParser(attribute, basicInput, nextOpts)
    case 'set':
      return yield* setAttrParser(attribute, basicInput, nextOpts)
    case 'list':
      return yield* listAttrParser(attribute, basicInput, nextOpts)
    case 'map':
      return yield* mapAttrParser(attribute, basicInput, nextOpts)
    case 'record':
      return yield* recordAttributeParser(attribute, basicInput, nextOpts)
    case 'anyOf':
      return yield* anyOfAttributeParser(attribute, basicInput, nextOpts)
  }
}

const getDefaulter = (attribute: Attribute, mode: WriteMode) => {
  const { state } = attribute

  if (state.key) {
    return state.keyDefault
  }

  switch (mode) {
    case 'key':
      return state.keyDefault
    case 'put':
      return state.putDefault
    case 'update':
      return state.updateDefault
  }
}

const getLinker = (attribute: Attribute, mode: WriteMode) => {
  const { state } = attribute

  if (state.key) {
    return state.keyLink
  }

  switch (mode) {
    case 'key':
      return state.keyLink
    case 'put':
      return state.putLink
    case 'update':
      return state.updateLink
  }
}
