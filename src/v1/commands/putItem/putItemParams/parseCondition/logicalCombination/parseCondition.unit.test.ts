import { parseCondition } from '../parseCondition'

describe('parseCondition - Logical combination', () => {
  it('combines OR children conditions (value)', () => {
    expect(
      parseCondition({
        or: [
          { path: 'num', eq: 42 },
          { path: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#1 = :1) OR (#2 = :2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'str' },
      ExpressionAttributeValues: { ':1': 42, ':2': 'foo' }
    })
  })

  it('combines OR children conditions (attribute)', () => {
    expect(
      parseCondition({
        or: [
          { path: 'num', eq: { attr: 'otherNum' } },
          { path: 'str', eq: { attr: 'otherStr' } }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#1 = #2) OR (#3 = #4)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum', '#3': 'str', '#4': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('combines AND children conditions (value)', () => {
    expect(
      parseCondition({
        and: [
          { path: 'num', eq: 42 },
          { path: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#1 = :1) AND (#2 = :2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'str' },
      ExpressionAttributeValues: { ':1': 42, ':2': 'foo' }
    })
  })

  it('combines AND children conditions (attribute)', () => {
    expect(
      parseCondition({
        and: [
          { path: 'num', eq: { attr: 'otherNum' } },
          { path: 'str', eq: { attr: 'otherStr' } }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#1 = #2) AND (#3 = #4)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum', '#3': 'str', '#4': 'otherStr' },
      ExpressionAttributeValues: {}
    })
  })

  it('combines nested combinations', () => {
    expect(
      parseCondition({
        and: [
          {
            or: [
              { path: 'num', eq: 42 },
              { path: 'bool', eq: true }
            ]
          },
          { path: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '((#1 = :1) OR (#2 = :2)) AND (#3 = :3)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'bool', '#3': 'str' },
      ExpressionAttributeValues: { ':1': 42, ':2': true, ':3': 'foo' }
    })
  })
})
