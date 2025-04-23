import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

import { appendAttributePath } from './appendAttributePath.js'

export type AppendAttributePathOptions = { size?: boolean }

export class ExpressionParser<SCHEMA extends Schema = Schema> extends SchemaAction<SCHEMA> {
  expressionId: string
  expressionTokenPrefix: string
  expression: (string | symbol)[]
  expressionAttributeNames: Record<symbol, string>
  expressionAttributeTokens: Record<string, symbol>

  constructor(schema: SCHEMA, expressionId = '') {
    super(schema)

    this.expressionId = expressionId
    this.expressionTokenPrefix = `${expressionId}_`
    this.expression = []
    this.expressionAttributeNames = {}
    this.expressionAttributeTokens = {}
  }

  setId(nextId: string): this {
    this.expressionId = nextId
    this.expressionTokenPrefix = `${nextId}_`
    return this
  }

  resetExpression(...expression: (string | symbol)[]): this {
    this.expression = expression
    return this
  }

  appendToExpression(...expressionParts: (string | symbol)[]): void {
    this.expression.push(...expressionParts)
  }

  tokenize(expressionAttributeName: string): symbol {
    const prevToken = this.expressionAttributeTokens[expressionAttributeName]

    if (prevToken !== undefined) {
      return prevToken
    }

    const token = Symbol(expressionAttributeName)
    this.expressionAttributeNames[token] = expressionAttributeName
    this.expressionAttributeTokens[expressionAttributeName] = token

    return token
  }

  appendAttributePath(attributePath: string, options: AppendAttributePathOptions = {}): Schema {
    return appendAttributePath(this, attributePath, options)
  }

  clone(schema?: Schema): ExpressionParser {
    const clonedParser = new ExpressionParser(schema ?? this.schema)

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeTokens = { ...this.expressionAttributeTokens }

    return clonedParser
  }

  resolve(): { Expression: string; ExpressionAttributeNames: Record<string, string> } {
    let Expression = ''
    const ExpressionAttributeNames: Record<string, string> = {}

    const strTokens: Record<symbol, string> = {}
    let cursor = 1

    for (const expressionPart of this.expression) {
      if (isString(expressionPart)) {
        Expression += expressionPart
        continue
      }

      let stringToken = strTokens[expressionPart]

      if (stringToken === undefined) {
        stringToken = `#${this.expressionTokenPrefix}${cursor}`
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ExpressionAttributeNames[stringToken] = this.expressionAttributeNames[expressionPart]!
        strTokens[expressionPart] = stringToken
        cursor++
      }

      Expression += stringToken
    }

    return { Expression, ExpressionAttributeNames }
  }
}
