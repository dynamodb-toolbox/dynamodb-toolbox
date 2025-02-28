import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { ItemSchema, Schema } from '~/schema/index.js'
import type { InputValue, WriteMode } from '~/schema/index.js'
import { cloneDeep } from '~/utils/cloneDeep.js'
import { isFunction } from '~/utils/validation/isFunction.js'

import { anySchemaParser } from './any.js'
import { anyOfSchemaParser } from './anyOf.js'
import { listSchemaParser } from './list.js'
import { mapSchemaParser } from './map.js'
import type { InferWriteValueOptions, ParseAttrValueOptions } from './options.js'
import type { ParserReturn, ParserYield } from './parser.js'
import { primitiveSchemaParser } from './primitive.js'
import { recordSchemaParser } from './record.js'
import { setSchemaParser } from './set.js'
import { defaultParseExtension, isRequired } from './utils.js'

export function* attrParser<OPTIONS extends ParseAttrValueOptions = {}>(
  schema: Schema,
  inputValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  ParserYield<Schema, OPTIONS>,
  ParserReturn<Schema, OPTIONS>,
  // TODO: Define & use DefaultedValue here
  InputValue<ItemSchema, InferWriteValueOptions<OPTIONS, true>> | undefined
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

    const modeDefault = getDefaulter(schema, mode)
    defaultedValue = isFunction(modeDefault) ? modeDefault() : (cloneDeep(modeDefault) as any)

    const itemInput = yield defaultedValue

    let linkedValue = defaultedValue
    if (linkedValue === undefined && itemInput !== undefined) {
      const modeLink = getLinker(schema, mode)
      linkedValue = (isFunction(modeLink) ? modeLink(itemInput) : linkedValue) as any
    }
    yield linkedValue

    filledValue = linkedValue
    nextFill = false
  }

  const nextOpts = { ...options, fill: nextFill } as OPTIONS

  const { isExtension, extensionParser, basicInput } = parseExtension(schema, filledValue, {
    transform,
    valuePath
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
    if (isRequired(schema, mode) || defined) {
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

  switch (schema.type) {
    case 'any':
      return yield* anySchemaParser(schema, basicInput, nextOpts)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return yield* primitiveSchemaParser(schema, basicInput, nextOpts)
    case 'set':
      return yield* setSchemaParser(schema, basicInput, nextOpts)
    case 'list':
      return yield* listSchemaParser(schema, basicInput, nextOpts)
    case 'map':
      return yield* mapSchemaParser(schema, basicInput, nextOpts)
    case 'record':
      return yield* recordSchemaParser(schema, basicInput, nextOpts)
    case 'anyOf':
      return yield* anyOfSchemaParser(schema, basicInput, nextOpts)
  }
}

const getDefaulter = (schema: Schema, mode: WriteMode) => {
  const { props } = schema

  if (props.key) {
    return props.keyDefault
  }

  switch (mode) {
    case 'key':
      return props.keyDefault
    case 'put':
      return props.putDefault
    case 'update':
      return props.updateDefault
  }
}

const getLinker = (schema: Schema, mode: WriteMode) => {
  const { props } = schema

  if (props.key) {
    return props.keyLink
  }

  switch (mode) {
    case 'key':
      return props.keyLink
    case 'put':
      return props.putLink
    case 'update':
      return props.updateLink
  }
}
