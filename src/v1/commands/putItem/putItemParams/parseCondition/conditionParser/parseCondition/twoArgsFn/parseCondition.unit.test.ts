import { item, list, map, number, string } from 'v1/item'

import { parseCondition } from '../../../../parseCondition'

describe('parseCondition - singleArgFn', () => {
  const simpleItem = item({
    str: string(),
    otherStr: string(),
    list: list(number())
  })

  it('type', () => {
    expect(parseCondition(simpleItem, { path: 'list', type: 'L' })).toStrictEqual({
      ConditionExpression: 'attribute_type(#1, :1)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 'L' }
    })
  })

  it('contains (value)', () => {
    expect(parseCondition(simpleItem, { path: 'str', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#1, :1)',
      ExpressionAttributeNames: { '#1': 'str' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('contains (attribute)', () => {
    expect(
      parseCondition(simpleItem, { path: 'str', contains: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#1, #2)',
      ExpressionAttributeNames: { '#1': 'str', '#2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('beginsWith (value)', () => {
    expect(parseCondition(simpleItem, { path: 'str', beginsWith: 'foo' })).toStrictEqual({
      ConditionExpression: 'begins_with(#1, :1)',
      ExpressionAttributeNames: { '#1': 'str' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('beginsWith (attribute)', () => {
    expect(
      parseCondition(simpleItem, { path: 'str', beginsWith: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#1, #2)',
      ExpressionAttributeNames: { '#1': 'str', '#2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  const mapItem = item({
    map: map({
      nestedA: map({
        nestedB: string()
      })
    }),
    otherMap: map({
      nestedC: map({
        nestedD: string()
      })
    })
  })

  it('deep maps (value)', () => {
    expect(parseCondition(mapItem, { path: 'map.nestedA.nestedB', contains: 'foo' })).toStrictEqual(
      {
        ConditionExpression: 'contains(#1.#2.#3, :1)',
        ExpressionAttributeNames: {
          '#1': 'map',
          '#2': 'nestedA',
          '#3': 'nestedB'
        },
        ExpressionAttributeValues: { ':1': 'foo' }
      }
    )
  })

  it('deep maps (attribute)', () => {
    expect(
      parseCondition(mapItem, {
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

  const mapAndList = item({
    listA: list(
      map({
        nested: map({
          listB: list(map({ value: string() }))
        })
      })
    ),
    listC: list(
      map({
        nested: map({
          listD: list(map({ value: string() }))
        })
      })
    )
  })

  it('deep maps and lists (value)', () => {
    expect(
      parseCondition(mapAndList, { path: 'listA[1].nested.listB[2].value', type: 'S' })
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#1[1].#2.#3[2].#4, :1)',
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
      parseCondition(mapAndList, {
        path: 'listA[1].nested.listB[2].value',
        beginsWith: { attr: 'listC[3].nested.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#1[1].#2.#3[2].#4, #5[3].#6.#7[4].#8)',
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

  const listsItem = item({
    list: list(list(list(string()))),
    listB: list(list(list(string())))
  })

  it('deep lists (value)', () => {
    expect(parseCondition(listsItem, { path: 'list[1][2][3]', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#1[1][2][3], :1)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      parseCondition(listsItem, { path: 'list[1][2][3]', contains: { attr: 'listB[4][5][6]' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#1[1][2][3], #2[4][5][6])',
      ExpressionAttributeNames: { '#1': 'list', '#2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })
})
