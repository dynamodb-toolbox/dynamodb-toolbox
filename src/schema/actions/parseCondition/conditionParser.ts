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

  expressionAttributePrefix: `c${string}_`
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string
  id: string

  constructor(schema: SCHEMA, id = '') {
    super(schema)

    this.id = id
    this.expressionAttributePrefix = `c${id}_`

    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.expression = ''
  }

  setId(nextId: string): this {
    this.id = nextId
    this.expressionAttributePrefix = `c${nextId}_`
    return this
  }

  resetExpression(initialStr = ''): this {
    this.expression = initialStr
    return this
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

  appendToExpression(conditionExpressionPart: string): this {
    this.expression += conditionExpressionPart
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

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
