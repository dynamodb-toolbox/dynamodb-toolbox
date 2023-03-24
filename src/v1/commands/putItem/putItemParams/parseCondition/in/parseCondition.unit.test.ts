import { parseCondition } from '../parseCondition'

describe('parseCondition - in', () => {
  it('in (values)', () => {
    expect(parseCondition({ path: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1 IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('in (value + attribute)', () => {
    expect(parseCondition({ path: 'num', in: [42, { attr: 'otherNum' }] })).toStrictEqual({
      ConditionExpression: '#1 IN (:1, #2)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('in (attributes)', () => {
    expect(
      parseCondition({ path: 'num', in: [{ attr: 'otherNum' }, { attr: 'yetAnotherNum' }] })
    ).toStrictEqual({
      ConditionExpression: '#1 IN (#2, #3)',
      ExpressionAttributeNames: { '#1': 'num', '#2': 'otherNum', '#3': 'yetAnotherNum' },
      ExpressionAttributeValues: {}
    })
  })

  it('deep maps (values)', () => {
    expect(parseCondition({ path: 'map.nestedA.nestedB', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1.#2.#3 IN (:1, :2)',
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
      parseCondition({ path: 'map.nestedA.nestedB', in: [{ attr: 'nestedC.otherNum' }, 43] })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 IN (#4.#5, :1)',
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
        in: [{ attr: 'nestedC.otherNum' }, { attr: 'nestedD.yetAnotherNum' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1.#2.#3 IN (#4.#5, #6.#7)',
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
    expect(parseCondition({ path: 'listA[1].nested.listB[2].value', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 IN (:1, :2)',
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
        in: [42, { attr: 'listC[3].nestedB.listD[4].valueB' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 IN (:1, #5[3]#6.#7[4]#8)',
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
        in: [
          { attr: 'listC[3].nestedB.listD[4].valueB' },
          { attr: 'listE[3].nestedC.listF[4].valueC' }
        ]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1]#2.#3[2]#4 IN (#5[3]#6.#7[4]#8, #9[3]#10.#11[4]#12)',
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
    expect(parseCondition({ path: 'list[1][2][3]', in: [42, 43] })).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'list' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })

  it('deep lists (attribute + value)', () => {
    expect(
      parseCondition({ path: 'list[1][2][3]', in: [{ attr: 'listB[4][5][6]' }, 42] })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (#2[4][5][6], :1)',
      ExpressionAttributeNames: { '#1': 'list', '#2': 'listB' },
      ExpressionAttributeValues: { ':1': 42 }
    })
  })

  it('deep lists (attributes)', () => {
    expect(
      parseCondition({
        path: 'listA[1][2][3]',
        in: [{ attr: 'listB[4][5][6]' }, { attr: 'listC[7][8][9]' }]
      })
    ).toStrictEqual({
      ConditionExpression: '#1[1][2][3] IN (#2[4][5][6], #3[7][8][9])',
      ExpressionAttributeNames: { '#1': 'listA', '#2': 'listB', '#3': 'listC' },
      ExpressionAttributeValues: {}
    })
  })

  it('with size', () => {
    expect(parseCondition({ size: 'num', in: [42, 43] })).toStrictEqual({
      ConditionExpression: 'size(#1) IN (:1, :2)',
      ExpressionAttributeNames: { '#1': 'num' },
      ExpressionAttributeValues: { ':1': 42, ':2': 43 }
    })
  })
})
