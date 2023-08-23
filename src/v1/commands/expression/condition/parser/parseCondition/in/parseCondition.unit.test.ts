import { schema, list, map, number } from 'v1/schema'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - in', () => {
  const simpleSchema = schema({
    num: number(),
    otherNum: number(),
    yetAnotherNum: number()
  })

  it('in (values)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#c1 IN (:c1, :c2)',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('in (value + attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'num', in: [42, { attr: 'otherNum' }] })
    ).toStrictEqual({
      ConditionExpression: '#c1 IN (:c1, #c2)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('in (attributes)', () => {
    expect(
      parseSchemaCondition(simpleSchema, {
        attr: 'num',
        in: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1 IN (#c2, #c3)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum', '#c3': 'yetAnotherNum' },
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
      parseSchemaCondition(nestedSchema, { attr: 'map.nestedA.nestedB', in: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 IN (:c1, :c2)',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('deep maps (attribute + value)', () => {
    expect(
      parseSchemaCondition(nestedSchema, {
        attr: 'map.nestedA.nestedB',
        in: [{ attr: 'nestedC.otherNum' }, 43]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 IN (#c4.#c5, :c1)',
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
      parseSchemaCondition(nestedSchema, {
        attr: 'map.nestedA.nestedB',
        in: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1.#c2.#c3 IN (#c4.#c5, #c6.#c7)',
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
      parseSchemaCondition(mapAndList, { attr: 'listA[1].nested.listB[2].value', in: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 IN (:c1, :c2)',
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
      parseSchemaCondition(mapAndList, {
        attr: 'listA[1].nested.listB[2].value',
        in: [42, { attr: 'listC[3].nested.listD[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1].#c2.#c3[2].#c4 IN (:c1, #c5[3].#c6.#c7[4].#c8)',
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
      parseSchemaCondition(mapAndList, {
        attr: 'listA[1].nested.listB[2].value',
        in: [{ attr: 'listC[3].nested.listD[4].value' }, { attr: 'listE[3].nested.listF[4].value' }]
      })
    ).toStrictEqual({
      ConditionExpression:
        '#c1[1].#c2.#c3[2].#c4 IN (#c5[3].#c6.#c7[4].#c8, #c9[3].#c10.#c11[4].#c12)',
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

  const listsSchema = schema({
    list: list(list(list(number()))),
    listB: list(list(list(number()))),
    listC: list(list(list(number())))
  })

  it('deep lists (values)', () => {
    expect(
      parseSchemaCondition(listsSchema, { attr: 'list[1][2][3]', in: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] IN (:c1, :c2)',
      ExpressionAttributeNames: { '#c1': 'list' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseSchemaCondition(listsSchema, {
        attr: 'list[1][2][3]',
        in: [{ attr: 'listB[4][5][6]' }, 42]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] IN (#c2[4][5][6], :c1)',
      ExpressionAttributeNames: { '#c1': 'list', '#c2': 'listB' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseSchemaCondition(listsSchema, {
        attr: 'list[1][2][3]',
        in: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#c1[1][2][3] IN (#c2[4][5][6], #c3[7][8][9])',
      ExpressionAttributeNames: { '#c1': 'list', '#c2': 'listB', '#c3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseSchemaCondition(simpleSchema, { size: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#c1) IN (:c1, :c2)',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 43 }
    })
  })
})
