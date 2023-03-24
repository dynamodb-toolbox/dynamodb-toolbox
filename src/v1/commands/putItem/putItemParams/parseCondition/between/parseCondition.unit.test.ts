import { parseCondition } from '../parseCondition'

describe('parseCondition - between', () => {
  it('between (values)', () => {
    expect(parseCondition({ path: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1 BETWEEN :1 AND :2',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('between (value + attribute)', () => {
    expect(parseCondition({ path: 'num', between: [42, { attr: 'otherNum' }] })).toStrictEqual({
      ConditionExpression: '#1 BETWEEN :1 AND #2',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('between (attributes)', () => {
    expect(
      parseCondition({ path: 'num', between: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }] })
    ).toStrictEqual({
      ConditionExpression: '#1 BETWEEN #2 AND #3',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum', '#3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps (values)', () => {
    expect(parseCondition({ path: 'map.nestedA.nestedB', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1.#2.#3 BETWEEN :1 AND :2',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB'
      },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep maps (attribute + value)', () => {
    expect(
      parseCondition({ path: 'map.nestedA.nestedB', between: [{ attr: 'nestedC.otherNum' }, 43] })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 BETWEEN #4.#5 AND :1',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'nestedC',
        '#5': 'otherNum'
      },
      ExpressionAttributeValues: { ':1': 43 }
    })
  })

  it('deep maps (attributes)', () => {
    expect(
      parseCondition({
        path: 'map.nestedA.nestedB',
        between: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 BETWEEN #4.#5 AND #6.#7',
      ExpressionAttributeNames: {
        '#1': 'map',
        '#2': 'nestedA',
        '#3': 'nestedB',
        '#4': 'nestedC',
        '#5': 'otherNum',
        '#6': 'nestedD',
        '#7': 'yetAnotherNum'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps and lists (values)', () => {
    expect(
      parseCondition({ path: 'listA[1].nested.listB[2].value', between: [42, 43] })
    ).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 BETWEEN :1 AND :2',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nested',
        '#3': 'listB',
        '#4': 'value'
      },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep maps and lists (value + attribute)', () => {
    expect(
      parseCondition({
        path: 'listA[1].nestedA.listB[2].valueA',
        between: [42, { attr: 'listC[3].nestedB.listD[4].valueB' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 BETWEEN :1 AND #5[3]#6.#7[4]#8',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nestedA',
        '#3': 'listB',
        '#4': 'valueA',
        '#5': 'listC',
        '#6': 'nestedB',
        '#7': 'listD',
        '#8': 'valueB'
      },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep maps and lists (attributes)', () => {
    expect(
      parseCondition({
        path: 'listA[1].nestedA.listB[2].valueA',
        between: [
          { attr: 'listC[3].nestedB.listD[4].valueB' },
          { attr: 'listE[3].nestedC.listF[4].valueC' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 BETWEEN #5[3]#6.#7[4]#8 AND #9[3]#10.#11[4]#12',
      ExpressionAttributeNames: {
        '#1': 'listA',
        '#2': 'nestedA',
        '#3': 'listB',
        '#4': 'valueA',
        '#5': 'listC',
        '#6': 'nestedB',
        '#7': 'listD',
        '#8': 'valueB',
        '#9': 'listE',
        '#10': 'nestedC',
        '#11': 'listF',
        '#12': 'valueC'
      },
      ExpressionAttributeValues: {}
    })
  })

  it('deep lists (values)', () => {
    expect(parseCondition({ path: 'list[1][2][3]', between: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1[1][2][3] BETWEEN :1 AND :2',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseCondition({ path: 'list[1][2][3]', between: [{ attr: 'listB[4][5][6]' }, 42] })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] BETWEEN #2[4][5][6] AND :1',
      ExpressionAttributeNames: { '#1': 'list', '#2': 'listB' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseCondition({
        path: 'listA[1][2][3]',
        between: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] BETWEEN #2[4][5][6] AND #3[7][8][9]',
      ExpressionAttributeNames: { '#1': 'listA', '#2': 'listB', '#3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseCondition({ size: 'num', between: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#1) BETWEEN :1 AND :2',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })
})
