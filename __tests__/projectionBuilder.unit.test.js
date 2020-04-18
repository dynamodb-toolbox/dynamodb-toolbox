const projectionBuilder = require('../lib/projectionBuilder')

// Require Table and Entity classes
const Table = require('../classes/Table')
const Entity = require('../classes/Entity')


// Create basic table
let DefaultTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk'
})

// Create basic entity
DefaultTable.entities = new Entity({
  name: 'User',
  attributes: {
    family: { type: 'string', partitionKey: true },
    name: { type: 'string', sortKey: true },
    set: { type: 'set', setType: 'string', alias: 'roles' },
    age: 'number',
    friends: 'list',
    test: 'map',
    test2: { type: 'map', alias: 'mapAlias' }
  }
})


DefaultTable.entities = new Entity({
  name: 'Pet',
  attributes: {
    family: { type: 'string', partitionKey: true },
    name: { type: 'string', sortKey: true },
    petType: 'string'
  }
})


describe('projectionBuilder',() => {

  it('test', () => {

    const proj = [
      'pk',
      'sk',
      'petType',
      'test2.path',
      { User: ['family','name','roles','test.subpath','friends[1]'] }
    ]

    const result = projectionBuilder(proj, DefaultTable)

    // console.log(JSON.stringify(result.names,null,2))
    // console.log(result)
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk',
      '#proj3': 'petType',
      '#proj4': 'test2.path',
      '#proj5': 'set',
      '#proj6': 'test.subpath',
      '#proj7': 'friends[1]',
      '#proj8': '_tp'
    })
    expect(result.projections).toBe('#proj1,#proj2,#proj3,#proj4,#proj5,#proj6,#proj7,#proj8')
  })

})
