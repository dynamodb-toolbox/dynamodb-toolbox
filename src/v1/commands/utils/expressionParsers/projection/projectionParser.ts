import type { Schema, Attribute } from 'v1/schema'

import { appendAttributePath, ExpressionParser } from '../utils/appendAttributePath'
import { toCommandOptions } from './toCommandOptions'

export class ProjectionParser implements ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: 'p'
  expressionAttributeNames: string[]
  expression: string

  constructor(schema: Schema | Attribute) {
    this.schema = schema
    this.expressionAttributePrefix = 'p'
    this.expressionAttributeNames = []
    this.expression = ''
  }

  resetExpression = (initialStr = '') => {
    this.expression = initialStr
  }

  appendAttributePath = (attributePath: string, options: { size?: boolean } = {}): Attribute =>
    appendAttributePath(this, attributePath, options)

  appendToExpression = (projectionExpressionPart: string) => {
    this.expression += projectionExpressionPart
  }

  parseProjection = (attributes: string[]): void => {
    const [firstAttribute, ...restAttributes] = attributes
    this.appendAttributePath(firstAttribute)

    for (const attribute of restAttributes) {
      this.appendToExpression(', ')
      this.appendAttributePath(attribute)
    }
  }

  toCommandOptions = (): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } => toCommandOptions(this)

  clone = (schema?: Schema | Attribute): ProjectionParser => {
    const clonedParser = new ProjectionParser(schema ?? this.schema)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
