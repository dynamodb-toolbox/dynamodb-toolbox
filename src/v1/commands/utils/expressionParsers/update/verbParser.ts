import type { Schema, Attribute } from 'v1/schema'
import { isNumber, isString } from 'v1/utils/validation'

import { ExpressionParser, appendAttributePath } from '../utils/appendAttributePath'
import type { ParsedUpdate } from './type'

export class UpdateVerbParser implements ExpressionParser {
  schema: Schema | Attribute
  expressionAttributePrefix: 's' | 'r' | 'a' | 'd'
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string

  constructor(schema: Schema | Attribute, expressionAttributePrefix: 's' | 'r' | 'a' | 'd') {
    this.schema = schema
    this.expressionAttributePrefix = expressionAttributePrefix
    this.expressionAttributeNames = []
    this.expressionAttributeValues = []
    this.expression = ''
  }

  resetExpression = (initialStr = '') => {
    this.expression = initialStr
  }

  appendAttributePath = (attributePath: string): Attribute =>
    appendAttributePath(this, attributePath)

  appendAttributeValue = (_: Attribute, attributeValue: unknown): void => {
    const expressionAttributeValueIndex = this.expressionAttributeValues.push(attributeValue)

    this.appendToExpression(`:${this.expressionAttributePrefix}${expressionAttributeValueIndex}`)
  }

  appendValidAttributePath = (validAttributePath: (string | number)[]): void => {
    if (this.expression !== '') {
      this.appendToExpression(', ')
    }

    validAttributePath.forEach((pathPart, index) => {
      if (isString(pathPart)) {
        let pathPartIndex = this.expressionAttributeNames.findIndex(value => value === pathPart)

        if (pathPartIndex !== -1) {
          pathPartIndex += 1
        } else {
          pathPartIndex = this.expressionAttributeNames.push(pathPart)
        }

        if (index > 0) {
          this.appendToExpression('.')
        }

        this.appendToExpression(`#${this.expressionAttributePrefix}${pathPartIndex}`)
      }

      if (isNumber(pathPart)) {
        this.appendToExpression(`[${pathPart}]`)
      }
    })
  }

  appendValidAttributeValue = (validAttributeValue: unknown): void => {
    const expressionAttributeValueIndex = this.expressionAttributeValues.push(validAttributeValue)

    this.appendToExpression(`:${this.expressionAttributePrefix}${expressionAttributeValueIndex}`)
  }

  appendToExpression = (conditionExpressionPart: string) => {
    this.expression += conditionExpressionPart
  }

  /**
   * @debt refactor "factorize with other expressions"
   */
  toCommandOptions = (): ParsedUpdate => {
    const ExpressionAttributeNames: ParsedUpdate['ExpressionAttributeNames'] = {}

    this.expressionAttributeNames.forEach((expressionAttributeName, index) => {
      ExpressionAttributeNames[
        `#${this.expressionAttributePrefix}${index + 1}`
      ] = expressionAttributeName
    })

    const ExpressionAttributeValues: ParsedUpdate['ExpressionAttributeValues'] = {}
    this.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
      ExpressionAttributeValues[
        `:${this.expressionAttributePrefix}${index + 1}`
      ] = expressionAttributeValue
    })

    const UpdateExpression = this.expression

    return {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      UpdateExpression
    }
  }

  clone = (schema?: Schema | Attribute): UpdateVerbParser => {
    const clonedParser = new UpdateVerbParser(schema ?? this.schema, this.expressionAttributePrefix)

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
