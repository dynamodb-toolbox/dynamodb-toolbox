import { anyOf, list, map, number, record, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { schema } from '~/schema/index.js'

import { PathParser } from './pathParser.js'

/**
 * @debt test "validate the attr value is a string"
 */

describe('parseProjection', () => {
  describe('savedAs attrs', () => {
    const schemaWithSavedAs = schema({
      savedAs: string().savedAs('_s'),
      deep: map({
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

    test('correctly parses projection (deep)', () => {
      expect(
        schemaWithSavedAs.build(PathParser).parse(['savedAs', 'deep.savedAs']).toCommandOptions()
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

    test('correctly parses projection (deep str)', () => {
      expect(
        schemaWithAnyOf.build(PathParser).parse(['anyOf.str']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': 'str' }
      })
    })

    test('correctly parses projection (deep num)', () => {
      expect(
        schemaWithAnyOf.build(PathParser).parse(['anyOf.num']).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'anyOf', '#p_2': '_n' }
      })
    })
  })

  describe('special char keys', () => {
    const schemaWithRec = schema({
      record: record(string(), string()),
      map: map({
        '[': string()
      }),
      ']': string()
    })

    test('rejects unescaped chars', () => {
      const invalidCallA = () =>
        schemaWithRec.build(PathParser).parse(['record.[.]']).toCommandOptions()

      expect(invalidCallA).toThrow(DynamoDBToolboxError)
      expect(invalidCallA).toThrow(
        expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
      )

      const invalidCallB = () => schemaWithRec.build(PathParser).parse(['map.[']).toCommandOptions()

      expect(invalidCallB).toThrow(DynamoDBToolboxError)
      expect(invalidCallB).toThrow(
        expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
      )

      const invalidCallC = () => schemaWithRec.build(PathParser).parse([']']).toCommandOptions()

      expect(invalidCallC).toThrow(DynamoDBToolboxError)
      expect(invalidCallC).toThrow(
        expect.objectContaining({ code: 'actions.invalidExpressionAttributePath' })
      )
    })

    test('correctly parses escaped record keys', () => {
      expect(
        schemaWithRec.build(PathParser).parse(["record['[']"]).toCommandOptions()
      ).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'record', '#p_2': '[' }
      })
    })

    test('correctly parses escaped map keys', () => {
      expect(schemaWithRec.build(PathParser).parse(["map['[']"]).toCommandOptions()).toStrictEqual({
        ProjectionExpression: '#p_1.#p_2',
        ExpressionAttributeNames: { '#p_1': 'map', '#p_2': '[' }
      })
    })

    test('correctly parses escaped schema keys', () => {
      expect(schemaWithRec.build(PathParser).parse(["[']']"]).toCommandOptions()).toStrictEqual({
        ProjectionExpression: '#p_1',
        ExpressionAttributeNames: { '#p_1': ']' }
      })
    })
  })
})
