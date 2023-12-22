import { schema, number, list, map } from 'v1/schema'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - between', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  it('between (values)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  it('between (value + attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, {
        attr: 'num',
        between: [42, { attr: 'otherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN :c_1 AND #c_2',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('between (attributes)', () => {
    expect(
      parseSchemaCondition(simpleSchema, {
        attr: 'num',
        between: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1 BETWEEN #c_2 AND #c_3',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum', '#c_3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps (values)', () => {
    expect(
      parseSchemaCondition(
        schema({
          map: map({
            nestedA: map({
              nestedB: number()
            })
          })
        }),
        {
          attr: 'map.nestedA.nestedB',
          between: [42, 43]
        }
      )
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  const deepMapsSchema = schema({
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

  it('deep maps (attribute + value)', () => {
    expect(
      parseSchemaCondition(deepMapsSchema, {
        attr: 'map.nestedA.nestedB',
        between: [{ attr: 'nestedC.otherNum' }, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN #c_4.#c_5 AND :c_1',
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
      parseSchemaCondition(deepMapsSchema, {
        attr: 'map.nestedA.nestedB',
        between: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1.#c_2.#c_3 BETWEEN #c_4.#c_5 AND #c_6.#c_7',
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

  const deepMapsAndListsSchema = schema({
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
      parseSchemaCondition(deepMapsAndListsSchema, {
        attr: 'listA[1].nested.listB[2].value',
        between: [42, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN :c_1 AND :c_2',
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
      parseSchemaCondition(deepMapsAndListsSchema, {
        attr: 'listA[1].nested.listB[2].value',
        between: [42, { attr: 'listC[3].nested.listD[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN :c_1 AND #c_5[3].#c_6.#c_7[4].#c_8',
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
      parseSchemaCondition(deepMapsAndListsSchema, {
        attr: 'listA[1].nested.listB[2].value',
        between: [
          { attr: 'listC[3].nested.listD[4].value' },
          { attr: 'listE[3].nested.listF[4].value' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression:
        '#c_1[1].#c_2.#c_3[2].#c_4 BETWEEN #c_5[3].#c_6.#c_7[4].#c_8 AND #c_9[3].#c_10.#c_11[4].#c_12',
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

  const deepListsSchema = schema({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  it('deep lists (values)', () => {
    expect(
      parseSchemaCondition(deepListsSchema, { attr: 'list[1][2][3]', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseSchemaCondition(deepListsSchema, {
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, 42]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN #c_2[4][5][6] AND :c_1',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseSchemaCondition(deepListsSchema, {
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c_1[1][2][3] BETWEEN #c_2[4][5][6] AND #c_3[7][8][9]',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB', '#c_3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseSchemaCondition(simpleSchema, { size: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#c_1) BETWEEN :c_1 AND :c_2',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 43 }
    })
  })
})
