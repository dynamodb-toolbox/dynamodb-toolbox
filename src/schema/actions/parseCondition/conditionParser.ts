import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { appendAttributePath } from '~/schema/actions/utils/appendAttributePath.js'
import type {
  AppendAttributePathOptions,
  ExpressionParser
} from '~/schema/actions/utils/appendAttributePath.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'

import { appendAttributeValue } from './appendAttributeValue.js'
import type { AppendAttributeValueOptions } from './appendAttributeValue.js'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath.js'
import type { SchemaCondition } from './condition.js'
import { parseCondition } from './parseCondition/index.js'
import { toCommandOptions } from './toCommandOptions.js'

export class ConditionParser<SCHEMA extends Schema = Schema>
  extends SchemaAction<SCHEMA>
  implements ExpressionParser
{
  static override actionName = 'parseCondition' as const

  expression: ExpressionParser['expression']
  expressionAttributeNames: ExpressionParser['expressionAttributeNames']
  expressionAttributeNameTokens: ExpressionParser['expressionAttributeNameTokens']

  id: string
  expressionAttributePrefix: `c${string}_`
  expressionAttributeValues: unknown[]

  constructor(schema: SCHEMA, id = '') {
    super(schema)

    this.expression = []
    this.expressionAttributeNames = {}
    this.expressionAttributeNameTokens = {}

    this.id = id
    this.expressionAttributePrefix = `c${id}_`
    this.expressionAttributeValues = []
  }

  setId(nextId: string): this {
    this.id = nextId
    this.expressionAttributePrefix = `c${nextId}_`
    return this
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

  appendAttributePath(attributePath: string, options: AppendAttributePathOptions = {}): Schema {
    return appendAttributePath(this, attributePath, options)
  }

  appendAttributeValue(
    schema: Schema,
    expressionAttributeValue: unknown,
    options: AppendAttributeValueOptions = {}
  ): this {
    appendAttributeValue(this, schema, expressionAttributeValue, options)
    return this
  }

  appendAttributeValueOrPath(
    schema: Schema,
    expressionAttributeValueOrPath: unknown,
    options: AppendAttributePathOptions & AppendAttributeValueOptions = {}
  ): this {
    appendAttributeValueOrPath(this, schema, expressionAttributeValueOrPath, options)
    return this
  }

  appendToExpression(...expressionParts: (string | symbol)[]): this {
    this.expression.push(...expressionParts)
    return this
  }

  parse(condition: SchemaCondition): this {
    parseCondition(this, condition)
    return this
  }

  toCommandOptions(): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } {
    return toCommandOptions(this)
  }

  clone(schema?: Schema): ConditionParser {
    const clonedParser = new ConditionParser(schema ?? this.schema, this.id)

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeNameTokens = { ...this.expressionAttributeNameTokens }

    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]

    return clonedParser
  }
}
