import { item, list, map, number } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('parseCondition - comparison', () => {
  const simpleSchema = item({
    num: number(),
    otherNum: number()
  })

  test('equal to (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 = :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('equal to (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', eq: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 = #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('equal to (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', eq: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 = :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('not equal to (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', ne: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 <> :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('not equal to (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', ne: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 <> #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('not equal to (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', ne: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 <> :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('greater than (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', gt: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 > :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('greater than (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', gt: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 > #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('greater than (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', gt: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 > :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('greater than or equal to (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', gte: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 >= :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('greater than or equal to (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', gte: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 >= #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('greater than or equal to (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', gte: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 >= :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('less than (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', lt: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 < :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('less than (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', lt: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 < #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('less than (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', lt: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 < :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  test('less than or equal to (value)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'num', lte: 42 })).toStrictEqual({
      ConditionExpression: '#c_1 <= :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('less than or equal to (attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', lte: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1 <= #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('less than or equal to (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 'foo', lte: 'bar' })).toStrictEqual({
      ConditionExpression: ':c_1 <= :c_2',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 'foo', ':c_2': 'bar' }
    })
  })

  const mapSchema = item({
    map: map({
      deepA: map({ deepB: number() })
    }),
    other: map({
      deep: map({ value: number() })
    })
  })

  test('deep maps (value)', () => {
    expect(
      mapSchema.build(ConditionParser).parse({ attr: 'map.deepA.deepB', eq: 42 })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 = :c_1',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep maps (attribute)', () => {
    expect(
      mapSchema.build(ConditionParser).parse({
        attr: 'map.deepA.deepB',
        eq: { attr: 'other.deep.value' }
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 = #c_4.#c_5.#c_6',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB',
        '#c_4': 'other',
        '#c_5': 'deep',
        '#c_6': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndListSchema = item({
    listA: list(
      map({
        deep: map({
          listB: list(map({ value: number() }))
        })
      })
    ),
    listC: list(
      map({
        deep: map({
          listD: list(map({ value: number() }))
        })
      })
    )
  })

  test('deep maps and lists (value)', () => {
    expect(
      mapAndListSchema
        .build(ConditionParser)
        .parse({ attr: 'listA[1].deep.listB[2].value', eq: 42 })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 = :c_1',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep maps and lists (attribute)', () => {
    expect(
      mapAndListSchema.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        eq: { attr: 'listC[3].deep.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 = #c_5[3].#c_2.#c_6[4].#c_4',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'listD'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listSchema = item({
    listA: list(list(list(number()))),
    listB: list(list(list(number())))
  })

  test('deep lists (value)', () => {
    expect(
      listSchema.build(ConditionParser).parse({ attr: 'listA[1][2][3]', eq: 42 })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] = :c_1',
      ExpressionAttributeNames: { '#c_1': 'listA' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep lists (attribute)', () => {
    expect(
      listSchema
        .build(ConditionParser)
        .parse({ attr: 'listA[1][2][3]', eq: { attr: 'listB[4][5][6]' } })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] = #c_2[4][5][6]',
      ExpressionAttributeNames: { '#c_1': 'listA', '#c_2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })

  test('with size', () => {
    expect(simpleSchema.build(ConditionParser).parse({ size: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: 'size(#c_1) = :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })
})
