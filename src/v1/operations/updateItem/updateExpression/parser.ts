import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema, Attribute, AttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation/isObject'
import { isArray } from 'v1/utils/validation/isArray'

import type { UpdateItemInput, AttributeUpdateItemInput, UpdateItemInputExtension } from '../types'
import { $SET, $REMOVE, $SUM, $SUBTRACT, $ADD, $DELETE, $APPEND, $PREPEND } from '../constants'
import {
  hasSetOperation,
  hasGetOperation,
  hasSumOperation,
  hasSubtractOperation,
  hasAddOperation,
  hasDeleteOperation,
  hasAppendOperation,
  hasPrependOperation
} from '../utils'

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
    input: UpdateItemInput | AttributeUpdateItemInput,
    currentPath: (string | number)[] = []
  ): void => {
    if (input === undefined) {
      return
    }

    if (hasSetOperation(input)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      // TODO: Fix this cast
      this.set.appendValidAttributeValue(input[$SET] as AttributeValue<UpdateItemInputExtension>)
      return
    }

    if (hasGetOperation(input)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      this.set.appendValidAttributeValue(input)
      return
    }

    if (input === $REMOVE) {
      this.remove.beginNewInstruction()
      this.remove.appendValidAttributePath(currentPath)
      return
    }

    if (hasSumOperation(input)) {
      // TODO: Fix this cast
      const [left, right] = input[$SUM] as [
        AttributeValue<UpdateItemInputExtension>,
        AttributeValue<UpdateItemInputExtension>
      ]
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      this.set.appendValidAttributeValue(left)
      this.set.appendToExpression(' + ')
      this.set.appendValidAttributeValue(right)
      return
    }

    if (hasSubtractOperation(input)) {
      // TODO: Fix this cast
      const [left, right] = input[$SUBTRACT] as [
        AttributeValue<UpdateItemInputExtension>,
        AttributeValue<UpdateItemInputExtension>
      ]
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      this.set.appendValidAttributeValue(left)
      this.set.appendToExpression(' - ')
      this.set.appendValidAttributeValue(right)
      return
    }

    if (hasAddOperation(input)) {
      this.add.beginNewInstruction()
      this.add.appendValidAttributePath(currentPath)
      this.add.appendToExpression(' ')
      // TODO: Fix this cast
      this.add.appendValidAttributeValue(input[$ADD] as AttributeValue<UpdateItemInputExtension>)
      return
    }

    if (hasDeleteOperation(input)) {
      this.delete.beginNewInstruction()
      this.delete.appendValidAttributePath(currentPath)
      this.delete.appendToExpression(' ')
      // TODO: Fix this cast
      this.delete.appendValidAttributeValue(
        input[$DELETE] as AttributeValue<UpdateItemInputExtension>
      )
      return
    }

    if (hasAppendOperation(input)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = list_append(')
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(', ')
      // TODO: Fix this cast
      this.set.appendValidAttributeValue(input[$APPEND] as AttributeValue<UpdateItemInputExtension>)
      this.set.appendToExpression(')')
      return
    }

    if (hasPrependOperation(input)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = list_append(')
      // TODO: Fix this cast
      this.set.appendValidAttributeValue(
        input[$PREPEND] as AttributeValue<UpdateItemInputExtension>
      )
      this.set.appendToExpression(', ')
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(')')
      return
    }

    if (isObject(input)) {
      for (const [key, value] of Object.entries(input)) {
        this.parseUpdate(value, [...currentPath, key])
      }
      return
    }

    if (isArray(input)) {
      input.forEach((element, index) => {
        if (element === undefined) {
          return
        }

        this.parseUpdate(element, [...currentPath, index])
      })

      return
    }

    this.set.beginNewInstruction()
    this.set.appendValidAttributePath(currentPath)
    this.set.appendToExpression(' = ')
    this.set.appendValidAttributeValue(input)
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
