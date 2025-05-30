import { item, list, map, number, set, string } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('parseCondition - type', () => {
  const simpleSchema = item({
    str: string(),
    otherStr: string(),
    set: set(string()),
    list: list(number()),
    num: number()
  })

  test('root', () => {
    expect(simpleSchema.build(ConditionParser).parse({ attr: 'list', type: 'L' })).toStrictEqual({
      ConditionExpression: 'attribute_type(#c_1, :c_1)',
      ExpressionAttributeNames: { '#c_1': 'list' },
      ExpressionAttributeValues: { ':c_1': 'L' }
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
      mapAndList.build(ConditionParser).parse({
        attr: 'listA[1].deep.listB[2].value',
        type: 'S'
      })
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
})
