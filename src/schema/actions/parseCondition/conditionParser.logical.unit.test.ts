import { boolean, item, number, string } from '~/schema/index.js'

import { ConditionParser } from './conditionParser.js'

describe('transformCondition', () => {
  describe('or/and', () => {
    const mySchema = item({
      num: number(),
      otherNum: number(),
      str: string(),
      otherStr: string(),
      bool: boolean()
    })

    test('combines OR children conditions (value)', () => {
      expect(
        mySchema.build(ConditionParser).parse({
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

    test('combines OR children conditions (attribute)', () => {
      expect(
        mySchema.build(ConditionParser).parse({
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

    test('parses child condition if OR has only one of them', () => {
      expect(
        mySchema.build(ConditionParser).parse({
          or: [{ attr: 'num', eq: 42 }]
        })
      ).toStrictEqual({
        ConditionExpression: '#c_1 = :c_1',
        ExpressionAttributeNames: { '#c_1': 'num' },
        ExpressionAttributeValues: { ':c_1': 42 }
      })
    })

    test('combines AND children conditions (value)', () => {
      expect(
        mySchema.build(ConditionParser).parse({
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

    test('combines AND children conditions (attribute)', () => {
      expect(
        mySchema.build(ConditionParser).parse({
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

    test('parses child condition if AND has only one of them', () => {
      expect(
        mySchema.build(ConditionParser).parse({
          or: [{ attr: 'num', eq: 42 }]
        })
      ).toStrictEqual({
        ConditionExpression: '#c_1 = :c_1',
        ExpressionAttributeNames: { '#c_1': 'num' },
        ExpressionAttributeValues: { ':c_1': 42 }
      })
    })

    test('combines logical combinations', () => {
      expect(
        mySchema.build(ConditionParser).parse({
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

  describe('not', () => {
    const mySchema = item({
      num: number(),
      otherNum: number()
    })

    test('negates child condition (value)', () => {
      expect(mySchema.build(ConditionParser).parse({ not: { attr: 'num', eq: 42 } })).toStrictEqual(
        {
          ConditionExpression: 'NOT (#c_1 = :c_1)',
          ExpressionAttributeNames: { '#c_1': 'num' },
          ExpressionAttributeValues: { ':c_1': 42 }
        }
      )
    })

    test('negates child condition (attribute)', () => {
      expect(
        mySchema.build(ConditionParser).parse({ not: { attr: 'num', eq: { attr: 'otherNum' } } })
      ).toStrictEqual({
        ConditionExpression: 'NOT (#c_1 = #c_2)',
        ExpressionAttributeNames: { '#c_1': 'num', '#c_2': 'otherNum' },
        ExpressionAttributeValues: {}
      })
    })
  })
})
