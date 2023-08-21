import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'
import type { UpdateItemInput, UpdateAttributeInput } from 'v1/commands/updateItem/types'
import type { Schema, Attribute } from 'v1/schema'

import type { ParsedUpdate } from './type'
import { UpdateVerbParser } from './verbParser'
import { parseUpdate } from './parseUpdate'

export class UpdateParser {
  schema: Schema | Attribute
  set: UpdateVerbParser
  remove: UpdateVerbParser
  add: UpdateVerbParser
  delete: UpdateVerbParser

  constructor(schema: Schema | Attribute) {
    this.schema = schema
    this.set = new UpdateVerbParser(schema, 's')
    this.remove = new UpdateVerbParser(schema, 'r')
    this.add = new UpdateVerbParser(schema, 'a')
    this.delete = new UpdateVerbParser(schema, 'd')
  }

  parseUpdate = (
    input: UpdateItemInput | UpdateAttributeInput,
    currentPath: (string | number)[] = []
  ): void => parseUpdate(this, input, currentPath)

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
