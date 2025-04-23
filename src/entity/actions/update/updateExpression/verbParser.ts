import { appendAttributePath } from '~/schema/actions/utils/appendAttributePath.js'
import type {
  AppendAttributePathOptions,
  ExpressionParser
} from '~/schema/actions/utils/appendAttributePath.js'
import type { Schema, TransformedValue, ValidValue } from '~/schema/index.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

import { $GET, isGetting } from '../symbols/index.js'
import type { ReferenceExtension, UpdateItemInputExtension } from '../types.js'
import type { ParsedUpdate } from './type.js'

export class UpdateExpressionVerbParser implements ExpressionParser {
  schema: Schema
  expression: ExpressionParser['expression']
  expressionAttributeNames: ExpressionParser['expressionAttributeNames']
  expressionAttributeNameTokens: ExpressionParser['expressionAttributeNameTokens']

  id: string
  verbPrefix: 's' | 'r' | 'a' | 'd'
  expressionAttributePrefix: `${'s' | 'r' | 'a' | 'd'}${string}_`
  expressionAttributeValues: unknown[]

  constructor(schema: Schema, verbPrefix: 's' | 'r' | 'a' | 'd', id = '') {
    this.schema = schema
    this.expression = []
    this.expressionAttributeNames = {}
    this.expressionAttributeNameTokens = {}

    this.verbPrefix = verbPrefix
    this.expressionAttributePrefix = `${verbPrefix}${id}_`
    this.expressionAttributeValues = []
    this.id = id
  }

  resetExpression(...expression: (string | symbol)[]): this {
    this.expression = expression
    return this
  }

  getToken(expressionPart: string): symbol {
    const prevToken = this.expressionAttributeNameTokens[expressionPart]

    if (prevToken !== undefined) {
      return prevToken
    }

    const token = Symbol(expressionPart)
    this.expressionAttributeNames[token] = expressionPart
    this.expressionAttributeNameTokens[expressionPart] = token

    return token
  }

  appendAttributePath = (attributePath: string, options: AppendAttributePathOptions = {}): Schema =>
    appendAttributePath(this, attributePath, options)

  appendAttributeValue = (_: Schema, attributeValue: unknown): void => {
    const expressionAttributeValueIndex = this.expressionAttributeValues.push(attributeValue)

    this.appendToExpression(`:${this.expressionAttributePrefix}${expressionAttributeValueIndex}`)
  }

  appendToExpression(...expressionParts: (string | symbol)[]): this {
    this.expression.push(...expressionParts)
    return this
  }

  beginNewInstruction = () => {
    if (this.expression.length > 0) {
      this.appendToExpression(', ')
    }
  }

  appendValidAttributePath = (validAttributePath: (string | number)[]): void => {
    validAttributePath.forEach((pathPart, index) => {
      if (isString(pathPart)) {
        if (index > 0) {
          this.appendToExpression('.')
        }

        this.appendToExpression(this.getToken(pathPart))
      }

      if (isNumber(pathPart)) {
        this.appendToExpression(`[${pathPart}]`)
      }
    })
  }

  appendValidAttributeValue = (
    validAttributeValue: TransformedValue<
      Schema,
      { mode: 'update'; extension: UpdateItemInputExtension }
    >
  ): void => {
    if (isGetting(validAttributeValue)) {
      // TODO: Fix this cast
      const [expression, fallback] = validAttributeValue[$GET] as [
        string,
        ValidValue<Schema, { mode: 'update'; extension: ReferenceExtension }> | undefined
      ]

      if (fallback === undefined) {
        this.appendAttributePath(expression)
        return
      }

      if (fallback !== undefined) {
        this.appendToExpression('if_not_exists(')
        this.appendAttributePath(expression)
        this.appendToExpression(', ')
        this.appendValidAttributeValue(fallback)
        this.appendToExpression(')')
        return
      }
    }

    const expressionAttributeValueIndex = this.expressionAttributeValues.push(validAttributeValue)

    this.appendToExpression(`:${this.expressionAttributePrefix}${expressionAttributeValueIndex}`)
  }

  /**
   * @debt refactor "factorize with other expressions"
   */
  toCommandOptions = (): ParsedUpdate => {
    const ExpressionAttributeNames: ParsedUpdate['ExpressionAttributeNames'] = {}

    const stringTokens: Record<symbol, string> = {}
    let cursor = 1
    let UpdateExpression = ''

    for (const expressionPart of this.expression) {
      if (isString(expressionPart)) {
        UpdateExpression += expressionPart
        continue
      }

      let stringToken = stringTokens[expressionPart]

      if (stringToken === undefined) {
        stringToken = `#${this.expressionAttributePrefix}${cursor}`
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ExpressionAttributeNames[stringToken] = this.expressionAttributeNames[expressionPart]!
        stringTokens[expressionPart] = stringToken
        cursor++
      }

      UpdateExpression += stringToken
    }

    const ExpressionAttributeValues: ParsedUpdate['ExpressionAttributeValues'] = {}
    this.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
      ExpressionAttributeValues[`:${this.expressionAttributePrefix}${index + 1}`] =
        expressionAttributeValue
    })

    return {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression
    }
  }

  clone = (schema?: Schema): UpdateExpressionVerbParser => {
    const clonedParser = new UpdateExpressionVerbParser(
      schema ?? this.schema,
      this.verbPrefix,
      this.id
    )

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeNameTokens = { ...this.expressionAttributeNameTokens }

    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]

    return clonedParser
  }
}
