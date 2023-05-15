import { item, string, number, anyOf, map, list } from 'v1/item'
import { parseProjection } from 'v1/commands/utils/parseProjection'

describe('parseProjection', () => {
  describe('savedAs attrs', () => {
    const itemWithSavedAs = item({
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
      expect(parseProjection(itemWithSavedAs, ['savedAs'])).toStrictEqual({
        ProjectionExpression: '#1',
        ExpressionAttributeNames: { '#1': '_s' }
      })
    })

    it('correctly parses projection (nested)', () => {
      expect(parseProjection(itemWithSavedAs, ['savedAs', 'nested.savedAs'])).toStrictEqual({
        ProjectionExpression: '#1, #2.#3',
        ExpressionAttributeNames: { '#1': '_s', '#2': '_n', '#3': '_s' }
      })
    })

    it('correctly parses condition (listed)', () => {
      expect(parseProjection(itemWithSavedAs, ['savedAs', 'listed[4].savedAs'])).toStrictEqual({
        ProjectionExpression: '#1, #2[4].#3',
        ExpressionAttributeNames: { '#1': '_s', '#2': '_l', '#3': '_s' }
      })
    })
  })

  describe('anyOf', () => {
    const itemWithAnyOf = item({
      anyOf: anyOf([number(), map({ str: string() }), map({ num: number().savedAs('_n') })])
    })

    it('correctly parses projection (root)', () => {
      expect(parseProjection(itemWithAnyOf, ['anyOf'])).toStrictEqual({
        ProjectionExpression: '#1',
        ExpressionAttributeNames: { '#1': 'anyOf' }
      })
    })

    it('correctly parses projection (nested str)', () => {
      expect(parseProjection(itemWithAnyOf, ['anyOf.str'])).toStrictEqual({
        ProjectionExpression: '#1.#2',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'str' }
      })
    })

    it('correctly parses projection (nested num)', () => {
      expect(parseProjection(itemWithAnyOf, ['anyOf.num'])).toStrictEqual({
        ProjectionExpression: '#1.#2',
        ExpressionAttributeNames: { '#1': 'anyOf', '#2': '_n' }
      })
    })
  })
})
