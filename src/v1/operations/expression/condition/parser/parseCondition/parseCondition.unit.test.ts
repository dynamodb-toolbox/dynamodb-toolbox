import { schema, string, number, anyOf, map, list } from 'v1/schema'

import { parseSchemaCondition } from '../../parse'

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
        parseSchemaCondition(schemaWithSavedAs, { attr: 'savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })

    it('correctly parses condition (nested)', () => {
      expect(
        parseSchemaCondition(schemaWithSavedAs, { attr: 'nested.savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1.#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_n', '#c_2': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })

    it('correctly parses condition (with id)', () => {
      expect(
        parseSchemaCondition(schemaWithSavedAs, { attr: 'savedAs', beginsWith: 'foo' }, '1')
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c1_1, :c1_1)',
        ExpressionAttributeNames: { '#c1_1': '_s' },
        ExpressionAttributeValues: { ':c1_1': 'foo' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseSchemaCondition(schemaWithSavedAs, { attr: 'listed[4].savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1[4].#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': '_l', '#c_2': '_s' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })
  })

  describe('anyOf', () => {
    const schemaWithAnyOf = schema({
      anyOf: anyOf([
        number(),
        map({
          strOrNum: anyOf([string(), number()])
        })
      ])
    })

    it('correctly parses condition (root)', () => {
      expect(
        parseSchemaCondition(schemaWithAnyOf, { attr: 'anyOf', between: [42, 43] })
      ).toStrictEqual({
        ConditionExpression: '#c_1 BETWEEN :c_1 AND :c_2',
        ExpressionAttributeNames: { '#c_1': 'anyOf' },
        ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
      })
    })

    it('correctly parses condition (nested num)', () => {
      expect(
        parseSchemaCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', between: [42, 43] })
      ).toStrictEqual({
        ConditionExpression: '#c_1.#c_2 BETWEEN :c_1 AND :c_2',
        ExpressionAttributeNames: { '#c_1': 'anyOf', '#c_2': 'strOrNum' },
        ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
      })
    })

    it('correctly parses condition (nested str)', () => {
      expect(
        parseSchemaCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c_1.#c_2, :c_1)',
        ExpressionAttributeNames: { '#c_1': 'anyOf', '#c_2': 'strOrNum' },
        ExpressionAttributeValues: { ':c_1': 'foo' }
      })
    })
  })
})
