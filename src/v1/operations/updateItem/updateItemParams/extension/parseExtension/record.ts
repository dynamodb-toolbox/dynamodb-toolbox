import type {
  Schema,
  Attribute,
  RecordAttribute,
  RecordAttributeKeys,
  RecordAttributeElements,
  ValidValue,
  AttributeBasicValue
} from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/schema/actions/parse/types'
import { attrWorkflow } from 'v1/schema/actions/parse'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

function* recordElementsWorkflow(
  attribute: RecordAttribute,
  inputValue: unknown,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<
  ValidValue<Attribute, UpdateItemInputExtension>,
  ValidValue<Attribute, UpdateItemInputExtension>,
  ValidValue<Schema, UpdateItemInputExtension> | undefined
> {
  const { fill = true, transform = true } = options

  if (inputValue === $REMOVE) {
    if (fill) {
      const defaultedValue: typeof $REMOVE = $REMOVE
      yield defaultedValue

      const linkedValue: typeof $REMOVE = $REMOVE
      yield linkedValue
    }

    const parsedValue: typeof $REMOVE = $REMOVE

    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue: typeof $REMOVE = $REMOVE
    return transformedValue
  }

  return yield* attrWorkflow(attribute.elements, inputValue, options)
}

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: unknown,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true, transform = true } = options

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attrWorkflow(attribute, input[$SET], {
          ...options,
          // Should a simple record of valid elements (not extended)
          parseExtension: undefined
        })

        if (fill) {
          const defaultedValue = { [$SET]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$SET]: parser.next().value }
          yield linkedValue
        }

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
        const parsers: [
          Generator<ValidValue<RecordAttributeKeys>, ValidValue<RecordAttributeKeys>>,
          Generator<
            ValidValue<RecordAttributeElements, UpdateItemInputExtension>,
            ValidValue<RecordAttributeElements, UpdateItemInputExtension>
          >
        ][] = Object.entries(input)
          .filter(([, inputValue]) => inputValue !== undefined)
          .map(([inputKey, inputValue]) => [
            attrWorkflow<RecordAttributeKeys>(attribute.keys, inputKey, {
              ...options,
              // Should a simple string (not extended)
              parseExtension: undefined
            }),
            recordElementsWorkflow(attribute, inputValue, options)
          ])

        if (fill) {
          const defaultedValue = Object.fromEntries(
            parsers
              .map(([keyParser, elementParser]) => [
                keyParser.next().value,
                elementParser.next().value
              ])
              .filter(([, element]) => element !== undefined)
          )
          yield defaultedValue

          const linkedValue = Object.fromEntries(
            parsers
              .map(([keyParser, elementParser]) => [
                keyParser.next().value,
                elementParser.next().value
              ])
              .filter(([, element]) => element !== undefined)
          )
          yield linkedValue
        }

        const parsedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
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
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
