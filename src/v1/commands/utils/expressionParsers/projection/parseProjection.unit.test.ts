import { schema, string, number, anyOf, map, list } from 'v1/schema'
import { parseSchemaProjection } from 'v1/commands/utils/parseProjection'

describe('parseProjection', () => {
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

    it('correctly parses projection (root)', () => {
      expect(parseSchemaProjection(schemaWithSavedAs, ['savedAs'])).toStrictEqual({
        ProjectionExpression: '#1',
        ExpressionAttributeNames: { '#1': '_s' }
      })
    })

    it('correctly parses projection (nested)', () => {
      expect(parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'nested.savedAs'])).toStrictEqual(
        {
          ProjectionExpression: '#1, #2.#3',
          ExpressionAttributeNames: { '#1': '_s', '#2': '_n', '#3': '_s' }
        }
      )
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'listed[4].savedAs'])
      ).toStrictEqual({
        ProjectionExpression: '#1, #2[4].#3',
        ExpressionAttributeNames: { '#1': '_s', '#2': '_l', '#3': '_s' }
      })
    })
  })

  describe('anyOf', () => {
    const schemaWithAnyOf = schema({
      anyOf: anyOf([number(), map({ str: string() }), map({ num: number().savedAs('_n') })])
    })

    it('correctly parses projection (root)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf'])).toStrictEqual({
        ProjectionExpression: '#1',
        ExpressionAttributeNames: { '#1': 'anyOf' }
      })
    })

    it('correctly parses projection (nested str)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.str'])).toStrictEqual({
        ProjectionExpression: '#1.#2',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'str' }
      })
    })

    it('correctly parses projection (nested num)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.num'])).toStrictEqual({
        ProjectionExpression: '#1.#2',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': '_n' }
      })
    })
  })
})
