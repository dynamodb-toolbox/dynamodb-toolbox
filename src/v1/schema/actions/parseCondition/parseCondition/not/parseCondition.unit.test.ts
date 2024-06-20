import { schema } from 'v1/schema/index.js'
import { number } from 'v1/schema/attributes/index.js'

import { ConditionParser } from '../../conditionParser.js'

describe('parseCondition - Not', () => {
  const mySchema = schema({
    num: number(),
    otherNum: number()
  })

  it('negates child condition (value)', () => {
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

  it('negates child condition (attribute)', () => {
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
