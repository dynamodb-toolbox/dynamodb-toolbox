import { AnyAttribute } from '~/attributes/any/index.js'
import type { Attribute } from '~/attributes/index.js'
import { NumberAttribute } from '~/attributes/number/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { Schema } from '~/schema/index.js'
import { combineRegExp } from '~/utils/combineRegExp.js'

export type AppendAttributePathOptions = { size?: boolean }

export interface ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: string
  expressionAttributeNames: string[]
  clone: (schema?: Schema | Attribute) => ExpressionParser
  expression: string
  resetExpression: (str?: string) => void
  appendToExpression: (str: string) => void
  appendAttributePath: (path: string, options?: AppendAttributePathOptions) => Attribute
}

const defaultAnyAttribute = new AnyAttribute({
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  defaults: { key: undefined, put: undefined, update: undefined },
  links: { key: undefined, put: undefined, update: undefined },
  validators: { key: undefined, put: undefined, update: undefined },
  castAs: undefined
})

const defaultNumberAttribute = new NumberAttribute({
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  enum: undefined,
  transform: undefined,
  big: false,
  defaults: { key: undefined, put: undefined, update: undefined },
  links: { key: undefined, put: undefined, update: undefined },
  validators: { key: undefined, put: undefined, update: undefined }
})

const getInvalidExpressionAttributePathError = (attributePath: string): DynamoDBToolboxError =>
  new DynamoDBToolboxError('actions.invalidExpressionAttributePath', {
    message: `Unable to match expression attribute path with schema: ${attributePath}`,
    payload: { attributePath }
  })

const listIndexRegex = /\[(\d+)\]/g
const escapedStrRegex = /\['(.+)'\]/g
const regularStrRegex = /[\w#-]+(?=(\.|\[|$))/g
const pathRegex = combineRegExp(listIndexRegex, escapedStrRegex, regularStrRegex)

type MatchType = 'regularStr' | 'escapedStr' | 'listIndex'

export const appendAttributePath = (
  parser: ExpressionParser,
  attributePath: string,
  options: AppendAttributePathOptions = {}
): Attribute => {
  const { size = false } = options

  const expressionAttributePrefix = parser.expressionAttributePrefix
  let parentAttribute: Schema | Attribute = parser.schema
  let expressionPath = ''
  let attributeMatches = [...attributePath.matchAll(pathRegex)]
  let attributePathTail: string | undefined

  while (attributeMatches.length > 0) {
    const attributeMatch = attributeMatches.shift() as RegExpMatchArray

    // NOTE: Order of those matches follows those of combined regExps above
    const [match, listIndexMatch, escapedStrMatch, tail] = attributeMatch
    attributePathTail = tail

    const matchedKey: string = escapedStrMatch ?? listIndexMatch ?? match
    const matchType: MatchType =
      escapedStrMatch !== undefined
        ? 'escapedStr'
        : listIndexMatch !== undefined
          ? 'listIndex'
          : 'regularStr'

    switch (parentAttribute.type) {
      case 'any': {
        switch (matchType) {
          case 'listIndex': {
            expressionPath += `[${matchedKey}]`
            break
          }
          default: {
            const expressionAttributeNameIndex = parser.expressionAttributeNames.push(matchedKey)
            expressionPath += `.#${expressionAttributePrefix}${expressionAttributeNameIndex}`
          }
        }

        parentAttribute = new AnyAttribute({
          ...defaultAnyAttribute,
          path: [parentAttribute.path, match]
            .filter(Boolean)
            .join(matchType === 'regularStr' ? '.' : '')
        })
        break
      }
      case 'binary':
      case 'boolean':
      case 'number':
      case 'string':
      case 'set':
        throw getInvalidExpressionAttributePathError(attributePath)

      case 'record': {
        const keyAttribute = parentAttribute.keys
        const parsedKey = new Parser(keyAttribute).parse(matchedKey, { fill: false })

        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(parsedKey)
        expressionPath += `.#${expressionAttributePrefix}${expressionAttributeNameIndex}`

        parentAttribute = parentAttribute.elements
        break
      }
      case 'schema':
      case 'map': {
        const childAttribute = parentAttribute.attributes[matchedKey]
        if (!childAttribute) {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(
          childAttribute.savedAs ?? matchedKey
        )

        expressionPath +=
          parentAttribute.type === 'schema'
            ? `#${expressionAttributePrefix}${expressionAttributeNameIndex}`
            : `.#${expressionAttributePrefix}${expressionAttributeNameIndex}`
        parentAttribute = childAttribute
        break
      }
      case 'list': {
        if (matchType !== 'listIndex') {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        expressionPath += match
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
            parentAttribute = elementExpressionParser.appendAttributePath(subPath, options)
            validElementExpressionParser = elementExpressionParser
            break
            /* eslint-disable no-empty */
          } catch {}
        }

        if (validElementExpressionParser === undefined) {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        parser.expressionAttributeNames = validElementExpressionParser.expressionAttributeNames
        expressionPath += validElementExpressionParser.expression
        // No need to go over the rest of the path
        attributeMatches = []

        break
      }
    }
  }

  if (
    parentAttribute.type === 'schema' ||
    (attributePathTail !== undefined && attributePathTail.length > 0)
  ) {
    throw getInvalidExpressionAttributePathError(attributePath)
  }

  parser.appendToExpression(size ? `size(${expressionPath})` : expressionPath)

  return size
    ? new NumberAttribute({ ...defaultNumberAttribute, path: parentAttribute.path })
    : parentAttribute
}
