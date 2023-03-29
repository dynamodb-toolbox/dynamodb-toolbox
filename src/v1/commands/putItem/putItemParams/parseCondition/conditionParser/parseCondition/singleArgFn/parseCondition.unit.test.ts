import { item, list, map, number } from 'v1/item'

import { parseCondition } from '../../../../parseCondition'

describe('parseCondition - singleArgFn', () => {
  const simpleItem = item({
    num: number()
  })

  it('exists', () => {
    expect(parseCondition(simpleItem, { path: 'num', exists: true })).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  it('not exists', () => {
    expect(parseCondition(simpleItem, { path: 'num', exists: false })).toStrictEqual({
      ConditionExpression: 'attribute_not_exists(#1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  const mapItem = item({
    map: map({
      nestedA: map({
        nestedB: number()
      })
    })
  })

  it('deep maps', () => {
    expect(parseCondition(mapItem, { path: 'map.nestedA.nestedB', exists: true })).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1.#2.#3)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listItem = item({
    listA: list(
      map({
        nested: map({
          listB: list(map({ value: number() }))
        })
      })
    ),
    list: list(list(list(number())))
  })

  it('deep maps and lists', () => {
    expect(
      parseCondition(listItem, { path: 'listA[1].nested.listB[2].value', exists: true })
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1[1].#2.#3[2].#4)',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('deep lists', () => {
    expect(parseCondition(listItem, { path: 'list[1][2][3]', exists: true })).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1[1][2][3])',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: {}
    })
  })
})
