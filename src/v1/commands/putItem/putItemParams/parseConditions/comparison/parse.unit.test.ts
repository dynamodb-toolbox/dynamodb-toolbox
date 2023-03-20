import { parseConditions } from '../parseConditions'

describe('parseConditions - comparison', () => {
  it('equal to (value)', () => {
    expect(parseConditions({ path: 'num', eq: 42 })).toStrictEqual({
      ConditionExpression: '#1 = :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('equal to (attribute)', () => {
    expect(parseConditions({ path: 'num', eq: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 = #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('not equal to (value)', () => {
    expect(parseConditions({ path: 'num', ne: 42 })).toStrictEqual({
      ConditionExpression: '#1 <> :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('not equal to (attribute)', () => {
    expect(parseConditions({ path: 'num', ne: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 <> #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than (value)', () => {
    expect(parseConditions({ path: 'num', gt: 42 })).toStrictEqual({
      ConditionExpression: '#1 > :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('greater than (attribute)', () => {
    expect(parseConditions({ path: 'num', gt: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 > #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('greater than or equal to (value)', () => {
    expect(parseConditions({ path: 'num', gte: 42 })).toStrictEqual({
      ConditionExpression: '#1 >= :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('greater than or equal to (attribute)', () => {
    expect(parseConditions({ path: 'num', gte: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 >= #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than (value)', () => {
    expect(parseConditions({ path: 'num', lt: 42 })).toStrictEqual({
      ConditionExpression: '#1 < :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('less than (attribute)', () => {
    expect(parseConditions({ path: 'num', lt: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 < #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('less than or equal to (value)', () => {
    expect(parseConditions({ path: 'num', lte: 42 })).toStrictEqual({
      ConditionExpression: '#1 <= :1',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('less than or equal to (attribute)', () => {
    expect(parseConditions({ path: 'num', lte: { attr: 'otherNum' } })).toStrictEqual({
      ConditionExpression: '#1 <= #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})

it('deep maps (value)', () => {
  expect(parseConditions({ path: 'map.nestedA.nestedB', eq: 42 })).toStrictEqual({
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
    parseConditions({ path: 'map.nestedA.nestedB', eq: { attr: 'other.nested.value' } })
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

it('deep maps and lists (value)', () => {
  expect(parseConditions({ path: 'listA[1].nested.listB[2].value', eq: 42 })).toStrictEqual({
    ConditionExpression: '#1[1]#2.#3[2]#4 = :1',
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
    parseConditions({
      path: 'listA[1].nestedA.listB[2].valueA',
      eq: { attr: 'listC[3].nestedB.listD[4].valueB' }
    })
  ).toStrictEqual({
    ConditionExpression: '#1[1]#2.#3[2]#4 = #5[3]#6.#7[4]#8',
    ExpressionAttributeNames: {
      '#1': 'listA',
      '#2': 'nestedA',
      '#3': 'listB',
      '#4': 'valueA',
      '#5': 'listC',
      '#6': 'nestedB',
      '#7': 'listD',
      '#8': 'valueB'
    },
    ExpressionAttributeValues: {}
  })
})

it('deep lists (value)', () => {
  expect(parseConditions({ path: 'list[1][2][3]', eq: 42 })).toStrictEqual({
    ConditionExpression: '#1[1][2][3] = :1',
    ExpressionAttributeNames: { '#1': 'list' },
    ExpressionAttributeValues: { ':1': 42 }
  })
})

it('deep lists (attribute)', () => {
  expect(parseConditions({ path: 'listA[1][2][3]', eq: { attr: 'listB[4][5][6]' } })).toStrictEqual(
    {
      ConditionExpression: '#1[1][2][3] = #2[4][5][6]',
      ExpressionAttributeNames: { '#1': 'listA', '#2': 'listB' },
      ExpressionAttributeValues: {}
    }
  )
})
