import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import { AnySchema } from '~/schema/any/schema.js'
import type { Schema } from '~/schema/index.js'
import { NumberSchema } from '~/schema/number/schema.js'
import { combineRegExp } from '~/utils/combineRegExp.js'

import type { AppendAttributePathOptions, ExpressionParser } from './expressionParser.js'

const getInvalidExpressionAttributePathError = (attributePath: string): DynamoDBToolboxError =>
  new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
    message: `Unable to match expression attribute path with schema: ${attributePath}`,
    payload: { attributePath }
  })

const listIndexRegex = /\[(\d+)\]/g
const escapedStrRegex = /\['(.+)'\]/g
const regularStrRegex = /[\w#@-]+(?=(\.|\[|$))/g
const pathRegex = combineRegExp(listIndexRegex, escapedStrRegex, regularStrRegex)

type MatchType = 'regularStr' | 'escapedStr' | 'listIndex'

export const appendAttributePath = (
  parser: ExpressionParser,
  attributePath: string,
  options: AppendAttributePathOptions = {}
): Schema => {
  const { size = false } = options

  let parentAttr: Schema = parser.schema
  let attrMatches = [...attributePath.matchAll(pathRegex)]
  let attrPathTail: string | undefined

  let root = true
  while (attrMatches.length > 0) {
    const attrMatch = attrMatches.shift() as RegExpMatchArray

    // NOTE: Order of those matches follows those of combined regExps above
    const [match, listIndexMatch, escapedStrMatch, tail] = attrMatch
    attrPathTail = tail

    const matchedKey: string = escapedStrMatch ?? listIndexMatch ?? match
    const matchType: MatchType =
      escapedStrMatch !== undefined
        ? 'escapedStr'
        : listIndexMatch !== undefined
          ? 'listIndex'
          : 'regularStr'

    switch (parentAttr.type) {
      case 'any': {
        switch (matchType) {
          case 'listIndex': {
            parser.appendToExpression(`[${matchedKey}]`)
            break
          }
          default: {
            const matchedKeyToken = parser.tokenize(matchedKey)
            if (!root) {
              parser.appendToExpression('.')
            }
            parser.appendToExpression(matchedKeyToken)
          }
        }

        parentAttr = new AnySchema({ required: 'never' })
        break
      }
      case 'binary':
      case 'boolean':
      case 'number':
      case 'string':
      case 'set':
        throw getInvalidExpressionAttributePathError(attributePath)

      case 'record': {
        const keyAttribute = parentAttr.keys
        const parsedKey = new Parser(keyAttribute).parse(matchedKey, { fill: false })
        const parsedKeyToken = parser.tokenize(parsedKey)

        if (!root) {
          parser.appendToExpression('.')
        }
        parser.appendToExpression(parsedKeyToken)

        parentAttr = parentAttr.elements
        break
      }
      case 'item':
      case 'map': {
        const childAttribute = parentAttr.attributes[matchedKey]
        if (!childAttribute) {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        const attrName = childAttribute.props.savedAs ?? matchedKey
        const attrNameToken = parser.tokenize(attrName)

        if (!root) {
          parser.appendToExpression('.')
        }
        parser.appendToExpression(attrNameToken)

        parentAttr = childAttribute
        break
      }
      case 'list': {
        if (matchType !== 'listIndex') {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        parser.appendToExpression(match)

        parentAttr = parentAttr.elements
        break
      }
      case 'anyOf': {
        let validElementExpressionParser: ExpressionParser | undefined = undefined
        const subPath = attributePath.slice(attrMatch.index)

        for (const element of parentAttr.elements) {
          try {
            parentAttr = element
            const elementExpressionParser = parser.clone(element)
            elementExpressionParser.resetExpression()
            parentAttr = elementExpressionParser.appendAttributePath(subPath, options)
            validElementExpressionParser = elementExpressionParser
            break
            /* eslint-disable no-empty */
          } catch {}
        }

        if (validElementExpressionParser === undefined) {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        parser.expressionAttributeNames = validElementExpressionParser.expressionAttributeNames
        parser.expressionAttributeTokens = validElementExpressionParser.expressionAttributeTokens
        if (!root) {
          parser.appendToExpression('.')
        }
        parser.appendToExpression(...validElementExpressionParser.expression)
        // No need to go over the rest of the path
        attrMatches = []

        break
      }
    }

    root = false
  }

  if (root || (attrPathTail !== undefined && attrPathTail.length > 0)) {
    throw getInvalidExpressionAttributePathError(attributePath)
  }

  if (size) {
    parser.expression.unshift('size(')
    parser.appendToExpression(')')
  }

  return size ? new NumberSchema({ required: 'never' }) : parentAttr
}
