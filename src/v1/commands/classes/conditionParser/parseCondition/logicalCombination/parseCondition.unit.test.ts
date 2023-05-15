import { item, number, string, boolean } from 'v1/item'
import { parseCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - Logical combination', () => {
  const myItem = item({
    num: number(),
    otherNum: number(),
    str: string(),
    otherStr: string(),
    bool: boolean()
  })

  it('combines OR children conditions (value)', () => {
    expect(
      parseCondition(myItem, {
        or: [
          { attr: 'num', eq: 42 },
          { attr: 'str', eq: 'foo' }
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
      parseCondition(myItem, {
        or: [
          { attr: 'num', eq: { attr: 'otherNum' } },
          { attr: 'str', eq: { attr: 'otherStr' } }
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
      parseCondition(myItem, {
        and: [
          { attr: 'num', eq: 42 },
          { attr: 'str', eq: 'foo' }
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
      parseCondition(myItem, {
        and: [
          { attr: 'num', eq: { attr: 'otherNum' } },
          { attr: 'str', eq: { attr: 'otherStr' } }
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
      parseCondition(myItem, {
        and: [
          {
            or: [
              { attr: 'num', eq: 42 },
              { attr: 'bool', eq: true }
            ]
          },
          { attr: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '((#1 = :1) OR (#2 = :2)) AND (#3 = :3)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'bool', '#3': 'str' },
      ExpressionAttributeValues: { ':1': 42, ':2': true, ':3': 'foo' }
    })
  })
})
