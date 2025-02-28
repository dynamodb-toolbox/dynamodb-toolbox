import { item, list, map, number } from '~/schema/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - in', () => {
  const simpleSchema = item({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  test('in (values)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 IN (:c_1, :c_2)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('in (value + attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'num', in: [42, { attr: 'otherNum' }] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 IN (:c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('in (attributes)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({
          attr: 'num',
          in: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1 IN (#c_2, #c_3)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum', '#c_3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  const deepSchema = item({
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

  test('deep maps (values)', () => {
    expect(
      deepSchema
        .build(ConditionParser)
        .parse({ attr: 'map.deepA.deepB', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (:c_1, :c_2)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('deep maps (attribute + value)', () => {
    expect(
      deepSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.deepA.deepB',
          in: [{ attr: 'deepC.otherNum' }, 43]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (#c_4.#c_5, :c_1)',
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
      deepSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.deepA.deepB',
          in: [{ attr: 'deepC.otherNum' }, { attr: 'deepD.yetAnotherNum' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (#c_4.#c_5, #c_6.#c_7)',
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

  const mapAndList = item({
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
      mapAndList
        .build(ConditionParser)
        .parse({ attr: 'listA[1].deep.listB[2].value', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 IN (:c_1, :c_2)',
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
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].deep.listB[2].value',
          in: [42, { attr: 'listC[3].deep.listD[4].value' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 IN (:c_1, #c_5[3].#c_6.#c_7[4].#c_8)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'deep',
        '#c_7': 'listD',
        '#c_8': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep maps and lists (attributes)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].deep.listB[2].value',
          in: [{ attr: 'listC[3].deep.listD[4].value' }, { attr: 'listE[3].deep.listF[4].value' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression:
        '#c_1[1].#c_2.#c_3[2].#c_4 IN (#c_5[3].#c_6.#c_7[4].#c_8, #c_9[3].#c_10.#c_11[4].#c_12)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'deep',
        '#c_7': 'listD',
        '#c_8': 'value',
        '#c_9': 'listE',
        '#c_10': 'deep',
        '#c_11': 'listF',
        '#c_12': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = item({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  test('deep lists (values)', () => {
    expect(
      listsSchema
        .build(ConditionParser)
        .parse({ attr: 'list[1][2][3]', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] IN (:c_1, :c_2)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  test('deep lists (attribute + value)', () => {
    expect(
      listsSchema
        .build(ConditionParser)
        .parse({
          attr: 'list[1][2][3]',
          in: [{ attr: 'listB[4][5][6]' }, 42]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] IN (#c_2[4][5][6], :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('deep lists (attributes)', () => {
    expect(
      listsSchema
        .build(ConditionParser)
        .parse({
          attr: 'list[1][2][3]',
          in: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] IN (#c_2[4][5][6], #c_3[7][8][9])',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB', '#c_3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  test('with size', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ size: 'num', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'size(#c_1) IN (:c_1, :c_2)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })
})
