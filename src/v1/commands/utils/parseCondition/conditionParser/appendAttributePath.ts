import type { AnyAttribute, Attribute, PrimitiveAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'
import { isString } from 'v1/utils/validation/isString'

import { ConditionParser } from './conditionParser'

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

class InvalidConditionAttributePathError extends DynamoDBToolboxError<'commands.invalidConditionAttributePath'> {
  constructor(attributePath: string) {
    super('commands.invalidConditionAttributePath', {
      message: `Unable to match condition attribute path with item: ${attributePath}`,
      payload: { attributePath }
    })
  }
}

const isListAccessor = (accessor: string): accessor is `[${number}]` => /\[\d+\]/g.test(accessor)

export const isAttributePath = (candidate: unknown): candidate is { attr: string } =>
  isObject(candidate) && 'attr' in candidate && isString(candidate.attr)

export const appendAttributePath = (
  conditionParser: ConditionParser,
  attributePath: string,
  options: { size?: boolean } = {}
): Attribute => {
  let conditionExpressionPath = ''
  let parentAttribute: Attribute

  const [rootMatch, ...attributeMatches] = attributePath.matchAll(/\[(\d+)\]|\w+(?=(\.|$|\[))/g)
  if (rootMatch === undefined) {
    throw new InvalidConditionAttributePathError(attributePath)
  }

  const [rootAttributeAccessor] = rootMatch
  const rootAttribute = conditionParser.item.attributes[rootAttributeAccessor]
  if (rootAttribute === undefined) {
    throw new InvalidConditionAttributePathError(attributePath)
  }

  parentAttribute = rootAttribute

  const rootExpressionAttributeNameIndex = conditionParser.expressionAttributeNames.push(
    rootAttribute.savedAs ?? rootAttributeAccessor
  )
  conditionExpressionPath += `#${rootExpressionAttributeNameIndex}`

  for (const attributeMatch of attributeMatches) {
    const childAttributeAccessor = attributeMatch[0]

    switch (parentAttribute.type) {
      case 'binary':
      case 'boolean':
      case 'number':
      case 'string':
      case 'set':
        throw new InvalidConditionAttributePathError(attributePath)
      case 'any': {
        const isChildAttributeInList = isListAccessor(childAttributeAccessor)

        if (isChildAttributeInList) {
          conditionExpressionPath += childAttributeAccessor
        } else {
          const expressionAttributeNameIndex = conditionParser.expressionAttributeNames.push(
            childAttributeAccessor
          )
          conditionExpressionPath += `.#${expressionAttributeNameIndex}`
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
        // TODO: Validate key
        // const key = parseValue(parentAttribute.keys, attributeMatch[0])
        const expressionAttributeNameIndex = conditionParser.expressionAttributeNames.push(
          childAttributeAccessor
        )
        conditionExpressionPath += `.#${expressionAttributeNameIndex}`

        parentAttribute = parentAttribute.elements
        break
      }
      case 'map': {
        const childAttribute = parentAttribute.attributes[childAttributeAccessor]
        if (!childAttribute) {
          throw new InvalidConditionAttributePathError(attributePath)
        }

        const expressionAttributeNameIndex = conditionParser.expressionAttributeNames.push(
          childAttribute.savedAs ?? childAttributeAccessor
        )
        conditionExpressionPath += `.#${expressionAttributeNameIndex}`

        parentAttribute = childAttribute
        break
      }
      case 'list': {
        if (!isListAccessor(childAttributeAccessor)) {
          throw new InvalidConditionAttributePathError(attributePath)
        }

        conditionExpressionPath += childAttributeAccessor

        parentAttribute = parentAttribute.elements
        break
      }
      case 'anyOf':
        // TODO
        throw new InvalidConditionAttributePathError(attributePath)
    }
  }

  conditionParser.appendToConditionExpression(
    options.size ? `size(${conditionExpressionPath})` : conditionExpressionPath
  )

  return options.size
    ? {
        path: parentAttribute.path,
        ...defaultNumberAttribute
      }
    : parentAttribute
}
