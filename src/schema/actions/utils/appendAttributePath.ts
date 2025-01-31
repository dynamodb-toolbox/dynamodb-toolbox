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
  castAs: undefined,
  transform: undefined,
  defaults: { key: undefined, put: undefined, update: undefined },
  links: { key: undefined, put: undefined, update: undefined },
  validators: { key: undefined, put: undefined, update: undefined }
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

  const expressionAttrPrefix = parser.expressionAttributePrefix
  let parentAttr: Schema | Attribute = parser.schema
  let expressionPath = ''
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
            expressionPath += `[${matchedKey}]`
            break
          }
          default: {
            const expressionAttributeNameIndex = parser.expressionAttributeNames.push(matchedKey)
            expressionPath += `${root ? '' : '.'}#${expressionAttrPrefix}${expressionAttributeNameIndex}`
          }
        }

        parentAttr = new AnyAttribute({
          ...defaultAnyAttribute,
          path: [parentAttr.path, match].filter(Boolean).join(matchType === 'regularStr' ? '.' : '')
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
        const keyAttribute = parentAttr.keys
        // TODO: Maybe re-introduce constraints to record key attributes
        const parsedKey = new Parser(keyAttribute).parse(matchedKey, { fill: false }) as string

        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(parsedKey)
        expressionPath += `${root ? '' : '.'}#${expressionAttrPrefix}${expressionAttributeNameIndex}`

        parentAttr = parentAttr.elements
        break
      }
      case 'schema':
      case 'map': {
        const childAttribute = parentAttr.attributes[matchedKey]
        if (!childAttribute) {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        const expressionAttributeNameIndex = parser.expressionAttributeNames.push(
          childAttribute.savedAs ?? matchedKey
        )

        expressionPath += `${root ? '' : '.'}#${expressionAttrPrefix}${expressionAttributeNameIndex}`
        parentAttr = childAttribute
        break
      }
      case 'list': {
        if (matchType !== 'listIndex') {
          throw getInvalidExpressionAttributePathError(attributePath)
        }

        expressionPath += match
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
        expressionPath += `${root ? '' : '.'}${validElementExpressionParser.expression}`
        // No need to go over the rest of the path
        attrMatches = []

        break
      }
    }

    root = false
  }

  if (parentAttr.type === 'schema' || (attrPathTail !== undefined && attrPathTail.length > 0)) {
    throw getInvalidExpressionAttributePathError(attributePath)
  }

  parser.appendToExpression(size ? `size(${expressionPath})` : expressionPath)

  return size
    ? new NumberAttribute({ ...defaultNumberAttribute, path: parentAttr.path })
    : parentAttr
}
