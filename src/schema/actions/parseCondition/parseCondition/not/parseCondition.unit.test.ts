import { item, number } from '~/schema/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - Not', () => {
  const mySchema = item({
    num: number(),
    otherNum: number()
  })

  test('negates child condition (value)', () => {
    expect(
      mySchema
        .build(ConditionParser)
        .parse({ not: { attr: 'num', eq: 42 } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'NOT (#c_1 = :c_1)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  test('negates child condition (attribute)', () => {
    expect(
      mySchema
        .build(ConditionParser)
        .parse({ not: { attr: 'num', eq: { attr: 'otherNum' } } })
        .toCommandOptions()
    ).toStrictEqual({
      ConditionExpression: 'NOT (#c_1 = #c_2)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})
