import { parseCondition } from '../parseCondition'

describe('parseCondition - singleArgFn', () => {
  it('type', () => {
    expect(parseCondition({ path: 'list', type: 'L' })).toStrictEqual({
      ConditionExpression: 'attribute_type(#1, :1)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 'L' }
    })
  })

  it('contains (value)', () => {
    expect(parseCondition({ path: 'str', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#1, :1)',
      ExpressionAttributeNames: { '#1': 'str' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('contains (attribute)', () => {
    expect(parseCondition({ path: 'str', contains: { attr: 'otherStr' } })).toStrictEqual({
      ConditionExpression: 'contains(#1, #2)',
      ExpressionAttributeNames: { '#1': 'str', '#2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('beginsWith (value)', () => {
    expect(parseCondition({ path: 'str', beginsWith: 'foo' })).toStrictEqual({
      ConditionExpression: 'begins_with(#1, :1)',
      ExpressionAttributeNames: { '#1': 'str' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('beginsWith (attribute)', () => {
    expect(parseCondition({ path: 'str', beginsWith: { attr: 'otherStr' } })).toStrictEqual({
      ConditionExpression: 'begins_with(#1, #2)',
      ExpressionAttributeNames: { '#1': 'str', '#2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps (value)', () => {
    expect(parseCondition({ path: 'map.nestedA.nestedB', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#1.#2.#3, :1)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB'
      },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      parseCondition({
        path: 'map.nestedA.nestedB',
        contains: { attr: 'otherMap.nestedC.nestedD' }
      })
    ).toStrictEqual({
      ConditionExpression: 'contains(#1.#2.#3, #4.#5.#6)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'otherMap',
        '#5': 'nestedC',
        '#6': 'nestedD'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps and lists (value)', () => {
    expect(parseCondition({ path: 'listA[1].nested.listB[2].value', type: 'S' })).toStrictEqual({
      ConditionExpression: 'attribute_type(#1[1]#2.#3[2]#4, :1)',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: { ':1': 'S' }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      parseCondition({
        path: 'listA[1].nestedA.listB[2].valueA',
        beginsWith: { attr: 'listC[3].nestedB.listD[4].valueB' }
      })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#1[1]#2.#3[2]#4, #5[3]#6.#7[4]#8)',
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
    expect(parseCondition({ path: 'list[1][2][3]', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#1[1][2][3], :1)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      parseCondition({ path: 'listA[1][2][3]', contains: { attr: 'listB[4][5][6]' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#1[1][2][3], #2[4][5][6])',
      ExpressionAttributeNames: { '#1': 'listA', '#2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })
})
