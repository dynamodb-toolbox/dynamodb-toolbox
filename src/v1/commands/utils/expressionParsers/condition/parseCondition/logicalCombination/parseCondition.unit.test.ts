import { schema, number, string, boolean } from 'v1/schema'
import { parseSchemaCondition } from 'v1/commands/utils/parseCondition'

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
      ConditionExpression: '(#c1 = :c1) OR (#c2 = :c2)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'str' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 'foo' }
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
      ConditionExpression: '(#c1 = #c2) OR (#c3 = #c4)',
      ExpressionAttributeNames: {
        '#c1': 'num',
        '#c2': 'otherNum',
        '#c3': 'str',
        '#c4': 'otherStr'
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
      ConditionExpression: '(#c1 = :c1) AND (#c2 = :c2)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'str' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': 'foo' }
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
      ConditionExpression: '(#c1 = #c2) AND (#c3 = #c4)',
      ExpressionAttributeNames: {
        '#c1': 'num',
        '#c2': 'otherNum',
        '#c3': 'str',
        '#c4': 'otherStr'
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
      ConditionExpression: '((#c1 = :c1) OR (#c2 = :c2)) AND (#c3 = :c3)',
      ExpressionAttributeNames: { '#c1': 'num', '#c2': 'bool', '#c3': 'str' },
      ExpressionAttributeValues: { ':c1': 42, ':c2': true, ':c3': 'foo' }
    })
  })
})
