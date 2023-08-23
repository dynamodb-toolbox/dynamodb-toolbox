import { schema, number } from 'v1/schema'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - Not', () => {
  const mySchema = schema({
    num: number(),
    otherNum: number()
  })

  it('negates child condition (value)', () => {
    expect(parseSchemaCondition(mySchema, { not: { attr: 'num', eq: 42 } })).toStrictEqual({
      ConditionExpression: 'NOT (#c1 = :c1)',
      ExpressionAttributeNames: { '#c1': 'num' },
      ExpressionAttributeValues: { ':c1': 42 }
    })
  })

  it('negates child condition (attribute)', () => {
    expect(
      parseSchemaCondition(mySchema, { not: { attr: 'num', eq: { attr: 'otherNum' } } })
    ).toStrictEqual({
      ConditionExpression: 'NOT (#c1 = #c2)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})
