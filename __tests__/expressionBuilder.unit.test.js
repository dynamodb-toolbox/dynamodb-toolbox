// TODO: Additional expression builder tests

const expressionBuilder = require('../lib/expressionBuilder')

// Require Table and Entity classes
const Table = require('../classes/Table')
const Entity = require('../classes/Entity')

// Create basic entity
const TestEntity = new Entity({
  name: 'TestEntity',
  attributes: {
    pk: { partitionKey: true },
    a: 'string',
    b: 'string',
    c: 'string',
    d: 'string',
    x: 'string',
    y: 'string'
  }
})

// Create basic table
const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  entities: TestEntity
})


describe('expressionBuilder',() => {

  it('test', () => {

    // const exp = [
    //   { attr: 'a', eq: 'b' },
    //   { attr: 'a', ne: 'b' },
    //   { attr: 'a', lt: 'b' },
    //   { attr: 'a', lte: 'b' },
    //   { attr: 'a', gt: 'b' },
    //   { attr: 'a', gte: 'b' },
    //   { attr: 'a', between: ['b','c'] },
    //   { attr: 'a', in: ['b','c','d'] },
    //   { attr: 'a', exists: true },
    //   { attr: 'a', exists: false },
    //   { attr: 'a', contains: 'b' },
    //   { attr: 'a', beginsWith: 'b' },
    //   { attr: 'a', type: 'string' },
    //   { size: 'a', eq: 'b' },
    //   { size: 'a', between: [1,5] },
    //   { attr: 'a', eq: 'b', negate: true },
    //   { attr: 'a', beginsWith: 'b', negate: true }
    // ]


    const nested_exp = [
      { attr: 'a', eq: 'b' },
      [
        { attr: 'a', ne: 'b' },
        { attr: 'a', exists: true },
        [{ attr: 'a', between: ['b','c'] }]
      ],
      [
        { attr: 'a', ne: 'b' },
        { attr: 'a', exists: true }
      ],
      [
        { attr: 'a', ne: 'b' },
        { attr: 'a', exists: true }
      ],
      { attr: 'd', eq: 'e' },
      [
        [
          { or: false, attr: 'd', eq: 'e' },
          { or: true, attr: 'y', eq: 'x' },
        ],
        [
          { or: true, attr: 'a', eq: 'b' },
          [
            { or: false, attr: 'a', eq: 'b' },
            { or: true, attr: 'a', eq: 'b', negate:true }
          ]
        ],
        { or: true, attr: 'a', eq: 'b' },
        { or: true, attr: 'a', eq: 'b' }
      ]

    ]

    const result = expressionBuilder(nested_exp,TestTable,'TestEntity')

    // console.log(result.names)
    // console.log(result.values)
    // console.log(result.expression)

    expect(result.names).toEqual({
      '#attr1': 'a',
      '#attr2': 'a',
      '#attr3': 'a',
      '#attr4': 'a',
      '#attr5': 'a',
      '#attr6': 'a',
      '#attr7': 'a',
      '#attr8': 'a',
      '#attr9': 'd',
      '#attr10': 'd',
      '#attr11': 'y',
      '#attr12': 'a',
      '#attr13': 'a',
      '#attr14': 'a',
      '#attr15': 'a',
      '#attr16': 'a'
    })

    expect(result.values).toEqual({
      ':attr1': 'b',
      ':attr2': 'b',
      ':attr4_0': 'b',
      ':attr4_1': 'c',
      ':attr5': 'b',
      ':attr7': 'b',
      ':attr9': 'e',
      ':attr10': 'e',
      ':attr11': 'x',
      ':attr12': 'b',
      ':attr13': 'b',
      ':attr14': 'b',
      ':attr15': 'b',
      ':attr16': 'b'
    })

    expect(result.expression).toBe('#attr1 = :attr1 AND (#attr2 <> :attr2 AND attribute_exists(#attr3) AND (#attr4 between :attr4_0 and :attr4_1)) AND (#attr5 <> :attr5 AND attribute_exists(#attr6)) AND (#attr7 <> :attr7 AND attribute_exists(#attr8)) AND #attr9 = :attr9 AND ((#attr10 = :attr10 OR #attr11 = :attr11) OR (#attr12 = :attr12 AND (#attr13 = :attr13 OR (NOT #attr14 = :attr14))) OR #attr15 = :attr15 OR #attr16 = :attr16)')

  })

})
