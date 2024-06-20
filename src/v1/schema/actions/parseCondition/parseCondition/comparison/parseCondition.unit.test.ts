import { schema } from 'v1/schema/index.js'
import { map, list, number } from 'v1/schema/attributes/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - comparison', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number()
  })

  it('equal to (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', eq: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 = :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('equal to (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', eq: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 = #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('not equal to (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', ne: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 <> :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('not equal to (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', ne: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 <> #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', gt: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 > :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('greater than (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', gt: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 > #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than or equal to (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', gte: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 >= :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('greater than or equal to (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', gte: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 >= #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', lt: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 < :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('less than (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', lt: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 < #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than or equal to (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', lte: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 <= :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('less than or equal to (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', lte: { attr: 'otherNum' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 <= #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  const mapSchema = schema({
    map: map({
      nestedA: map({ nestedB: number() })
    }),
    other: map({
      nested: map({ value: number() })
    })
  })

  it('deep maps (value)', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({ attr: 'map.nestedA.nestedB', eq: 42 })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 = :c_1',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.nestedA.nestedB',
          eq: { attr: 'other.nested.value' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 = #c_4.#c_5.#c_6',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB',
        '#c_4': 'other',
        '#c_5': 'nested',
        '#c_6': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndListSchema = schema({
    listA: list(
      map({
        nested: map({
          listB: list(map({ value: number() }))
        })
      })
    ),
    listC: list(
      map({
        nested: map({
          listD: list(map({ value: number() }))
        })
      })
    )
  })

  it('deep maps and lists (value)', () => {
    expect(
      mapAndListSchema
        .build(ConditionParser)
        .parse({ attr: 'listA[1].nested.listB[2].value', eq: 42 })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 = :c_1',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      mapAndListSchema
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].nested.listB[2].value',
          eq: { attr: 'listC[3].nested.listD[4].value' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 = #c_5[3].#c_6.#c_7[4].#c_8',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'nested',
        '#c_7': 'listD',
        '#c_8': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listSchema = schema({
    listA: list(list(list(number()))),
    listB: list(list(list(number())))
  })

  it('deep lists (value)', () => {
    expect(
      listSchema.build(ConditionParser).parse({ attr: 'listA[1][2][3]', eq: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] = :c_1',
      ExpressionAttributeNames: { '#c_1': 'listA' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      listSchema
        .build(ConditionParser)
        .parse({ attr: 'listA[1][2][3]', eq: { attr: 'listB[4][5][6]' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] = #c_2[4][5][6]',
      ExpressionAttributeNames: { '#c_1': 'listA', '#c_2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ size: 'num', eq: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'size(#c_1) = :c_1',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })
})
