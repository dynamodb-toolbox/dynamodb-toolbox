import { schema } from 'v1/schema'
import { list, map, number } from 'v1/schema/attributes'

import { ConditionParser } from '../../conditionParser'

describe('parseCondition - in', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  it('in (values)', () => {
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

  it('in (value + attribute)', () => {
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

  it('in (attributes)', () => {
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

  const nestedSchema = schema({
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
    expect(
      nestedSchema
        .build(ConditionParser)
        .parse({ attr: 'map.nestedA.nestedB', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (:c_1, :c_2)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  it('deep maps (attribute + value)', () => {
    expect(
      nestedSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.nestedA.nestedB',
          in: [{ attr: 'nestedC.otherNum' }, 43]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (#c_4.#c_5, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB',
        '#c_4': 'nestedC',
        '#c_5': 'otherNum'
      },
      ExpressionAttributeValues: { ':c_1': 43 }
    })
  })

  it('deep maps (attributes)', () => {
    expect(
      nestedSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.nestedA.nestedB',
          in: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 IN (#c_4.#c_5, #c_6.#c_7)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB',
        '#c_4': 'nestedC',
        '#c_5': 'otherNum',
        '#c_6': 'nestedD',
        '#c_7': 'yetAnotherNum'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndList = schema({
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
      mapAndList
        .build(ConditionParser)
        .parse({ attr: 'listA[1].nested.listB[2].value', in: [42, 43] })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 IN (:c_1, :c_2)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  it('deep maps and lists (value + attribute)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].nested.listB[2].value',
          in: [42, { attr: 'listC[3].nested.listD[4].value' }]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 IN (:c_1, #c_5[3].#c_6.#c_7[4].#c_8)',
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
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('deep maps and lists (attributes)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].nested.listB[2].value',
          in: [
            { attr: 'listC[3].nested.listD[4].value' },
            { attr: 'listE[3].nested.listF[4].value' }
          ]
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression:
        '#c_1[1].#c_2.#c_3[2].#c_4 IN (#c_5[3].#c_6.#c_7[4].#c_8, #c_9[3].#c_10.#c_11[4].#c_12)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'nested',
        '#c_7': 'listD',
        '#c_8': 'value',
        '#c_9': 'listE',
        '#c_10': 'nested',
        '#c_11': 'listF',
        '#c_12': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = schema({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  it('deep lists (values)', () => {
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

  it('deep lists (attribute + value)', () => {
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

  it('deep lists (attributes)', () => {
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

  it('with size', () => {
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
