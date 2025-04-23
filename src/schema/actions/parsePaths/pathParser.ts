import { appendAttributePath } from '~/schema/actions/utils/appendAttributePath.js'
import type {
  AppendAttributePathOptions,
  ExpressionParser
} from '~/schema/actions/utils/appendAttributePath.js'
import type { Schema } from '~/schema/index.js'
import { SchemaAction } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

export class PathParser<SCHEMA extends Schema = Schema>
  extends SchemaAction<SCHEMA>
  implements ExpressionParser
{
  static override actionName = 'parsePath' as const

  expression: ExpressionParser['expression']
  expressionAttributeNames: ExpressionParser['expressionAttributeNames']
  expressionAttributeNameTokens: ExpressionParser['expressionAttributeNameTokens']

  id: string
  expressionAttributePrefix: `p${string}_`

  constructor(schema: SCHEMA, id = '') {
    super(schema)

    this.expression = []
    this.expressionAttributeNames = {}
    this.expressionAttributeNameTokens = {}

    this.id = id
    this.expressionAttributePrefix = `p${id}_`
  }

  setId(nextId: string): this {
    this.id = nextId
    this.expressionAttributePrefix = `p${nextId}_`
    return this
  }

  resetExpression(...expression: (string | symbol)[]): this {
    this.expression = expression
    return this
  }

  appendAttributePath(attributePath: string, options: AppendAttributePathOptions = {}): Schema {
    return appendAttributePath(this, attributePath, options)
  }

  appendToExpression(...expressionParts: (string | symbol)[]): this {
    this.expression.push(...expressionParts)
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
    const ExpressionAttributeNames: Record<string, string> = {}

    const stringTokens: Record<symbol, string> = {}
    let cursor = 1
    let ProjectionExpression = ''

    for (const expressionPart of this.expression) {
      if (isString(expressionPart)) {
        ProjectionExpression += expressionPart
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

      ProjectionExpression += stringToken
    }

    return {
      ExpressionAttributeNames,
      ProjectionExpression
    }
  }

  clone(schema?: Schema): PathParser {
    const clonedParser = new PathParser(schema ?? this.schema, this.id)

    clonedParser.expression = [...this.expression]
    clonedParser.expressionAttributeNames = { ...this.expressionAttributeNames }
    clonedParser.expressionAttributeNameTokens = { ...this.expressionAttributeNameTokens }

    return clonedParser
  }
}
