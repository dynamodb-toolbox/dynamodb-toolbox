import { item, string, number, anyOf, map } from 'v1/item'
import { parseCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - with anyOf', () => {
  const itemWithAnyOf = item({
    anyOf: anyOf([
      number(),
      map({
        strOrNum: anyOf([string(), number()])
      })
    ])
  })

  it('correctly parses condition (root)', () => {
    expect(parseCondition(itemWithAnyOf, { attr: 'anyOf', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1 BETWEEN :1 AND :2',
      ExpressionAttributeNames: { '#1': 'anyOf' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('correctly parses condition (nested num)', () => {
    expect(
      parseCondition(itemWithAnyOf, { attr: 'anyOf.strOrNum', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#1.#2 BETWEEN :1 AND :2',
      ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'strOrNum' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('correctly parses condition (nested str)', () => {
    expect(
      parseCondition(itemWithAnyOf, { attr: 'anyOf.strOrNum', beginsWith: 'foo' })
    ).toStrictEqual({
      ConditionExpression: 'begins_with(#1.#2, :1)',
      ExpressionAttributeNames: { '#1': 'anyOf', '#2': 'strOrNum' },
      ExpressionAttributeValues: { ':1': 'foo' }
    })
  })
})
