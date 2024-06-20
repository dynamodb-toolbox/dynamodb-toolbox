import { schema } from 'v1/schema/index.js'
import { string, number, anyOf, map, list } from 'v1/schema/attributes/index.js'

import { PathParser } from './pathParser.js'

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

    test('correctly parses projection (root)', () => {
      expect(
        schemaWithSavedAs.build(PathParser).parse(['savedAs']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1',
        ExpressionAttributeNames: { '#p_1': '_s' }
      })
    })

    test('correctly parses projection (nested)', () => {
      expect(
        schemaWithSavedAs.build(PathParser).parse(['savedAs', 'nested.savedAs']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1, #p_2.#p_3',
        ExpressionAttributeNames: { '#p_1': '_s', '#p_2': '_n', '#p_3': '_s' }
      })
    })

    test('correctly parses projection (with id)', () => {
      expect(
        schemaWithSavedAs.build(PathParser).setId('1').parse(['savedAs']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p1_1',
        ExpressionAttributeNames: { '#p1_1': '_s' }
      })
    })

    test('correctly parses condition (listed)', () => {
      expect(
        schemaWithSavedAs
          .build(PathParser)
          .parse(['savedAs', 'listed[4].savedAs'])
          .toCommandOptions()
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

    test('correctly parses projection (root)', () => {
      expect(schemaWithAnyOf.build(PathParser).parse(['anyOf']).toCommandOptions()).toStrictEqual({
        ProjectionExpression: '#p_1',
        ExpressionAttributeNames: { '#p_1': 'anyOf' }
      })
    })

    test('correctly parses projection (nested str)', () => {
      expect(
        schemaWithAnyOf.build(PathParser).parse(['anyOf.str']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': 'str' }
      })
    })

    test('correctly parses projection (nested num)', () => {
      expect(
        schemaWithAnyOf.build(PathParser).parse(['anyOf.num']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': '_n' }
      })
    })
  })
})
