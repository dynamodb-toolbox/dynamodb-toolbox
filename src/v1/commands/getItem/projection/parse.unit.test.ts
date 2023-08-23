import { schema, string, number, anyOf, map, list } from 'v1/schema'

import { parseSchemaProjection } from './parse'

/**
 * @debt TODO "validate the attr value is a string"
 */

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
        ProjectionExpression: '#p1',
        ExpressionAttributeNames: { '#p1': '_s' }
      })
    })

    it('correctly parses projection (nested)', () => {
      expect(parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'nested.savedAs'])).toStrictEqual(
        {
          ProjectionExpression: '#p1, #p2.#p3',
          ExpressionAttributeNames: { '#p1': '_s', '#p2': '_n', '#p3': '_s' }
        }
      )
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'listed[4].savedAs'])
      ).toStrictEqual({
        ProjectionExpression: '#p1, #p2[4].#p3',
        ExpressionAttributeNames: { '#p1': '_s', '#p2': '_l', '#p3': '_s' }
      })
    })
  })

  describe('anyOf', () => {
    const schemaWithAnyOf = schema({
      anyOf: anyOf([number(), map({ str: string() }), map({ num: number().savedAs('_n') })])
    })

    it('correctly parses projection (root)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf'])).toStrictEqual({
        ProjectionExpression: '#p1',
        ExpressionAttributeNames: { '#p1': 'anyOf' }
      })
    })

    it('correctly parses projection (nested str)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.str'])).toStrictEqual({
        ProjectionExpression: '#p1.#p2',
        ExpressionAttributeNames: { '#p1': 'anyOf', '#p2': 'str' }
      })
    })

    it('correctly parses projection (nested num)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.num'])).toStrictEqual({
        ProjectionExpression: '#p1.#p2',
        ExpressionAttributeNames: { '#p1': 'anyOf', '#p2': '_n' }
      })
    })
  })
})
