import { item, list, map, number } from 'v1/item'

import { parseCondition } from '../../../../parseCondition'

describe('parseCondition - in', () => {
  const simpleItem = item({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  it('in (values)', () => {
    expect(parseCondition(simpleItem, { attr: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1 IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('in (value + attribute)', () => {
    expect(
      parseCondition(simpleItem, { attr: 'num', in: [42, { attr: 'otherNum' }] })
    ).toStrictEqual({
      ConditionExpression: '#1 IN (:1, #2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('in (attributes)', () => {
    expect(
      parseCondition(simpleItem, {
        attr: 'num',
        in: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1 IN (#2, #3)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum', '#3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  const nestedItem = item({
    map: map({
      nestedA: map({
        nestedB: number()
      })
    }),
    nestedC: map({
      otherNum: number()
    }),
    nestedD: map({
      yetAnotherNum: number()
    })
  })

  it('deep maps (values)', () => {
    expect(parseCondition(nestedItem, { attr: 'map.nestedA.nestedB', in: [42, 43] })).toStrictEqual(
      {
        ConditionExpression: '#1.#2.#3 IN (:1, :2)',
        ExpressionAttributeNames: {
          '#1': 'map',
          '#2': 'nestedA',
          '#3': 'nestedB'
        },
        ExpressionAttributeValues: { ':1': 42, ':2': 43 }
      }
    )
  })

  it('deep maps (attribute + value)', () => {
    expect(
      parseCondition(nestedItem, {
        attr: 'map.nestedA.nestedB',
        in: [{ attr: 'nestedC.otherNum' }, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 IN (#4.#5, :1)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'nestedC',
        '#5': 'otherNum'
      },
      ExpressionAttributeValues: { ':1': 43 }
    })
  })

  it('deep maps (attributes)', () => {
    expect(
      parseCondition(nestedItem, {
        attr: 'map.nestedA.nestedB',
        in: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 IN (#4.#5, #6.#7)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'nestedC',
        '#5': 'otherNum',
        '#6': 'nestedD',
        '#7': 'yetAnotherNum'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndList = item({
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
    ),
    listE: list(
      map({
        nested: map({
          listF: list(map({ value: number() }))
        })
      })
    )
  })

  it('deep maps and lists (values)', () => {
    expect(
      parseCondition(mapAndList, { attr: 'listA[1].nested.listB[2].value', in: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#1[1].#2.#3[2].#4 IN (:1, :2)',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep maps and lists (value + attribute)', () => {
    expect(
      parseCondition(mapAndList, {
        attr: 'listA[1].nested.listB[2].value',
        in: [42, { attr: 'listC[3].nested.listD[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1].#2.#3[2].#4 IN (:1, #5[3].#6.#7[4].#8)',
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
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep maps and lists (attributes)', () => {
    expect(
      parseCondition(mapAndList, {
        attr: 'listA[1].nested.listB[2].value',
        in: [{ attr: 'listC[3].nested.listD[4].value' }, { attr: 'listE[3].nested.listF[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1].#2.#3[2].#4 IN (#5[3].#6.#7[4].#8, #9[3].#10.#11[4].#12)',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value',
        '#5': 'listC',
        '#6': 'nested',
        '#7': 'listD',
        '#8': 'value',
        '#9': 'listE',
        '#10': 'nested',
        '#11': 'listF',
        '#12': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listsItem = item({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  it('deep lists (values)', () => {
    expect(parseCondition(listsItem, { attr: 'list[1][2][3]', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseCondition(listsItem, { attr: 'list[1][2][3]', in: [{ attr: 'listB[4][5][6]' }, 42] })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (#2[4][5][6], :1)',
      ExpressionAttributeNames: { '#1': 'list', '#2': 'listB' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseCondition(listsItem, {
        attr: 'list[1][2][3]',
        in: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (#2[4][5][6], #3[7][8][9])',
      ExpressionAttributeNames: { '#1': 'list', '#2': 'listB', '#3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseCondition(simpleItem, { size: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#1) IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })
})
