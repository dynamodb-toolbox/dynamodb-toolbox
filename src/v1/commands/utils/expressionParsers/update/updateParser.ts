import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'
import type { UpdateItemInput, UpdateAttributeInput } from 'v1/commands/updateItem/types'
import type { Schema, Attribute } from 'v1/schema'

import type { ParsedUpdate } from './type'
import { UpdateVerbParser } from './verbParser'
import { parseUpdate } from './parseUpdate'

export class UpdateParser {
  schema: Schema | Attribute
  setParser: UpdateVerbParser
  removeParser: UpdateVerbParser
  addParser: UpdateVerbParser
  deleteParser: UpdateVerbParser

  constructor(schema: Schema | Attribute) {
    this.schema = schema
    this.setParser = new UpdateVerbParser(schema, 's')
    this.removeParser = new UpdateVerbParser(schema, 'r')
    this.addParser = new UpdateVerbParser(schema, 'a')
    this.deleteParser = new UpdateVerbParser(schema, 'd')
  }

  parseUpdate = (input: UpdateItemInput | UpdateAttributeInput): void => parseUpdate(this, input)

  toCommandOptions = (): ParsedUpdate => {
    let UpdateExpression = ''
    const ExpressionAttributeNames: Record<string, string> = {}
    const ExpressionAttributeValues: Record<string, NativeAttributeValue> = {}

    for (const [verb, parser] of [
      ['SET', this.setParser],
      ['REMOVE', this.removeParser],
      ['ADD', this.addParser],
      ['DELETE', this.deleteParser]
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
