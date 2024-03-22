import { schema } from 'v1/schema'
import { number } from 'v1/schema/attributes'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - Not', () => {
  const mySchema = schema({
    num: number(),
    otherNum: number()
  })

  it('negates child condition (value)', () => {
    expect(parseSchemaCondition(mySchema, { not: { attr: 'num', eq: 42 } })).toStrictEqual({
      ConditionExpression: 'NOT (#c_1 = :c_1)',
      ExpressionAttributeNames: { '#c_1': 'num' },
      ExpressionAttributeValues: { ':c_1': 42 }
    })
  })

  it('negates child condition (attribute)', () => {
    expect(
      parseSchemaCondition(mySchema, { not: { attr: 'num', eq: { attr: 'otherNum' } } })
    ).toStrictEqual({
      ConditionExpression: 'NOT (#c_1 = #c_2)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})
