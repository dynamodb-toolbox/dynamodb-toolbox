import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  Schema,
  SchemaUnextendedValue,
  TransformedValue,
  TupleSchema,
  ValidValue
} from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isInteger } from '~/utils/validation/isInteger.js'
import { isObject } from '~/utils/validation/isObject.js'

import { $SET, isSetting } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseUpdateExtension } from './attribute.js'

function* tupleElementParser(
  elementSchema: Schema,
  inputValue: unknown,
  { transform = true, valuePath }: ExtensionParserOptions
): Generator<
  ValidValue<Schema, { extension: UpdateItemInputExtension }> | undefined,
  | ValidValue<Schema, { extension: UpdateItemInputExtension }>
  | TransformedValue<Schema, { extension: UpdateItemInputExtension }>
> {
  if (inputValue === undefined) {
    const parsedValue = undefined
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = undefined
    return transformedValue
  }

  return yield* new Parser(elementSchema).start(inputValue, {
    mode: 'update',
    fill: false,
    transform,
    parseExtension: parseUpdateExtension,
    valuePath
  })
}

export const parseTupleExtension = (
  schema: TupleSchema,
  input: unknown,
  { transform = true, valuePath }: ExtensionParserOptions
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSetting(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(schema).start(input[$SET], {
          fill: false,
          transform,
          valuePath: [...(valuePath ?? []), '$SET']
        })

        const parsedValue = { [$SET]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  const isInputObject = isObject(input)
  if (isInputObject || isArray(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        if (isInputObject) {
          for (const inputKey in input) {
            const parsedInputKey = parseFloat(inputKey)

            if (
              !isInteger(parsedInputKey) ||
              parsedInputKey < 0 ||
              parsedInputKey > schema.elements.length - 1
            ) {
              const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

              throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
                message: `Index of tuple attribute ${
                  path !== undefined ? `'${path}' ` : ''
                }is not a valid tuple index`,
                path,
                payload: { received: parsedInputKey }
              })
            }
          }
        }

        const parsers: Generator<
          ValidValue<Schema, { extension: UpdateItemInputExtension }>,
          | ValidValue<Schema, { extension: UpdateItemInputExtension }>
          | TransformedValue<Schema, { extension: UpdateItemInputExtension }>
        >[] = schema.elements.map((elementSchema, index) =>
          tupleElementParser(
            elementSchema,
            /**
             * @debt type "Fix this cast"
             */
            (input as Record<number, unknown>)[index],
            { transform, valuePath: [...(valuePath ?? []), index] }
          )
        )

        const parsedValue = parsers.map(parser => parser.next().value)
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = parsers.map(parser => parser.next().value)
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    unextendedInput: input as SchemaUnextendedValue<UpdateItemInputExtension> | undefined
  }
}
