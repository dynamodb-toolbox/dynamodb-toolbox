import { schema, number, list, map } from 'v1/schema'
import { parseSchemaCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - between', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  it('between (values)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#c1 BETWEEN :c1 AND :c2',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('between (value + attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, {
        attr: 'num',
        between: [42, { attr: 'otherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1 BETWEEN :c1 AND #c2',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('between (attributes)', () => {
    expect(
      parseSchemaCondition(simpleSchema, {
        attr: 'num',
        between: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1 BETWEEN #c2 AND #c3',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum', '#c3': 'yetAnotherNum' },
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
      ConditionExpression: '#c1.#c2.#c3 BETWEEN :c1 AND :c2',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
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
      ConditionExpression: '#c1.#c2.#c3 BETWEEN #c4.#c5 AND :c1',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB',
        '#c4': 'nestedC',
        '#c5': 'otherNum'
      },
      ExpressionAttributeValues: { ':c1': 43 }
    })
  })

  it('deep maps (attributes)', () => {
    expect(
      parseSchemaCondition(deepMapsSchema, {
        attr: 'map.nestedA.nestedB',
        between: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 BETWEEN #c4.#c5 AND #c6.#c7',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB',
        '#c4': 'nestedC',
        '#c5': 'otherNum',
        '#c6': 'nestedD',
        '#c7': 'yetAnotherNum'
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
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 BETWEEN :c1 AND :c2',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value'
      },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('deep maps and lists (value + attribute)', () => {
    expect(
      parseSchemaCondition(deepMapsAndListsSchema, {
        attr: 'listA[1].nested.listB[2].value',
        between: [42, { attr: 'listC[3].nested.listD[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 BETWEEN :c1 AND #c5[3].#c6.#c7[4].#c8',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value',
        '#c5': 'listC',
        '#c6': 'nested',
        '#c7': 'listD',
        '#c8': 'value'
      },
      ExpressionAttributeValues: { ':c1': 42 }
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
        '#c1[1].#c2.#c3[2].#c4 BETWEEN #c5[3].#c6.#c7[4].#c8 AND #c9[3].#c10.#c11[4].#c12',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value',
        '#c5': 'listC',
        '#c6': 'nested',
        '#c7': 'listD',
        '#c8': 'value',
        '#c9': 'listE',
        '#c10': 'nested',
        '#c11': 'listF',
        '#c12': 'value'
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
      ConditionExpression: '#c1[1][2][3] BETWEEN :c1 AND :c2',
      ExpressionAttributeNames: { '#c1': 'list' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseSchemaCondition(deepListsSchema, {
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, 42]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] BETWEEN #c2[4][5][6] AND :c1',
      ExpressionAttributeNames: { '#c1': 'list', '#c2': 'listB' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseSchemaCondition(deepListsSchema, {
        attr: 'list[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] BETWEEN #c2[4][5][6] AND #c3[7][8][9]',
      ExpressionAttributeNames: { '#c1': 'list', '#c2': 'listB', '#c3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseSchemaCondition(simpleSchema, { size: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#c1) BETWEEN :c1 AND :c2',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })
})
