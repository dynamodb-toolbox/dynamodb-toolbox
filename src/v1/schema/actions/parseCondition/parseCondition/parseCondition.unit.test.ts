import { schema } from 'v1/schema/index.js'
import { string, number, anyOf, map, list } from 'v1/schema/attributes/index.js'

import { ConditionParser } from '../conditionParser.js'

/**
 * @debt TODO "validate the attr value is a string"
 */

describe('parseCondition', () => {
  describe('savedAs attrs', () => {
    const schemaWithSavedAs = schema({
      savedAs: string().savedAs('_s'),
      nested: map({
        savedAs: string().savedAs('_s')
      }).savedAs('_n'),
      listed: list(
        map({
          savedAs: string().savedAs('_s')
        })
      ).savedAs('_l')
    })

    it('correctly parses condition (root)', () => {
      expect(
        schemaWithSavedAs
          .build(ConditionParser)
          .parse({ attr: 'savedAs', beginsWith: 'foo' })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })

    it('correctly parses condition (nested)', () => {
      expect(
        schemaWithSavedAs
          .build(ConditionParser)
          .parse({ attr: 'nested.savedAs', beginsWith: 'foo' })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1.#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_n', '#c_2': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })

    it('correctly parses condition (with id)', () => {
      expect(
        schemaWithSavedAs
          .build(ConditionParser)
          .setId('1')
          .parse({ attr: 'savedAs', beginsWith: 'foo' })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c1_1, :c1_1)',
        ExpressionAttributeNames: { '#c1_1': '_s' },
        ExpressionAttributeValues: { ':c1_1': 'foo' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(
        schemaWithSavedAs
          .build(ConditionParser)
          .parse({ attr: 'listed[4].savedAs', beginsWith: 'foo' })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1[4].#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_l', '#c_2': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })
  })

  describe('anyOf', () => {
    const schemaWithAnyOf = schema({
      anyOf: anyOf(
        number(),
        map({
          strOrNum: anyOf(string(), number())
        })
      )
    })

    it('correctly parses condition (root)', () => {
      expect(
        schemaWithAnyOf
          .build(ConditionParser)
          .parse({ attr: 'anyOf', between: [42, 43] })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: '#c_1 BETWEEN :c_1 AND :c_2',
        ExpressionAttributeNames: { '#c_1': 'anyOf' },
        ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
      })
    })

    it('correctly parses condition (nested num)', () => {
      expect(
        schemaWithAnyOf
          .build(ConditionParser)
          .parse({ attr: 'anyOf.strOrNum', between: [42, 43] })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: '#c_1.#c_2 BETWEEN :c_1 AND :c_2',
        ExpressionAttributeNames: { '#c_1': 'anyOf', '#c_2': 'strOrNum' },
        ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
      })
    })

    it('correctly parses condition (nested str)', () => {
      expect(
        schemaWithAnyOf
          .build(ConditionParser)
          .parse({ attr: 'anyOf.strOrNum', beginsWith: 'foo' })
          .toCommandOptions()
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1.#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': 'anyOf', '#c_2': 'strOrNum' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })
  })
})
