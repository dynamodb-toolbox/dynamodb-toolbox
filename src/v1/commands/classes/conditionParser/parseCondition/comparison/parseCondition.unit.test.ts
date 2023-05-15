import { item, map, list, number } from 'v1/item'
import { parseCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - comparison', () => {
  const simpleItem = item({
    num: number(),
    otherNum: number()
  })

  it('equal to (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: '#1 = :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('equal to (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', eq: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 = #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('not equal to (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', ne: 42 })).toStrictEqual({
      ConditionExpression: '#1 <> :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('not equal to (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', ne: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 <> #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', gt: 42 })).toStrictEqual({
      ConditionExpression: '#1 > :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('greater than (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', gt: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 > #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than or equal to (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', gte: 42 })).toStrictEqual({
      ConditionExpression: '#1 >= :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('greater than or equal to (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', gte: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 >= #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', lt: 42 })).toStrictEqual({
      ConditionExpression: '#1 < :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('less than (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', lt: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 < #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than or equal to (value)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', lte: 42 })).toStrictEqual({
      ConditionExpression: '#1 <= :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('less than or equal to (attribute)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', lte: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 <= #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  const mapItem = item({
    map: map({
      nestedA: map({ nestedB: number() })
    }),
    other: map({
      nested: map({ value: number() })
    })
  })

  it('deep maps (value)', () => {
    expect(parseCondition(mapItem, { attr: 'map.nestedA.nestedB', eq: 42 })).toStrictEqual({
      ConditionExpression: '#1.#2.#3 = :1',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB'
      },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      parseCondition(mapItem, { attr: 'map.nestedA.nestedB', eq: { attr: 'other.nested.value' } })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 = #4.#5.#6',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'other',
        '#5': 'nested',
        '#6': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndListItem = item({
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
      parseCondition(mapAndListItem, { attr: 'listA[1].nested.listB[2].value', eq: 42 })
    ).toStrictEqual({
      ConditionExpression: '#1[1].#2.#3[2].#4 = :1',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      parseCondition(mapAndListItem, {
        attr: 'listA[1].nested.listB[2].value',
        eq: { attr: 'listC[3].nested.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1].#2.#3[2].#4 = #5[3].#6.#7[4].#8',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value',
        '#5': 'listC',
        '#6': 'nested',
        '#7': 'listD',
        '#8': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listItem = item({
    listA: list(list(list(number()))),
    listB: list(list(list(number())))
  })

  it('deep lists (value)', () => {
    expect(parseCondition(listItem, { attr: 'listA[1][2][3]', eq: 42 })).toStrictEqual({
      ConditionExpression: '#1[1][2][3] = :1',
      ExpressionAttributeNames: { '#1': 'listA' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      parseCondition(listItem, { attr: 'listA[1][2][3]', eq: { attr: 'listB[4][5][6]' } })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] = #2[4][5][6]',
      ExpressionAttributeNames: { '#1': 'listA', '#2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseCondition(simpleItem, { size: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: 'size(#1) = :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })
})
