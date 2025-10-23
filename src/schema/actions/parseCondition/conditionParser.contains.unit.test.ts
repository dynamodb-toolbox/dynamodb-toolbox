import { item, list, map, number, set, string } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('parseCondition - contains', () => {
  const simpleSchema = item({
    str: string(),
    otherStr: string(),
    set: set(string()),
    list: list(number()),
    num: number()
  })

  test('contains (str - value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'str' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('contains (str - reference)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', contains: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'str', '#c_2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  test('contains (str - free)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ value: 'foo', contains: 'bar' })
    ).toStrictEqual({
      ConditionExpression: 'contains(:c_1, :c_2)',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('contains (list - value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'list', contains: 42 })).toStrictEqual(
      {
        ConditionExpression: 'contains(#c_1, :c_1)',
        ExpressionAttributeNames: { '#c_1': 'list' },
        ExpressionAttributeValues: { ':c_1': 42 }
      }
    )
  })

  test('contains (list - reference)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'list', contains: { attr: 'num' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  test('contains (list - free)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ value: [{ foo: 'bar' }], contains: { foo: 'baz' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(:c_1, :c_2)',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': [{ foo: 'bar' }], ':c_2': { foo: 'baz' } }
    })
  })

  test('contains (set - value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'set', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'set' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('contains (set - reference)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'set', contains: { attr: 'str' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'set', '#c_2': 'str' },
      ExpressionAttributeValues: {}
    })
  })

  test('contains (set - free)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ value: ['foo', 'bar'], contains: 'baz' })
    ).toStrictEqual({
      ConditionExpression: 'contains(:c_1, :c_2)',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': ['foo', 'bar'], ':c_2': 'baz' }
    })
  })

  const mapSchema = item({
    map: map({
      deepA: map({
        deepB: string()
      })
    }),
    otherMap: map({
      deepC: map({
        deepD: string()
      })
    })
  })

  test('deep maps (value)', () => {
    expect(
      mapSchema.build(ConditionParser).parse({ attr: 'map.deepA.deepB', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB'
      },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('deep maps (attribute)', () => {
    expect(
      mapSchema.build(ConditionParser).parse({
        attr: 'map.deepA.deepB',
        contains: { attr: 'otherMap.deepC.deepD' }
      })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, #c_4.#c_5.#c_6)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB',
        '#c_4': 'otherMap',
        '#c_5': 'deepC',
        '#c_6': 'deepD'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = item({
    list: list(list(list(string()))),
    listB: list(list(list(string())))
  })

  test('deep lists (value)', () => {
    expect(
      listsSchema.build(ConditionParser).parse({ attr: 'list[1][2][3]', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1[1][2][3], :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('deep lists (attribute)', () => {
    expect(
      listsSchema.build(ConditionParser).parse({
        attr: 'list[1][2][3]',
        contains: { attr: 'listB[4][5][6]' }
      })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1[1][2][3], #c_2[4][5][6])',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })
})
