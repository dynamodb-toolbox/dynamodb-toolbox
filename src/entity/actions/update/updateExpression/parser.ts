import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { AttrSchema, AttributeValue } from '~/attributes/index.js'
import type { Schema, ValidValue } from '~/schema/index.js'
import { isArray } from '~/utils/validation/isArray.js'
import { isObject } from '~/utils/validation/isObject.js'

import {
  $ADD,
  $APPEND,
  $DELETE,
  $PREPEND,
  $SET,
  $SUBTRACT,
  $SUM,
  isAddition,
  isAppending,
  isDeletion,
  isGetting,
  isPrepending,
  isRemoval,
  isSetting,
  isSubtraction,
  isSum
} from '../symbols/index.js'
import type { UpdateItemInputExtension } from '../types.js'
import type { ParsedUpdate } from './type.js'
import { UpdateExpressionVerbParser } from './verbParser.js'

export class UpdateExpressionParser {
  schema: Schema | AttrSchema
  set: UpdateExpressionVerbParser
  remove: UpdateExpressionVerbParser
  add: UpdateExpressionVerbParser
  delete: UpdateExpressionVerbParser

  constructor(schema: Schema | AttrSchema) {
    this.schema = schema
    this.set = new UpdateExpressionVerbParser(schema, 's')
    this.remove = new UpdateExpressionVerbParser(schema, 'r')
    this.add = new UpdateExpressionVerbParser(schema, 'a')
    this.delete = new UpdateExpressionVerbParser(schema, 'd')
  }

  parseUpdate = (
    parsedValue: ValidValue<
      Schema | AttrSchema,
      { mode: 'update'; extension: UpdateItemInputExtension }
    >,
    currentPath: (string | number)[] = []
  ): void => {
    if (parsedValue === undefined) {
      return
    }

    if (isSetting(parsedValue)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      /**
       * @debt type "Fix this cast"
       */
      this.set.appendValidAttributeValue(parsedValue[$SET])
      return
    }

    if (isGetting(parsedValue)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = ')
      this.set.appendValidAttributeValue(parsedValue)
      return
    }

    if (isRemoval(parsedValue)) {
      this.remove.beginNewInstruction()
      this.remove.appendValidAttributePath(currentPath)
      return
    }

    if (isSum(parsedValue)) {
      /**
       * @debt type "Fix this cast"
       */
      const [left, right] = parsedValue[$SUM] as [
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

    if (isSubtraction(parsedValue)) {
      /**
       * @debt type "Fix this cast"
       */
      const [left, right] = parsedValue[$SUBTRACT] as [
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

    if (isAddition(parsedValue)) {
      this.add.beginNewInstruction()
      this.add.appendValidAttributePath(currentPath)
      this.add.appendToExpression(' ')
      /**
       * @debt type "Fix this cast"
       */
      this.add.appendValidAttributeValue(
        parsedValue[$ADD] as AttributeValue<UpdateItemInputExtension>
      )
      return
    }

    if (isDeletion(parsedValue)) {
      this.delete.beginNewInstruction()
      this.delete.appendValidAttributePath(currentPath)
      this.delete.appendToExpression(' ')
      /**
       * @debt type "Fix this cast"
       */
      this.delete.appendValidAttributeValue(
        parsedValue[$DELETE] as AttributeValue<UpdateItemInputExtension>
      )
      return
    }

    if (isAppending(parsedValue)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = list_append(if_not_exists(')
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(', ')
      this.set.appendValidAttributeValue([])
      this.set.appendToExpression('), ')
      /**
       * @debt type "Fix this cast"
       */
      this.set.appendValidAttributeValue(
        parsedValue[$APPEND] as AttributeValue<UpdateItemInputExtension>
      )
      this.set.appendToExpression(')')
      return
    }

    if (isPrepending(parsedValue)) {
      this.set.beginNewInstruction()
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(' = list_append(')
      /**
       * @debt type "Fix this cast"
       */
      this.set.appendValidAttributeValue(
        parsedValue[$PREPEND] as AttributeValue<UpdateItemInputExtension>
      )
      this.set.appendToExpression(', if_not_exists(')
      this.set.appendValidAttributePath(currentPath)
      this.set.appendToExpression(', ')
      this.set.appendValidAttributeValue([])
      this.set.appendToExpression('))')
      return
    }

    if (isObject(parsedValue)) {
      for (const [key, value] of Object.entries(parsedValue)) {
        this.parseUpdate(value, [...currentPath, key])
      }
      return
    }

    if (isArray(parsedValue)) {
      parsedValue.forEach((element, index) => {
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
    this.set.appendValidAttributeValue(parsedValue)
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
