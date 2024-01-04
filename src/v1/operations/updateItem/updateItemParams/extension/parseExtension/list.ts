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
  inputValue: AttributeValue<UpdateItemInputExtension>,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<AttributeValue<UpdateItemInputExtension>, AttributeValue<UpdateItemInputExtension>> {
  // $REMOVE is allowed (we need this as elements 'required' prop is defaulted to "atLeastOnce")
  if (inputValue === $REMOVE) {
    yield $REMOVE
    return $REMOVE
  }

  return yield* parseAttributeClonedInput(attribute.elements, inputValue, options)
}

export const parseListExtension = (
  attribute: ListAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    const parser = parseAttributeClonedInput(attribute, input[$SET], {
      ...options,
      // Should a simple list of valid elements (not extended)
      parseExtension: undefined
    })

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$SET]: parser.next().value }
        return { [$SET]: parser.next().value }
      }
    }
  }

  if (isObject(input) || isArray(input)) {
    if (hasAppendOperation(input)) {
      const appendedValue = input[$APPEND]

      if (isArray(appendedValue)) {
        /**
         * @debt type "TODO: fix this cast"
         */
        const parsers = (appendedValue as AttributeValue<never>[]).map(element =>
          parseAttributeClonedInput<never>(attribute.elements, element, {
            ...options,
            // Should a simple list of valid elements (not extended)
            parseExtension: undefined
          })
        )

        return {
          isExtension: true,
          *extensionParser() {
            yield { [$APPEND]: parsers.map(parser => parser.next().value) }
            return { [$APPEND]: parsers.map(parser => parser.next().value) }
          }
        }
      }

      const parser = parseAttributeClonedInput<ReferenceExtension>(attribute, appendedValue, {
        ...options,
        // Can be single element or a reference
        parseExtension: parseReferenceExtension
      })
      return {
        isExtension: true,
        *extensionParser() {
          yield { [$APPEND]: parser.next().value }
          return { [$APPEND]: parser.next().value }
        }
      }
    }

    if (hasPrependOperation(input)) {
      const prependedValue = input[$PREPEND]

      if (isArray(prependedValue)) {
        /**
         * @debt type "TODO: fix this cast"
         */
        const parsers = (prependedValue as AttributeValue<never>[]).map(element =>
          parseAttributeClonedInput<never>(attribute.elements, element, {
            ...options,
            // Should a simple list of valid elements (not extended)
            parseExtension: undefined
          })
        )

        return {
          isExtension: true,
          *extensionParser() {
            yield { [$PREPEND]: parsers.map(parser => parser.next().value) }
            return { [$PREPEND]: parsers.map(parser => parser.next().value) }
          }
        }
      }

      const parser = parseAttributeClonedInput<ReferenceExtension>(attribute, prependedValue, {
        ...options,
        // Can be single element or a reference
        parseExtension: parseReferenceExtension
      })

      return {
        isExtension: true,
        *extensionParser() {
          yield { [$PREPEND]: parser.next().value }
          return { [$PREPEND]: parser.next().value }
        }
      }
    }

    let maxUpdatedIndex = 0
    const parsers: {
      [KEY in number]: Generator<
        AttributeValue<UpdateItemInputExtension>,
        AttributeValue<UpdateItemInputExtension>
      >
    } = {}

    for (const [inputKey, inputValue] of Object.entries(input)) {
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

      // undefined is allowed
      if (inputValue === undefined) {
        continue
      }

      parsers[parsedInputKey] = parseListElementClonedInput(attribute, inputValue, options)
    }

    return {
      isExtension: true,
      *extensionParser() {
        yield Object.fromEntries(
          Object.entries(parsers)
            .map(([index, parser]) => [index, parser.next().value])
            .filter(([, element]) => element !== undefined)
        )

        return [...Array(maxUpdatedIndex + 1).keys()].map(index => {
          const parser = parsers[index]

          return parser === undefined ? undefined : parser.next().value
        })
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
