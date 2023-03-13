import { parseConditions } from './parseConditions'

describe('parseConditions', () => {
  describe('comparisons', () => {
    it('equal to', () => {
      expect(parseConditions({ path: 'num', eq: 42 })).toStrictEqual({
        ConditionExpression: '#1 = :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('not equal to', () => {
      expect(parseConditions({ path: 'num', ne: 42 })).toStrictEqual({
        ConditionExpression: '#1 <> :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('greater than', () => {
      expect(parseConditions({ path: 'num', gt: 42 })).toStrictEqual({
        ConditionExpression: '#1 > :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('greater than or equal to', () => {
      expect(parseConditions({ path: 'num', gte: 42 })).toStrictEqual({
        ConditionExpression: '#1 >= :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('less than', () => {
      expect(parseConditions({ path: 'num', lt: 42 })).toStrictEqual({
        ConditionExpression: '#1 < :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('less than or equal to', () => {
      expect(parseConditions({ path: 'num', lte: 42 })).toStrictEqual({
        ConditionExpression: '#1 <= :1',
        ExpressionAttributeNames: { '#1': 'num' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })
  })

  describe('nested paths', () => {
    it('deep maps', () => {
      expect(parseConditions({ path: 'map.nestedA.nestedB', eq: 42 })).toStrictEqual({
        ConditionExpression: '#1.#2.#3 = :1',
        ExpressionAttributeNames: {
          '#1': 'map',
          '#2': 'nestedA',
          '#3': 'nestedB'
        },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('deep maps and lists', () => {
      expect(parseConditions({ path: 'list[1].nestedA.list[2].nestedB', eq: 42 })).toStrictEqual({
        ConditionExpression: '#1[1]#2.#3[2]#4 = :1',
        ExpressionAttributeNames: {
          '#1': 'list',
          '#2': 'nestedA',
          '#3': 'list',
          '#4': 'nestedB'
        },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })

    it('deep lists', () => {
      expect(parseConditions({ path: 'list[1][2][3]', eq: 42 })).toStrictEqual({
        ConditionExpression: '#1[1][2][3] = :1',
        ExpressionAttributeNames: { '#1': 'list' },
        ExpressionAttributeValues: { ':1': 42 }
      })
    })
  })
})
