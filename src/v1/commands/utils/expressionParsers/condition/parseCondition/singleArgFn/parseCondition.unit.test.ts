import { schema, list, map, number } from 'v1/schema'
import { parseSchemaCondition } from 'v1/commands/utils/parseCondition'

describe('parseCondition - singleArgFn', () => {
  const simpleSchema = schema({
    num: number()
  })

  it('exists', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', exists: true })).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  it('not exists', () => {
    expect(parseSchemaCondition(simpleSchema, { attr: 'num', exists: false })).toStrictEqual({
      ConditionExpression: 'attribute_not_exists(#1)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: {}
    })
  })

  const mapSchema = schema({
    map: map({
      nestedA: map({
        nestedB: number()
      })
    })
  })

  it('deep maps', () => {
    expect(
      parseSchemaCondition(mapSchema, { attr: 'map.nestedA.nestedB', exists: true })
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1.#2.#3)',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB'
      },
      ExpressionAttributeValues: {}
    })
  })

  const listSchema = schema({
    listA: list(
      map({
        nested: map({
          listB: list(map({ value: number() }))
        })
      })
    ),
    list: list(list(list(number())))
  })

  it('deep maps and lists', () => {
    expect(
      parseSchemaCondition(listSchema, { attr: 'listA[1].nested.listB[2].value', exists: true })
    ).toStrictEqual({
      ConditionExpression: 'attribute_exists(#1[1].#2.#3[2].#4)',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('deep lists', () => {
    expect(parseSchemaCondition(listSchema, { attr: 'list[1][2][3]', exists: true })).toStrictEqual(
      {
        ConditionExpression: 'attribute_exists(#1[1][2][3])',
        ExpressionAttributeNames: { '#1': 'list' },
        ExpressionAttributeValues: {}
      }
    )
  })
})
