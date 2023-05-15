import type { AnyAttribute, Attribute, PrimitiveAttribute, Item } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isString } from 'v1/utils/validation/isString'

import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'

interface ExpressionParser {
  schema: Item | Attribute
  expressionAttributeNames: string[]
  clone: (schema?: Attribute | Item) => ExpressionParser
  expression: string
  resetExpression: (str?: string) => void
  appendToExpression: (str: string) => void
  appendAttributePath: (path: string) => Attribute
}

const defaultAnyAttribute: Omit<AnyAttribute, 'path'> = {
  type: 'any',
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}

const defaultNumberAttribute: Omit<PrimitiveAttribute<'number'>, 'path'> = {
  type: 'number',
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined,
  enum: undefined
}

class InvalidExpressionAttributePathError extends DynamoDBToolboxError<'commands.invalidExpressionAttributePath'> {
  constructor(attributePath: string) {
    super('commands.invalidExpressionAttributePath', {
      message: `Unable to match expression attribute path with item: ${attributePath}`,
      payload: { attributePath }
    })
  }
}

const isListAccessor = (accessor: string): accessor is `[${number}]` => /\[\d+\]/g.test(accessor)

export const isAttributePath = (candidate: unknown): candidate is { attr: string } =>
  isObject(candidate) && 'attr' in candidate && isString(candidate.attr)

export const appendAttributePath = (
  parser: ExpressionParser,
  attributePath: string,
  options: { size?: boolean } = {}
): Attribute => {
  let expressionPath = ''
  let parentAttribute: Attribute | Item = parser.schema
  let attributeMatches = [...attributePath.matchAll(/\[(\d+)\]|\w+(?=(\.|$|\[))/g)]

  while (attributeMatches.length > 0) {
    const attributeMatch = attributeMatches.shift() as RegExpMatchArray
    const childAttributeAccessor = attributeMatch[0]

    switch (parentAttribute.type) {
      case 'binary':
      case 'boolean':
      case 'number':
      case 'string':
      case 'set':
        throw new InvalidExpressionAttributePathError(attributePath)
      case 'any': {
        const isChildAttributeInList = isListAccessor(childAttributeAccessor)

        if (isChildAttributeInList) {
          expressionPath += childAttributeAccessor
        } else {
          const expressionAttributeNameIndex = parser.expressionAttributeNames.push(
            childAttributeAccessor
          )
          expressionPath += `.#${expressionAttributeNameIndex}`
        }

        parentAttribute = {
          path: [parentAttribute.path, childAttributeAccessor].join(
            isChildAttributeInList ? '' : '.'
          ),
          ...defaultAnyAttribute
        }
        break
      }
      case 'record': {
        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(
          // We don't really need to clone / add default as it is a defined string
          parseAttributeClonedInput(parentAttribute.keys, childAttributeAccessor) as string
        )
        expressionPath += `.#${expressionAttributeNameIndex}`

        parentAttribute = parentAttribute.elements
        break
      }
      case 'item':
      case 'map': {
        const childAttribute = parentAttribute.attributes[childAttributeAccessor]
        if (!childAttribute) {
          throw new InvalidExpressionAttributePathError(attributePath)
        }

        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(
          childAttribute.savedAs ?? childAttributeAccessor
        )
        expressionPath +=
          parentAttribute.type === 'item'
            ? `#${expressionAttributeNameIndex}`
            : `.#${expressionAttributeNameIndex}`

        parentAttribute = childAttribute
        break
      }
      case 'list': {
        if (!isListAccessor(childAttributeAccessor)) {
          throw new InvalidExpressionAttributePathError(attributePath)
        }

        expressionPath += childAttributeAccessor

        parentAttribute = parentAttribute.elements
        break
      }
      case 'anyOf': {
        let validElementExpressionParser: ExpressionParser | undefined = undefined
        const subPath = attributePath.slice(attributeMatch.index)

        for (const element of parentAttribute.elements) {
          try {
            parentAttribute = element
            const elementExpressionParser = parser.clone(element)
            elementExpressionParser.resetExpression()
            parentAttribute = elementExpressionParser.appendAttributePath(subPath)
            validElementExpressionParser = elementExpressionParser
            /* eslint-disable no-empty */
          } catch {}
        }

        if (validElementExpressionParser === undefined) {
          throw new InvalidExpressionAttributePathError(attributePath)
        }

        parser.expressionAttributeNames = validElementExpressionParser.expressionAttributeNames
        expressionPath += validElementExpressionParser.expression
        // No need to go over the rest of the path
        attributeMatches = []

        break
      }
    }
  }

  if (parentAttribute.type === 'item') {
    throw new InvalidExpressionAttributePathError(attributePath)
  }

  parser.appendToExpression(options.size ? `size(${expressionPath})` : expressionPath)

  return options.size
    ? {
        path: parentAttribute.path,
        ...defaultNumberAttribute
      }
    : parentAttribute
}
