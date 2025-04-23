import { ExpressionParser } from '~/schema/actions/utils/expressionParser.js'
import type { Schema } from '~/schema/index.js'

export class PathParser<SCHEMA extends Schema = Schema> extends ExpressionParser<SCHEMA> {
  static override actionName = 'parsePath' as const

  constructor(schema: SCHEMA, expressionId = '') {
    super(schema, expressionId)
    this.expressionTokenPrefix = `p${this.expressionId}_`
  }

  override setId(nextId: string): this {
    this.expressionId = nextId
    this.expressionTokenPrefix = `p${nextId}_`
    return this
  }

  parse(attributes: string[]): this {
    const [firstAttribute, ...restAttributes] = attributes

    if (firstAttribute === undefined) {
      return this
    }

    this.appendAttributePath(firstAttribute)

    for (const attribute of restAttributes) {
      this.appendToExpression(', ')
      this.appendAttributePath(attribute)
    }

    return this
  }

  toCommandOptions(): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } {
    const { Expression: ProjectionExpression, ExpressionAttributeNames } = this.resolve()

    return {
      ProjectionExpression,
      ExpressionAttributeNames
    }
  }

  override clone(schema?: Schema): PathParser {
    const clonedParser = new PathParser(schema ?? this.schema, this.expressionId)

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeTokens = { ...this.expressionAttributeTokens }

    return clonedParser
  }
}
