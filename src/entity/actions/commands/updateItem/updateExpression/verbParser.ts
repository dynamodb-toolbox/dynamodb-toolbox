import type { ParsedValue } from '~/schema/actions/parse/index.js'
import {
  AppendAttributePathOptions,
  ExpressionParser,
  appendAttributePath
} from '~/schema/actions/utils/appendAttributePath.js'
import type { Attribute } from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import { isNumber } from '~/utils/validation/isNumber.js'
import { isString } from '~/utils/validation/isString.js'

import { $GET } from '../constants.js'
import type { ReferenceExtension, UpdateItemInputExtension } from '../types.js'
import { isReferenceUpdate } from '../utils.js'
import type { ParsedUpdate } from './type.js'

export class UpdateExpressionVerbParser implements ExpressionParser {
  schema: Schema | Attribute
  verbPrefix: 's' | 'r' | 'a' | 'd'
  expressionAttributePrefix: `${'s' | 'r' | 'a' | 'd'}${string}_`
  expressionAttributeNames: string[]
  expressionAttributeValues: unknown[]
  expression: string
  id: string

  constructor(schema: Schema | Attribute, verbPrefix: 's' | 'r' | 'a' | 'd', id = '') {
    this.schema = schema
    this.verbPrefix = verbPrefix
    this.expressionAttributePrefix = `${verbPrefix}${id}_`
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

  appendAttributeValue = (_: Attribute, attributeValue: unknown): void => {
    const expressionAttributeValueIndex = this.expressionAttributeValues.push(attributeValue)

    this.appendToExpression(`:${this.expressionAttributePrefix}${expressionAttributeValueIndex}`)
  }

  beginNewInstruction = () => {
    if (this.expression !== '') {
      this.appendToExpression(', ')
    }
  }

  appendValidAttributePath = (validAttributePath: (string | number)[]): void => {
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

  appendValidAttributeValue = (
    validAttributeValue: ParsedValue<
      Attribute,
      { mode: 'update'; extension: UpdateItemInputExtension }
    >
  ): void => {
    if (isReferenceUpdate(validAttributeValue)) {
      // TODO: Fix this cast
      const [expression, fallback] = validAttributeValue[$GET] as [
        string,
        ParsedValue<Attribute, { mode: 'update'; extension: ReferenceExtension }> | undefined
      ]

      if (fallback === undefined) {
        this.appendAttributePath(expression)
        return
      }

      if (fallback !== undefined) {
        this.appendToExpression('if_not_exists(')
        this.appendAttributePath(expression)
        this.appendToExpression(', ')
        this.appendValidAttributeValue(fallback)
        this.appendToExpression(')')
        return
      }
    }

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

  clone = (schema?: Schema | Attribute): UpdateExpressionVerbParser => {
    const clonedParser = new UpdateExpressionVerbParser(
      schema ?? this.schema,
      this.verbPrefix,
      this.id
    )

    clonedParser.expressionAttributeNames = [...this.expressionAttributeNames]
    clonedParser.expressionAttributeValues = [...this.expressionAttributeValues]
    clonedParser.expression = this.expression

    return clonedParser
  }
}
