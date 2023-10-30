import type { Schema, Attribute } from 'v1/schema'

import { appendAttributePath, ExpressionParser } from 'v1/commands/expression/expressionParser'

export class ProjectionParser implements ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: `p${string}_`
  expressionAttributeNames: string[]
  expression: string
  id: string

  constructor(schema: Schema | Attribute, id = '') {
    this.schema = schema
    this.expressionAttributePrefix = `p${id}_`
    this.expressionAttributeNames = []
    this.expression = ''
    this.id = id
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

  /**
   * @debt refactor "factorize with other expressions"
   */
  toCommandOptions = (): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } => {
    const ExpressionAttributeNames: Record<string, string> = {}

    this.expressionAttributeNames.forEach((expressionAttributeName, index) => {
      ExpressionAttributeNames[
        `#${this.expressionAttributePrefix}${index + 1}`
      ] = expressionAttributeName
    })

    const ProjectionExpression = this.expression

    return {
      ExpressionAttributeNames,
      ProjectionExpression
    }
  }

  clone = (schema?: Schema | Attribute): ProjectionParser => {
    const clonedParser = new ProjectionParser(schema ?? this.schema, this.id)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
