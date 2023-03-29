import { AnyAttribute, Attribute } from 'v1/item'
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
    // TODO
    throw new Error()
  }

  const [rootAttributeAccessor] = rootMatch
  const rootAttribute = conditionParser.item.attributes[rootAttributeAccessor]
  if (rootAttribute === undefined) {
    // TODO
    throw new Error()
  }

  parentAttribute = rootAttribute

  const rootExpressionAttributeNameIndex = conditionParser.expressionAttributeNames.push(
    rootAttribute.savedAs ?? rootAttributeAccessor
  )
  conditionExpressionPath += `#${rootExpressionAttributeNameIndex}`

  for (const attributeMatch of attributeMatches) {
    const childAttributeAccessor = attributeMatch[0]

    switch (parentAttribute.type) {
      case 'constant':
      case 'binary':
      case 'boolean':
      case 'number':
      case 'string':
      case 'set':
        // We don't allow nested paths on those types
        // TODO
        throw new Error()
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
          // TODO
          throw new Error()
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
          // TODO
          throw new Error()
        }

        conditionExpressionPath += childAttributeAccessor

        parentAttribute = parentAttribute.elements
        break
      }
      case 'anyOf':
        // TODO
        throw new Error()
    }
  }

  conditionParser.conditionExpression += options.size
    ? `size(${conditionExpressionPath})`
    : conditionExpressionPath

  return parentAttribute
}
