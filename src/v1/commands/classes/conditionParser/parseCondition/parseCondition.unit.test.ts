import { schema, string, number, anyOf, map, list } from 'v1/schema'
import { parseCondition } from 'v1/commands/utils/parseCondition'

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
        parseCondition(schemaWithSavedAs, { attr: 'savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#1, :1)',
        ExpressionAttributeNames: { '#1': '_s' },
        ExpressionAttributeValues: { ':1': 'foo' }
      })
    })

    it('correctly parses condition (nested)', () => {
      expect(
        parseCondition(schemaWithSavedAs, { attr: 'nested.savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#1.#2, :1)',
        ExpressionAttributeNames: { '#1': '_n', '#2': '_s' },
        ExpressionAttributeValues: { ':1': 'foo' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseCondition(schemaWithSavedAs, { attr: 'listed[4].savedAs', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#1[4].#2, :1)',
        ExpressionAttributeNames: { '#1': '_l', '#2': '_s' },
        ExpressionAttributeValues: { ':1': 'foo' }
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
      expect(parseCondition(schemaWithAnyOf, { attr: 'anyOf', between: [42, 43] })).toStrictEqual({
        ConditionExpression: '#1 BETWEEN :1 AND :2',
        ExpressionAttributeNames: { '#1': 'anyOf' },
        ExpressionAttributeValues: { ':1': 42, ':2': 43 }
      })
    })

    it('correctly parses condition (nested num)', () => {
      expect(
        parseCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', between: [42, 43] })
      ).toStrictEqual({
        ConditionExpression: '#1.#2 BETWEEN :1 AND :2',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'strOrNum' },
        ExpressionAttributeValues: { ':1': 42, ':2': 43 }
      })
    })

    it('correctly parses condition (nested str)', () => {
      expect(
        parseCondition(schemaWithAnyOf, { attr: 'anyOf.strOrNum', beginsWith: 'foo' })
      ).toStrictEqual({
        ConditionExpression: 'begins_with(#1.#2, :1)',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'strOrNum' },
        ExpressionAttributeValues: { ':1': 'foo' }
      })
    })
  })
})
