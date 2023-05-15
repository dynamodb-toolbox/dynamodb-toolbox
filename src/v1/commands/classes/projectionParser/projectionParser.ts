import type { Item, Attribute } from 'v1/item'

import { appendAttributePath } from '../utils/appendAttributePath'
import { toCommandOptions } from './toCommandOptions'

export class ProjectionParser {
  schema: Attribute | Item
  expressionAttributeNames: string[]
  expression: string

  constructor(schema: Attribute | Item) {
    this.schema = schema
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
    for (const attribute of attributes) {
      this.appendAttributePath(attribute)
    }
  }

  toCommandOptions = (): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } => toCommandOptions(this)

  clone = (schema?: Attribute | Item): ProjectionParser => {
    const clonedAttributeParser = new ProjectionParser(schema ?? this.schema)

    clonedAttributeParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedAttributeParser.expression = this.expression

    return clonedAttributeParser
  }
}
