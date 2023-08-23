import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema, Attribute } from 'v1/schema'
import { isObject } from 'v1/utils/validation/isObject'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateItemInput, UpdateAttributeInput } from '../types'
import { $SET, $REMOVE, $ADD, $DELETE } from '../constants'
import { hasSetOperation, hasAddOperation, hasDeleteOperation } from '../utils'

import type { ParsedUpdate } from './type'
import { UpdateExpressionVerbParser } from './verbParser'

export class UpdateExpressionParser {
  schema: Schema | Attribute
  set: UpdateExpressionVerbParser
  remove: UpdateExpressionVerbParser
  add: UpdateExpressionVerbParser
  delete: UpdateExpressionVerbParser

  constructor(schema: Schema | Attribute) {
    this.schema = schema
    this.set = new UpdateExpressionVerbParser(schema, 's')
    this.remove = new UpdateExpressionVerbParser(schema, 'r')
    this.add = new UpdateExpressionVerbParser(schema, 'a')
    this.delete = new UpdateExpressionVerbParser(schema, 'd')
  }

  parseUpdate = (
    input: UpdateItemInput | UpdateAttributeInput,
    currentPath: (string | number)[] = []
  ): void => {
    if (hasSetOperation(input)) {
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      this.set.appendValidAttributeValue(input[$SET])
    }

    if (input === $REMOVE) {
      this.remove.appendValidAttributePath(currentPath)
    }

    if (hasAddOperation(input)) {
      this.add.appendValidAttributePath(currentPath)
      this.add.appendToExpression(' ')
      this.add.appendValidAttributeValue(input[$ADD])
    }

    if (hasDeleteOperation(input)) {
      this.delete.appendValidAttributePath(currentPath)
      this.delete.appendToExpression(' ')
      this.delete.appendValidAttributeValue(input[$DELETE])
    }

    if (isObject(input)) {
      for (const [key, value] of Object.entries(input)) {
        this.parseUpdate(value, [...currentPath, key])
      }
    }

    if (isArray(input)) {
      input.forEach((element, index) => {
        if (element === undefined) {
          return
        }

        this.parseUpdate(element, [...currentPath, index])
      })
    }
  }

  toCommandOptions = (): ParsedUpdate => {
    let UpdateExpression = ''
    const ExpressionAttributeNames: Record<string, string> = {}
    const ExpressionAttributeValues: Record<string, NativeAttributeValue> = {}

    for (const [verb, parser] of [
      ['SET', this.set],
      ['REMOVE', this.remove],
      ['ADD', this.add],
      ['DELETE', this.delete]
    ] as const) {
      const verbCommandOptions = parser.toCommandOptions()

      if (verbCommandOptions.UpdateExpression === '') {
        continue
      }

      if (UpdateExpression !== '') {
        UpdateExpression += ' '
      }
      UpdateExpression += verb
      UpdateExpression += ' '
      UpdateExpression += verbCommandOptions.UpdateExpression

      Object.assign(ExpressionAttributeNames, verbCommandOptions.ExpressionAttributeNames)
      Object.assign(ExpressionAttributeValues, verbCommandOptions.ExpressionAttributeValues)
    }

    return {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues
    }
  }
}
