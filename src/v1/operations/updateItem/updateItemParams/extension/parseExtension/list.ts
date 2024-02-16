import type {
  Schema,
  ListAttribute,
  ListAttributeElements,
  ValidValue,
  AttributeBasicValue
} from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/schema/actions/parse/types'
import { attrWorkflow } from 'v1/schema/actions/parse/attribute'
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

function* listElementWorkflow(
  attribute: ListAttribute,
  inputValue: unknown,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<
  ValidValue<ListAttributeElements, UpdateItemInputExtension> | undefined,
  ValidValue<ListAttributeElements, UpdateItemInputExtension> | undefined,
  ValidValue<Schema, UpdateItemInputExtension> | undefined
> {
  const { fill = true, transform = true } = options

  if (inputValue === $REMOVE) {
    if (fill) {
      const defaultedValue: typeof $REMOVE = $REMOVE
      yield defaultedValue

      const linkedValue: typeof $REMOVE = defaultedValue
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

  if (inputValue === undefined) {
    if (fill) {
      const defaultedValue = undefined
      yield defaultedValue

      const linkedValue = undefined
      yield linkedValue
    }

    const parsedValue = undefined

    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = undefined
    return transformedValue
  }

  return yield* attrWorkflow(attribute.elements, inputValue, options)
}

export const parseListExtension = (
  attribute: ListAttribute,
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

  if (isObject(input) || isArray(input)) {
    if (hasAppendOperation(input)) {
      const appendedValue = input[$APPEND]

      if (isArray(appendedValue)) {
        return {
          isExtension: true,
          *extensionParser() {
            const parsers = appendedValue.map(element =>
              attrWorkflow<ListAttributeElements, never, UpdateItemInputExtension>(
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

            if (transform) {
              yield parsedValue
            } else {
              return parsedValue
            }

            const transformedValue = { [$APPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = attrWorkflow<ListAttribute, ReferenceExtension, UpdateItemInputExtension>(
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

          if (transform) {
            yield parsedValue
          } else {
            return parsedValue
          }

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
            const parsers = prependedValue.map(element =>
              attrWorkflow<ListAttributeElements, never, UpdateItemInputExtension>(
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

            if (transform) {
              yield parsedValue
            } else {
              return parsedValue
            }

            const transformedValue = { [$PREPEND]: parsers.map(parser => parser.next().value) }
            return transformedValue
          }
        }
      }

      return {
        isExtension: true,
        *extensionParser() {
          const parser = attrWorkflow<ListAttribute, ReferenceExtension, UpdateItemInputExtension>(
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

          if (transform) {
            yield parsedValue
          } else {
            return parsedValue
          }

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
            ValidValue<ListAttributeElements, UpdateItemInputExtension>,
            ValidValue<ListAttributeElements, UpdateItemInputExtension>
          >
        } = Object.fromEntries(
          Object.entries(input)
            .map(([index, element]) => [index, listElementWorkflow(attribute, element, options)])
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
            const { path } = attribute

            throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
              message: `Index of array attribute ${
                path !== undefined ? `'${path}' ` : ''
              }is not a valid integer`,
              path,
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

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

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
