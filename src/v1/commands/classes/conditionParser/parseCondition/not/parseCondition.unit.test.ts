import { schema, number } from 'v1/schema'
import { parseCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - Not', () => {
  const mySchema = schema({
    num: number(),
    otherNum: number()
  })

  it('negates child condition (value)', () => {
    expect(parseCondition(mySchema, { not: { attr: 'num', eq: 42 } })).toStrictEqual({
      ConditionExpression: 'NOT (#1 = :1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('negates child condition (attribute)', () => {
    expect(
      parseCondition(mySchema, { not: { attr: 'num', eq: { attr: 'otherNum' } } })
    ).toStrictEqual({
      ConditionExpression: 'NOT (#1 = #2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})
