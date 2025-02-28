import { Parser } from '~/schema/actions/parse/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  RecordSchema,
  Schema,
  SchemaUnextendedValue,
  TransformedValue,
  ValidValue
} from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { $SET, isRemoval, isSetting } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseUpdateExtension } from './attribute.js'

function* recordElementsParser(
  schema: RecordSchema,
  inputValue: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions = {}
): Generator<
  ValidValue<Schema, { extension: UpdateItemInputExtension }>,
  | ValidValue<Schema, { extension: UpdateItemInputExtension }>
  | TransformedValue<Schema, { extension: UpdateItemInputExtension }>
> {
  if (isRemoval(inputValue)) {
    const parsedValue = inputValue
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = parsedValue
    return transformedValue
  }

  return yield* new Parser(schema.elements).start(inputValue, {
    mode: 'update',
    fill: false,
    transform,
    parseExtension: parseUpdateExtension,
    valuePath
  })
}

export const parseRecordExtension = (
  schema: RecordSchema,
  input: unknown,
  { transform = true, valuePath = [] }: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (isSetting(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(schema).start(input[$SET], {
          fill: false,
          transform,
          valuePath: [...valuePath, '$SET']
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

  if (isObject(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers = Object.entries(input)
          .filter(([, inputValue]) => inputValue !== undefined)
          .map(([inputKey, inputValue]) => [
            new Parser(schema.keys).start(inputKey, { fill: false, transform }),
            recordElementsParser(schema, inputValue, {
              transform,
              valuePath: [...valuePath, inputKey]
            })
          ])

        const parsedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              keyParser!.next().value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              elementParser!.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              keyParser!.next().value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              elementParser!.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    unextendedInput: input as SchemaUnextendedValue<UpdateItemInputExtension> | undefined
  }
}
