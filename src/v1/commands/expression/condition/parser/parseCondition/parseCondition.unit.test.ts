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
        ConditionExpression: 'begins_with(#c1, :c1)',
        ExpressionAttributeNames: { '#c1': '_s' },
        ExpressionAttributeValues: { ':c1': 'foo' }
      })
    })

    it('correctly parses condition (nested)', () => {
      expect(
        parseSchemaCondition(schemaWithSavedAs, { attr: 'nested.savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c1.#c2, :c1)',
        ExpressionAttributeNames: { '#c1': '_n', '#c2': '_s' },
        ExpressionAttributeValues: { ':c1': 'foo' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseSchemaCondition(schemaWithSavedAs, { attr: 'listed[4].savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c1[4].#c2, :c1)',
        ExpressionAttributeNames: { '#c1': '_l', '#c2': '_s' },
        ExpressionAttributeValues: { ':c1': 'foo' }
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
        ConditionExpression: '#c1 BETWEEN :c1 AND :c2',
        ExpressionAttributeNames: { '#c1': 'anyOf' },
        ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
      })
    })

    it('correctly parses condition (nested num)', () => {
      expect(
        parseSchemaCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', between: [42, 43] })
      ).toStrictEqual({
        ConditionExpression: '#c1.#c2 BETWEEN :c1 AND :c2',
        ExpressionAttributeNames: { '#c1': 'anyOf', '#c2': 'strOrNum' },
        ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
      })
    })

    it('correctly parses condition (nested str)', () => {
      expect(
        parseSchemaCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#c1.#c2, :c1)',
        ExpressionAttributeNames: { '#c1': 'anyOf', '#c2': 'strOrNum' },
        ExpressionAttributeValues: { ':c1': 'foo' }
      })
    })
  })
})
