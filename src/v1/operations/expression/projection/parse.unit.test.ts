import { schema } from 'v1/schema/schema'
import { string, number, anyOf, map, list } from 'v1/schema/attributes'

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
        ProjectionExpression: '#p_1',
        ExpressionAttributeNames: { '#p_1': '_s' }
      })
    })

    it('correctly parses projection (nested)', () => {
      expect(parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'nested.savedAs'])).toStrictEqual(
        {
          ProjectionExpression: '#p_1, #p_2.#p_3',
          ExpressionAttributeNames: { '#p_1': '_s', '#p_2': '_n', '#p_3': '_s' }
        }
      )
    })

    it('correctly parses projection (with id)', () => {
      expect(parseSchemaProjection(schemaWithSavedAs, ['savedAs'], '1')).toStrictEqual({
        ProjectionExpression: '#p1_1',
        ExpressionAttributeNames: { '#p1_1': '_s' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(
        parseSchemaProjection(schemaWithSavedAs, ['savedAs', 'listed[4].savedAs'])
      ).toStrictEqual({
        ProjectionExpression: '#p_1, #p_2[4].#p_3',
        ExpressionAttributeNames: { '#p_1': '_s', '#p_2': '_l', '#p_3': '_s' }
      })
    })
  })

  describe('anyOf', () => {
    const schemaWithAnyOf = schema({
      anyOf: anyOf(number(), map({ str: string() }), map({ num: number().savedAs('_n') }))
    })

    it('correctly parses projection (root)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf'])).toStrictEqual({
        ProjectionExpression: '#p_1',
        ExpressionAttributeNames: { '#p_1': 'anyOf' }
      })
    })

    it('correctly parses projection (nested str)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.str'])).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': 'str' }
      })
    })

    it('correctly parses projection (nested num)', () => {
      expect(parseSchemaProjection(schemaWithAnyOf, ['anyOf.num'])).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': '_n' }
      })
    })
  })
})
