import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema } from 'v1/schema'
import type { Attribute } from 'v1/schema/attributes'
import type { Condition } from 'v1/operations/types'

import {
  ExpressionParser,
  appendAttributePath,
  AppendAttributePathOptions
} from '../../expressionParser'
import { appendAttributeValue, AppendAttributeValueOptions } from './appendAttributeValue'
import { appendAttributeValueOrPath } from './appendAttributeValueOrPath'
import { parseCondition } from './parseCondition'
import { toCommandOptions } from './toCommandOptions'

export class ConditionParser implements ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: `c${string}_`
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string
  id: string

  constructor(schema: Schema | Attribute, id = '') {
    this.schema = schema
    this.expressionAttributePrefix = `c${id}_`
    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.expression = ''
    this.id = id
  }

  resetExpression = (initialStr = '') => {
    this.expression = initialStr
  }

  appendAttributePath = (
    attributePath: string,
    options: AppendAttributePathOptions = {}
  ): Attribute => appendAttributePath(this, attributePath, options)

  appendAttributeValue = (
    attribute: Attribute,
    expressionAttributeValue: unknown,
    options: AppendAttributeValueOptions = {}
  ): void => appendAttributeValue(this, attribute, expressionAttributeValue, options)

  appendAttributeValueOrPath = (
    attribute: Attribute,
    expressionAttributeValueOrPath: unknown,
    options: AppendAttributePathOptions & AppendAttributeValueOptions = {}
  ): void => appendAttributeValueOrPath(this, attribute, expressionAttributeValueOrPath, options)

  appendToExpression = (conditionExpressionPart: string) => {
    this.expression += conditionExpressionPart
  }

  parseCondition = (condition: Condition): void => parseCondition(this, condition)

  toCommandOptions = (): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } => toCommandOptions(this)

  clone = (schema?: Schema | Attribute): ConditionParser => {
    const clonedParser = new ConditionParser(schema ?? this.schema, this.id)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
