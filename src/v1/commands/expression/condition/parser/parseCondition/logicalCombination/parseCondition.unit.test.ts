import { schema, number, string, boolean } from 'v1/schema'

import { parseSchemaCondition } from '../../../parse'

describe('parseCondition - Logical combination', () => {
  const mySchema = schema({
    num: number(),
    otherNum: number(),
    str: string(),
    otherStr: string(),
    bool: boolean()
  })

  it('combines OR children conditions (value)', () => {
    expect(
      parseSchemaCondition(mySchema, {
        or: [
          { attr: 'num', eq: 42 },
          { attr: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#c_1 = :c_1) OR (#c_2 = :c_2)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'str' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 'foo' }
    })
  })

  it('combines OR children conditions (attribute)', () => {
    expect(
      parseSchemaCondition(mySchema, {
        or: [
          { attr: 'num', eq: { attr: 'otherNum' } },
          { attr: 'str', eq: { attr: 'otherStr' } }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#c_1 = #c_2) OR (#c_3 = #c_4)',
      ExpressionAttributeNames: {
        '#c_1': 'num',
        '#c_2': 'otherNum',
        '#c_3': 'str',
        '#c_4': 'otherStr'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('combines AND children conditions (value)', () => {
    expect(
      parseSchemaCondition(mySchema, {
        and: [
          { attr: 'num', eq: 42 },
          { attr: 'str', eq: 'foo' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#c_1 = :c_1) AND (#c_2 = :c_2)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'str' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': 'foo' }
    })
  })

  it('combines AND children conditions (attribute)', () => {
    expect(
      parseSchemaCondition(mySchema, {
        and: [
          { attr: 'num', eq: { attr: 'otherNum' } },
          { attr: 'str', eq: { attr: 'otherStr' } }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '(#c_1 = #c_2) AND (#c_3 = #c_4)',
      ExpressionAttributeNames: {
        '#c_1': 'num',
        '#c_2': 'otherNum',
        '#c_3': 'str',
        '#c_4': 'otherStr'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('combines nested combinations', () => {
    expect(
      parseSchemaCondition(mySchema, {
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
      ConditionExpression: '((#c_1 = :c_1) OR (#c_2 = :c_2)) AND (#c_3 = :c_3)',
      ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'bool', '#c_3': 'str' },
      ExpressionAttributeValues: { ':c_1': 42, ':c_2': true, ':c_3': 'foo' }
    })
  })
})
