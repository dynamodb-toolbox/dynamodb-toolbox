import { item, list, map, number } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('parseCondition - between', () => {
  const simpleSchema = item({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  test('between (values)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'num', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('between (value + attribute)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({
        attr: 'num',
        between: [42, { attr: 'otherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN :c_1 AND #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('between (attributes)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({
        attr: 'num',
        between: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN #c_2 AND #c_3',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum', '#c_3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  test('between (free)', () => {
    expect(simpleSchema.build(ConditionParser).parse({ value: 1, between: [2, 3] })).toStrictEqual({
      ConditionExpression: ':c_1 BETWEEN :c_2 AND :c_3',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: { ':c_1': 1, ':c_2': 2, ':c_3': 3 }
    })
  })

  test('deep maps (values)', () => {
    const sch = item({
      map: map({
        deepA: map({
          deepB: number()
        })
      })
    })

    expect(
      sch.build(ConditionParser).parse({
        attr: 'map.deepA.deepB',
        between: [42, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  const deepMapsSchema = item({
    map: map({
      deepA: map({
        deepB: number()
      })
    }),
    deepC: map({
      otherNum: number()
    }),
    deepD: map({
      yetAnotherNum: number()
    })
  })

  test('deep maps (attribute + value)', () => {
    expect(
      deepMapsSchema.build(ConditionParser).parse({
        attr: 'map.deepA.deepB',
        between: [{ attr: 'deepC.otherNum' }, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN #c_4.#c_5 AND :c_1',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB',
        '#c_4': 'deepC',
        '#c_5': 'otherNum'
      },
      ExpressionAttributeValues: { ':c_1': 43 }
    })
  })

  test('deep maps (attributes)', () => {
    expect(
      deepMapsSchema.build(ConditionParser).parse({
        attr: 'map.deepA.deepB',
        between: [{ attr: 'deepC.otherNum' }, { attr: 'deepD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN #c_4.#c_5 AND #c_6.#c_7',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB',
        '#c_4': 'deepC',
        '#c_5': 'otherNum',
        '#c_6': 'deepD',
        '#c_7': 'yetAnotherNum'
      },
      ExpressionAttributeValues: {}
    })
  })

  const deepMapsAndListsSchema = item({
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
    ),
    listE: list(
      map({
        deep: map({
          listF: list(map({ value: number() }))
        })
      })
    )
  })

  test('deep maps and lists (values)', () => {
    expect(
      deepMapsAndListsSchema.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        between: [42, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('deep maps and lists (value + attribute)', () => {
    expect(
      deepMapsAndListsSchema.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        between: [42, { attr: 'listC[3].deep.listD[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN :c_1 AND #c_5[3].#c_2.#c_6[4].#c_4',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'listD'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep maps and lists (attributes)', () => {
    expect(
      deepMapsAndListsSchema.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        between: [
          { attr: 'listC[3].deep.listD[4].value' },
          { attr: 'listE[3].deep.listF[4].value' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression:
        '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN #c_5[3].#c_2.#c_6[4].#c_4 AND #c_7[3].#c_2.#c_8[4].#c_4',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'listD',
        '#c_7': 'listE',
        '#c_8': 'listF'
      },
      ExpressionAttributeValues: {}
    })
  })

  const deepListsSchema = item({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  test('deep lists (values)', () => {
    expect(
      deepListsSchema.build(ConditionParser).parse({ attr: 'list[1][2][3]', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('deep lists (attribute + value)', () => {
    expect(
      deepListsSchema.build(ConditionParser).parse({
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, 42]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN #c_2[4][5][6] AND :c_1',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep lists (attributes)', () => {
    expect(
      deepListsSchema.build(ConditionParser).parse({
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN #c_2[4][5][6] AND #c_3[7][8][9]',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB', '#c_3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  test('with size', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ size: 'num', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: 'size(#c_1) BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })
})
