import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { AppendAttributePathOptions } from '~/schema/actions/utils/expressionParser.js'
import { ExpressionParser } from '~/schema/actions/utils/expressionParser.js'
import type { Schema } from '~/schema/index.js'

import type { AppendAttributeValueOptions } from './appendAttributeValue.js'
import { appendAttributeValue } from './appendAttributeValue.js'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath.js'
import type { SchemaCondition } from './condition.js'
import { parseCondition } from './parseCondition/index.js'

export class ConditionParser<SCHEMA extends Schema = Schema> extends ExpressionParser<SCHEMA> {
  static override actionName = 'parseCondition' as const

  expressionAttributeValues: unknown[]

  constructor(schema: SCHEMA, expressionId = '') {
    super(schema, expressionId)
    this.expressionTokenPrefix = `c${this.expressionId}_`
    this.expressionAttributeValues = []
  }

  override setId(nextId: string): this {
    this.expressionId = nextId
    this.expressionTokenPrefix = `c${nextId}_`
    return this
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

  parse(condition: SchemaCondition): this {
    parseCondition(this, condition)
    return this
  }

  toCommandOptions(): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } {
    const { Expression: ConditionExpression, ExpressionAttributeNames } = this.resolve()

    const ExpressionAttributeValues: Record<string, NativeAttributeValue> = {}
    this.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
      ExpressionAttributeValues[`:${this.expressionTokenPrefix}${index + 1}`] =
        expressionAttributeValue
    })

    return {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    }
  }

  override clone(schema?: Schema): ConditionParser {
    const clonedParser = new ConditionParser(schema ?? this.schema, this.expressionId)

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeTokens = { ...this.expressionAttributeTokens }

    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]

    return clonedParser
  }
}
