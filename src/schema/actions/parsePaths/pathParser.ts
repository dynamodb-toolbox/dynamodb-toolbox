import { Schema, SchemaAction } from '~/schema/index.js'
import type { Attribute } from '~/schema/attributes/index.js'
import {
  appendAttributePath,
  ExpressionParser,
  AppendAttributePathOptions
} from '~/schema/actions/utils/appendAttributePath.js'

export class PathParser<SCHEMA extends Schema | Attribute = Schema | Attribute>
  extends SchemaAction<SCHEMA>
  implements ExpressionParser {
  expressionAttributePrefix: `p${string}_`
  expressionAttributeNames: string[]
  expression: string
  id: string

  constructor(schema: SCHEMA, id = '') {
    super(schema)

    this.expressionAttributePrefix = `p${id}_`
    this.expressionAttributeNames = []
    this.expression = ''
    this.id = id
  }

  setId(nextId: string): this {
    this.id = nextId
    this.expressionAttributePrefix = `p${nextId}_`
    return this
  }

  resetExpression(initialStr = ''): this {
    this.expression = initialStr
    return this
  }

  appendAttributePath(attributePath: string, options: AppendAttributePathOptions = {}): Attribute {
    return appendAttributePath(this, attributePath, options)
  }

  appendToExpression(projectionExpressionPart: string): this {
    this.expression += projectionExpressionPart
    return this
  }

  parse(attributes: string[]): this {
    const [firstAttribute, ...restAttributes] = attributes
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

  clone(schema?: Schema | Attribute): PathParser {
    const clonedParser = new PathParser(schema ?? this.schema, this.id)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
