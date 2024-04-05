import { schema } from 'v1/schema'
import { list, map, number, string } from 'v1/schema/attributes'

import { ConditionParser } from '../../conditionParser'

describe('parseCondition - singleArgFn', () => {
  const simpleSchema = schema({
    str: string(),
    otherStr: string(),
    list: list(number())
  })

  it('type', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'list', type: 'L' }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 'L' }
    })
  })

  it('contains (value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', contains: 'foo' }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'str' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  it('contains (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'str', contains: { attr: 'otherStr' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'str', '#c_2': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('beginsWith (value)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'str', beginsWith: 'foo' })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'str' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  it('beginsWith (attribute)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'str', beginsWith: { attr: 'otherStr' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'str', '#c_2': 'otherStr' },
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
      mapSchema
        .build(ConditionParser)
        .parse({ attr: 'map.nestedA.nestedB', contains: 'foo' })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB'
      },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  it('deep maps (attribute)', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.nestedA.nestedB',
          contains: { attr: 'otherMap.nestedC.nestedD' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, #c_4.#c_5.#c_6)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'nestedA',
        '#c_3': 'nestedB',
        '#c_4': 'otherMap',
        '#c_5': 'nestedC',
        '#c_6': 'nestedD'
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
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].nested.listB[2].value',
          type: 'S'
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#c_1[1].#c_2.#c_3[2].#c_4, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'nested',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 'S' }
    })
  })

  it('deep maps and lists (attribute)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].nested.listB[2].value',
          beginsWith: { attr: 'listC[3].nested.listD[4].value' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1[1].#c_2.#c_3[2].#c_4, #c_5[3].#c_6.#c_7[4].#c_8)',
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
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = schema({
    list: list(list(list(string()))),
    listB: list(list(list(string())))
  })

  it('deep lists (value)', () => {
    expect(
      listsSchema
        .build(ConditionParser)
        .parse({ attr: 'list[1][2][3]', contains: 'foo' })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1[1][2][3], :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  it('deep lists (attribute)', () => {
    expect(
      listsSchema
        .build(ConditionParser)
        .parse({
          attr: 'list[1][2][3]',
          contains: { attr: 'listB[4][5][6]' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1[1][2][3], #c_2[4][5][6])',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'listB' },
      ExpressionAttributeValues: {}
    })
  })
})
