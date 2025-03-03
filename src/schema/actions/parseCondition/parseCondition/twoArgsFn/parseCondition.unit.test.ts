import { item, list, map, number, set, string } from '~/schema/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - singleArgFn', () => {
  const simpleSchema = item({
    str: string(),
    otherStr: string(),
    set: set(string()),
    list: list(number()),
    num: number()
  })

  test('type', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'list', type: 'L' }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 'L' }
    })
  })

  test('contains (str - value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', contains: 'foo' }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'str' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('contains (str - reference)', () => {
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

  test('contains (list - value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'list', contains: 42 }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('contains (list - reference)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'list', contains: { attr: 'num' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'list', '#c_2': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  test('contains (set - value)', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'set', contains: 'foo' }).toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'set' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('contains (set - reference)', () => {
    expect(
      simpleSchema
        .build(ConditionParser)
        .parse({ attr: 'set', contains: { attr: 'str' } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'set', '#c_2': 'str' },
      ExpressionAttributeValues: {}
    })
  })

  test('beginsWith (value)', () => {
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

  test('beginsWith (attribute)', () => {
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

  const mapSchema = item({
    map: map({
      deepA: map({
        deepB: string()
      })
    }),
    otherMap: map({
      deepC: map({
        deepD: string()
      })
    })
  })

  test('deep maps (value)', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({ attr: 'map.deepA.deepB', contains: 'foo' })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB'
      },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('deep maps (attribute)', () => {
    expect(
      mapSchema
        .build(ConditionParser)
        .parse({
          attr: 'map.deepA.deepB',
          contains: { attr: 'otherMap.deepC.deepD' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'contains(#c_1.#c_2.#c_3, #c_4.#c_5.#c_6)',
      ExpressionAttributeNames: {
        '#c_1': 'map',
        '#c_2': 'deepA',
        '#c_3': 'deepB',
        '#c_4': 'otherMap',
        '#c_5': 'deepC',
        '#c_6': 'deepD'
      },
      ExpressionAttributeValues: {}
    })
  })

  const mapAndList = item({
    listA: list(
      map({
        deep: map({
          listB: list(map({ value: string() }))
        })
      })
    ),
    listC: list(
      map({
        deep: map({
          listD: list(map({ value: string() }))
        })
      })
    )
  })

  test('deep maps and lists (value)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].deep.listB[2].value',
          type: 'S'
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'attribute_type(#c_1[1].#c_2.#c_3[2].#c_4, :c_1)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value'
      },
      ExpressionAttributeValues: { ':c_1': 'S' }
    })
  })

  test('deep maps and lists (attribute)', () => {
    expect(
      mapAndList
        .build(ConditionParser)
        .parse({
          attr: 'listA[1].deep.listB[2].value',
          beginsWith: { attr: 'listC[3].deep.listD[4].value' }
        })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1[1].#c_2.#c_3[2].#c_4, #c_5[3].#c_6.#c_7[4].#c_8)',
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
      ExpressionAttributeValues: {}
    })
  })

  const listsSchema = item({
    list: list(list(list(string()))),
    listB: list(list(list(string())))
  })

  test('deep lists (value)', () => {
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

  test('deep lists (attribute)', () => {
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
