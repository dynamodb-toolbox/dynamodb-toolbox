import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { Schema } from '~/schema/index.js'
import type { Attribute, AttributeValue } from '~/schema/attributes/index.js'
import type { ParsedValue } from '~/schema/actions/parse/index.js'
import { isObject } from '~/utils/validation/isObject.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { UpdateItemInputExtension } from '../types.js'
import { $SET, $REMOVE, $SUM, $SUBTRACT, $ADD, $DELETE, $APPEND, $PREPEND } from '../constants.js'
import {
  isSetUpdate,
  isReferenceUpdate,
  isSumUpdate,
  isSubtractUpdate,
  isAddUpdate,
  isDeleteUpdate,
  isAppendUpdate,
  isPrependUpdate
} from '../utils.js'

import type { ParsedUpdate } from './type.js'
import { UpdateExpressionVerbParser } from './verbParser.js'

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
    input: ParsedValue<Schema | Attribute, { mode: 'update'; extension: UpdateItemInputExtension }>,
    currentPath: (string | number)[] = []
  ): void => {
    if (input === undefined) {
      return
    }

    if (isSetUpdate(input)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      // TODO: Fix this cast
      this.set.appendValidAttributeValue(input[$SET])
      return
    }

    if (isReferenceUpdate(input)) {
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

    if (isSumUpdate(input)) {
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

    if (isSubtractUpdate(input)) {
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

    if (isAddUpdate(input)) {
      this.add.beginNewInstruction()
      this.add.appendValidAttributePath(currentPath)
      this.add.appendToExpression(' ')
      // TODO: Fix this cast
      this.add.appendValidAttributeValue(input[$ADD] as AttributeValue<UpdateItemInputExtension>)
      return
    }

    if (isDeleteUpdate(input)) {
      this.delete.beginNewInstruction()
      this.delete.appendValidAttributePath(currentPath)
      this.delete.appendToExpression(' ')
      // TODO: Fix this cast
      this.delete.appendValidAttributeValue(
        input[$DELETE] as AttributeValue<UpdateItemInputExtension>
      )
      return
    }

    if (isAppendUpdate(input)) {
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

    if (isPrependUpdate(input)) {
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
