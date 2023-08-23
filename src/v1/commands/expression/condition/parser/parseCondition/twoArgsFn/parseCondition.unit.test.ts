import { schema, list, map, number, string } from 'v1/schema'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - singleArgFn', () => {
  const simpleSchema = schema({
    str: string(),
    otherStr: string(),
    list: list(number())
  })

  it('type', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'list', type: 'L' })).toStrictEqual({
      ConditionExpression: 'attribute_type(#c1, :c1)',
      ExpressionAttributeNames: { '#c1': 'list' },
      ExpressionAttributeValues: { ':c1': 'L' }
    })
  })

  it('contains (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'str', contains: 'foo' })).toStrictEqual({
      ConditionExpression: 'contains(#c1, :c1)',
      ExpressionAttributeNames: { '#c1': 'str' },
      ExpressionAttributeValues: { ':c1': 'foo' }
    })
  })

  it('contains (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'str', contains: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c1, #c2)',
      ExpressionAttributeNames: { '#c1': 'str', '#c2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('beginsWith (value)', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'str', beginsWith: 'foo' })).toStrictEqual({
      ConditionExpression: 'begins_with(#c1, :c1)',
      ExpressionAttributeNames: { '#c1': 'str' },
      ExpressionAttributeValues: { ':c1': 'foo' }
    })
  })

  it('beginsWith (attribute)', () => {
    expect(
      parseSchemaCondition(simpleSchema, { attr: 'str', beginsWith: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c1, #c2)',
      ExpressionAttributeNames: { '#c1': 'str', '#c2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  const mapSchema = schema({
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
    expect(
      parseSchemaCondition(mapSchema, { attr: 'map.nestedA.nestedB', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c1.#c2.#c3, :c1)',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c1': 'foo' }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      parseSchemaCondition(mapSchema, {
        attr: 'map.nestedA.nestedB',
        contains: { attr: 'otherMap.nestedC.nestedD' }
      })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c1.#c2.#c3, #c4.#c5.#c6)',
      ExpressionAttributeNames: {
        '#c1': 'map',
        '#c2': 'nestedA',
        '#c3': 'nestedB',
        '#c4': 'otherMap',
        '#c5': 'nestedC',
        '#c6': 'nestedD'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndList = schema({
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
      parseSchemaCondition(mapAndList, { attr: 'listA[1].nested.listB[2].value', type: 'S' })
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#c1[1].#c2.#c3[2].#c4, :c1)',
      ExpressionAttributeNames: {
        '#c1': 'listA',
        '#c2': 'nested',
        '#c3': 'listB',
        '#c4': 'value'
      },
      ExpressionAttributeValues: { ':c1': 'S' }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      parseSchemaCondition(mapAndList, {
        attr: 'listA[1].nested.listB[2].value',
        beginsWith: { attr: 'listC[3].nested.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c1[1].#c2.#c3[2].#c4, #c5[3].#c6.#c7[4].#c8)',
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
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = schema({
    list: list(list(list(string()))),
    listB: list(list(list(string())))
  })

  it('deep lists (value)', () => {
    expect(
      parseSchemaCondition(listsSchema, { attr: 'list[1][2][3]', contains: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c1[1][2][3], :c1)',
      ExpressionAttributeNames: { '#c1': 'list' },
      ExpressionAttributeValues: { ':c1': 'foo' }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      parseSchemaCondition(listsSchema, {
        attr: 'list[1][2][3]',
        contains: { attr: 'listB[4][5][6]' }
      })
    ).toStrictEqual({
      ConditionExpression: 'contains(#c1[1][2][3], #c2[4][5][6])',
      ExpressionAttributeNames: { '#c1': 'list', '#c2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })
})
