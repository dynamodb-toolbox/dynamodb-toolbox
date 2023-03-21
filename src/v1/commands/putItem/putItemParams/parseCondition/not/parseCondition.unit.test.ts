import { parseCondition } from '../parseCondition'

describe('parseCondition - Not', () => {
  it('negates child condition (value)', () => {
    expect(parseCondition({ not: { path: 'num', eq: 42 } })).toStrictEqual({
      ConditionExpression: 'NOT (#1 = :1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('negates child condition (attribute)', () => {
    expect(parseCondition({ not: { path: 'num', eq: { attr: 'otherNum' } } })).toStrictEqual({
      ConditionExpression: 'NOT (#1 = #2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: {}
    })
  })
})
