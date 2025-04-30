import { item, list, map, number, set, string } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('parseCondition - beginsWith', () => {
  const simpleSchema = item({
    str: string(),
    otherStr: string(),
    set: set(string()),
    list: list(number()),
    num: number()
  })

  test('value', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', beginsWith: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'str' },
      ExpressionAttributeValues: { ':c_1': 'foo' }
    })
  })

  test('attribute', () => {
    expect(
      simpleSchema.build(ConditionParser).parse({ attr: 'str', beginsWith: { attr: 'otherStr' } })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1, #c_2)',
      ExpressionAttributeNames: { '#c_1': 'str', '#c_2': 'otherStr' },
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

  test('deep maps and lists (attribute)', () => {
    expect(
      mapAndList.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        beginsWith: { attr: 'listC[3].deep.listD[4].value' }
      })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#c_1[1].#c_2.#c_3[2].#c_4, #c_5[3].#c_2.#c_6[4].#c_4)',
      ExpressionAttributeNames: {
        '#c_1': 'listA',
        '#c_2': 'deep',
        '#c_3': 'listB',
        '#c_4': 'value',
        '#c_5': 'listC',
        '#c_6': 'listD'
      },
      ExpressionAttributeValues: {}
    })
  })
})
