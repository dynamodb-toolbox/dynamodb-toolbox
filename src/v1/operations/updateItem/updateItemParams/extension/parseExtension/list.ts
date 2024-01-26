import type { AttributeBasicValue, AttributeValue, ListAttribute, Item } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/parsing/types'
import { attributeParser } from 'v1/parsing/attribute'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isInteger } from 'v1/utils/validation/isInteger'
import { isArray } from 'v1/utils/validation/isArray'

import type { ReferenceExtension, UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE, $APPEND, $PREPEND } from 'v1/operations/updateItem/constants'
import {
  hasSetOperation,
  hasAppendOperation,
  hasPrependOperation
} from 'v1/operations/updateItem/utils'

import { parseReferenceExtension } from './reference'

function* parseListElementClonedInput(
  attribute: ListAttribute,
  inputValue: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<
  AttributeValue<UpdateItemInputExtension> | undefined,
  AttributeValue<UpdateItemInputExtension> | undefined,
  Item<UpdateItemInputExtension> | undefined
> {
  const { fill = true } = options

  if (inputValue === $REMOVE) {
    if (fill) {
      const defaultedValue: typeof $REMOVE = $REMOVE
      yield defaultedValue

      const linkedValue: typeof $REMOVE = defaultedValue
      yield linkedValue
    }

    const parsedValue: typeof $REMOVE = $REMOVE
    yield parsedValue

    const transformedValue: typeof $REMOVE = $REMOVE
    return transformedValue
  }

  if (inputValue === undefined) {
    if (fill) {
      const defaultedValue = undefined
      yield defaultedValue

      const linkedValue = undefined
      yield linkedValue
    }

    const parsedValue = undefined
    yield parsedValue

    const transformedValue = undefined
    return transformedValue
  }

  return yield* attributeParser(attribute.elements, inputValue, options)
}

export const parseListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true } = options

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attributeParser(attribute, input[$SET], {
          ...options,
          // Should a simple list of valid elements (not extended)
          parseExtension: undefined
        })

        if (fill) {
          const defaultedValue = { [$SET]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$SET]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$SET]: parser.next().value }
        yield parsedValue

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  if (isObject(input) || isArray(input)) {
    if (hasAppendOperation(input)) {
      const appendedValue = input[$APPEND]

      if (isArray(appendedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            /**
             * @debt type "TODO: fix this cast"
             */
            const parsers = (appendedValue as AttributeValue<never>[]).map(element =>
              attributeParser<never, UpdateItemInputExtension>(
                attribute.elements,
                element,
                // Should a simple list of valid elements (not extended)
                { ...options, parseExtension: undefined }
              )
            )

            if (fill) {
              const defaultedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
              yield defaultedValue

              const linkedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
              yield linkedValue
            }

            const parsedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            yield parsedValue

            const transformedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = attributeParser<ReferenceExtension, UpdateItemInputExtension>(
            attribute,
            appendedValue,
            // Can be a reference
            { ...options, parseExtension: parseReferenceExtension }
          )

          if (fill) {
            const defaultedValue = { [$APPEND]: parser.next().value }
            yield defaultedValue

            const linkedValue = { [$APPEND]: parser.next().value }
            yield linkedValue
          }

          const parsedValue = { [$APPEND]: parser.next().value }
          yield parsedValue

          const transformedValue = { [$APPEND]: parser.next().value }
          return transformedValue
        }
      }
    }

    if (hasPrependOperation(input)) {
      const prependedValue = input[$PREPEND]

      if (isArray(prependedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            /**
             * @debt type "TODO: fix this cast"
             */
            const parsers = (prependedValue as AttributeValue<never>[]).map(element =>
              attributeParser<never, UpdateItemInputExtension>(
                attribute.elements,
                element,
                // Should a simple list of valid elements (not extended)
                { ...options, parseExtension: undefined }
              )
            )

            if (fill) {
              const defaultedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
              yield defaultedValue

              const linkedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
              yield linkedValue
            }

            const parsedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            yield parsedValue

            const transformedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = attributeParser<ReferenceExtension, UpdateItemInputExtension>(
            attribute,
            prependedValue,
            // Can be a reference
            { ...options, parseExtension: parseReferenceExtension }
          )

          if (fill) {
            const defaultedValue = { [$PREPEND]: parser.next().value }
            yield defaultedValue

            const linkedValue = { [$PREPEND]: parser.next().value }
            yield linkedValue
          }

          const parsedValue = { [$PREPEND]: parser.next().value }
          yield parsedValue

          const transformedValue = { [$PREPEND]: parser.next().value }
          return transformedValue
        }
      }
    }

    return {
      isExtension: true,
      *extensionParser() {
        let maxUpdatedIndex = 0
        const parsers: {
          [KEY in number]: Generator<
            AttributeValue<UpdateItemInputExtension>,
            AttributeValue<UpdateItemInputExtension>
          >
        } = Object.fromEntries(
          Object.entries(input)
            .map(([index, element]) => [
              index,
              parseListElementClonedInput(attribute, element, options)
            ])
            .filter(([, element]) => element !== undefined)
        )

        if (fill) {
          const defaultedValue = Object.fromEntries(
            Object.entries(parsers)
              .map(([index, parser]) => [index, parser.next().value])
              .filter(([, element]) => element !== undefined)
          )
          yield defaultedValue

          const linkedValue = Object.fromEntries(
            Object.entries(parsers)
              .map(([index, parser]) => [index, parser.next().value])
              .filter(([, element]) => element !== undefined)
          )
          yield linkedValue
        }

        for (const inputKey of Object.keys(parsers)) {
          const parsedInputKey = parseFloat(inputKey)

          if (!isInteger(parsedInputKey)) {
            throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
              message: `Index of array attribute ${attribute.path} is not a valid integer`,
              path: attribute.path,
              payload: {
                received: inputKey
              }
            })
          }

          maxUpdatedIndex = Math.max(maxUpdatedIndex, parsedInputKey)
        }

        const parsedValue = Object.fromEntries(
          Object.entries(parsers)
            .map(([index, parser]) => [index, parser.next().value])
            .filter(([, element]) => element !== undefined)
        )
        yield parsedValue

        const transformedValue = [...Array(maxUpdatedIndex + 1).keys()].map(index => {
          const parser = parsers[index]

          return parser === undefined ? undefined : parser.next().value
        })
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
