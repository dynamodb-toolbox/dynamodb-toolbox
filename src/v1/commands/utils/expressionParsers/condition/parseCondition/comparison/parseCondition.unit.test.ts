import { schema, map, list, number } from 'v1/schema'
import { parseSchemaCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - comparison', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number()
  })

  it('equal to (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: '#c1 = :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('equal to (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', eq: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 = #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('not equal to (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', ne: 42 })).toStrictEqual({
      ConditionExpression: '#c1 <> :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('not equal to (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', ne: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 <> #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', gt: 42 })).toStrictEqual({
      ConditionExpression: '#c1 > :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('greater than (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', gt: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 > #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than or equal to (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', gte: 42 })).toStrictEqual({
      ConditionExpression: '#c1 >= :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('greater than or equal to (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', gte: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 >= #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', lt: 42 })).toStrictEqual({
      ConditionExpression: '#c1 < :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('less than (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', lt: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 < #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than or equal to (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', lte: 42 })).toStrictEqual({
      ConditionExpression: '#c1 <= :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('less than or equal to (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', lte: { attr: 'otherNum' } })
    ).toStrictEqual({
      ConditionExpression: '#c1 <= #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
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
    expect(parseSchemaCondition(mapSchema, { attr: 'map.nestedA.nestedB', eq: 42 })).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 = :c1',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      parseSchemaCondition(mapSchema, {
        attr: 'map.nestedA.nestedB',
        eq: { attr: 'other.nested.value' }
      })
    ).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 = #c4.#c5.#c6',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB',
        '#c4': 'other',
        '#c5': 'nested',
        '#c6': 'value'
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
      parseSchemaCondition(mapAndListSchema, { attr: 'listA[1].nested.listB[2].value', eq: 42 })
    ).toStrictEqual({
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 = :c1',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value'
      },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      parseSchemaCondition(mapAndListSchema, {
        attr: 'listA[1].nested.listB[2].value',
        eq: { attr: 'listC[3].nested.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 = #c5[3].#c6.#c7[4].#c8',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value',
        '#c5': 'listC',
        '#c6': 'nested',
        '#c7': 'listD',
        '#c8': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listSchema = schema({
    listA: list(list(list(number()))),
    listB: list(list(list(number())))
  })

  it('deep lists (value)', () => {
    expect(parseSchemaCondition(listSchema, { attr: 'listA[1][2][3]', eq: 42 })).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] = :c1',
      ExpressionAttributeNames: { '#c1': 'listA' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      parseSchemaCondition(listSchema, { attr: 'listA[1][2][3]', eq: { attr: 'listB[4][5][6]' } })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] = #c2[4][5][6]',
      ExpressionAttributeNames: { '#c1': 'listA', '#c2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseSchemaCondition(simpleSchema, { size: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: 'size(#c1) = :c1',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })
})
