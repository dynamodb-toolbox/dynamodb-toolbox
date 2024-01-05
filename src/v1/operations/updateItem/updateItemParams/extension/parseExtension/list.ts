import type { AttributeBasicValue, AttributeValue, ListAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
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
  AttributeValue<UpdateItemInputExtension> | undefined
> {
  // $REMOVE is allowed (we need this as elements 'required' prop is defaulted to "atLeastOnce")
  if (inputValue === $REMOVE) {
    const clonedValue: typeof $REMOVE = $REMOVE
    yield clonedValue

    const parsedValue: typeof $REMOVE = clonedValue
    yield parsedValue

    const collapsedValue: typeof $REMOVE = parsedValue
    return collapsedValue
  }

  if (inputValue === undefined) {
    const clonedValue = undefined
    yield clonedValue

    const parsedValue = clonedValue
    yield parsedValue

    const collapsedValue = parsedValue
    return collapsedValue
  }

  return yield* parseAttributeClonedInput(attribute.elements, inputValue, options)
}

export const parseListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = parseAttributeClonedInput(attribute, input[$SET], {
          ...options,
          // Should a simple list of valid elements (not extended)
          parseExtension: undefined
        })

        const clonedValue = { [$SET]: parser.next().value }
        yield clonedValue

        const parsedValue = { [$SET]: parser.next().value }
        yield parsedValue

        const collapsedValue = { [$SET]: parser.next().value }
        return collapsedValue
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
              parseAttributeClonedInput<never, UpdateItemInputExtension>(
                attribute.elements,
                element,
                // Should a simple list of valid elements (not extended)
                { ...options, parseExtension: undefined }
              )
            )

            const clonedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            yield clonedValue

            const parsedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            yield parsedValue

            const collapsedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            return collapsedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
            attribute,
            appendedValue,
            // Can be a reference
            { ...options, parseExtension: parseReferenceExtension }
          )

          const clonedValue = { [$APPEND]: parser.next().value }
          yield clonedValue

          const parsedValue = { [$APPEND]: parser.next().value }
          yield parsedValue

          const collapsedValue = { [$APPEND]: parser.next().value }
          return collapsedValue
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
              parseAttributeClonedInput<never, UpdateItemInputExtension>(
                attribute.elements,
                element,
                // Should a simple list of valid elements (not extended)
                { ...options, parseExtension: undefined }
              )
            )

            const clonedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            yield clonedValue

            const parsedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            yield parsedValue

            const collapsedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            return collapsedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = parseAttributeClonedInput<ReferenceExtension, UpdateItemInputExtension>(
            attribute,
            prependedValue,
            // Can be a reference
            { ...options, parseExtension: parseReferenceExtension }
          )

          const clonedValue = { [$PREPEND]: parser.next().value }
          yield clonedValue

          const parsedValue = { [$PREPEND]: parser.next().value }
          yield parsedValue

          const collapsedValue = { [$PREPEND]: parser.next().value }
          return collapsedValue
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

        const clonedValue = Object.fromEntries(
          Object.entries(parsers)
            .map(([index, parser]) => [index, parser.next().value])
            .filter(([, element]) => element !== undefined)
        )
        yield clonedValue

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

        const collapsedValue = [...Array(maxUpdatedIndex + 1).keys()].map(index => {
          const parser = parsers[index]

          return parser === undefined ? undefined : parser.next().value
        })
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
