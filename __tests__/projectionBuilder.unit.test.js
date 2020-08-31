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

  it('generate test projection expression', () => {

    const proj = [
      'pk',
      'sk',
      'petType',
      'test2.path',
      { User: ['family','name','roles','test.subpath','friends[1]'] }
    ]

    // Get projection with type
    const result = projectionBuilder(proj,DefaultTable,null,true)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk',
      '#proj3': 'petType',
      '#proj4': 'test2.path',
      '#proj5': 'set',
      '#proj6': 'test.subpath',
      '#proj7': 'friends[1]',
      '#proj8': '_et'
    })
    expect(result.projections).toBe('#proj1,#proj2,#proj3,#proj4,#proj5,#proj6,#proj7,#proj8')
  })

  it('fails when no table is passed', () => {
    expect(() => { projectionBuilder(['pk']) })
      .toThrow('Tables must be valid and contain attributes')
  })

  it('fails when invalid table is passed', () => {
    expect(() => { projectionBuilder(['pk'], { test: true }) })
      .toThrow('Tables must be valid and contain attributes')
  })

  it('converts string to array', () => {

    // Get projection with type
    const result = projectionBuilder('pk,sk,test',DefaultTable,null,false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk',
      '#proj3': 'test',
    })
    expect(result.projections).toBe('#proj1,#proj2,#proj3')
  })

  it('accepts object input', () => {

    const proj = { User: ['family','name'] }

    // Get projection with type
    const result = projectionBuilder(proj,DefaultTable,null,false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk'
    })
    expect(result.projections).toBe('#proj1,#proj2')
  })

  it('uses an entity alias', () => {

    const proj = ['family','name']

    // Get projection with type
    const result = projectionBuilder(proj,DefaultTable,'User',false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk'
    })
    expect(result.projections).toBe('#proj1,#proj2')
  })

  it('parses string from object assignment', () => {

    const proj = { User: 'family,name' }

    // Get projection with type
    const result = projectionBuilder(proj,DefaultTable,null,false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk'
    })
    expect(result.projections).toBe('#proj1,#proj2')
  })

  it('merges mulitple entity references of the same type', () => {

    const proj = [
      { User: 'family,name' },
      { User: 'test' }
    ]

    // Get projection with type
    const result = projectionBuilder(proj,DefaultTable,null,false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk',
      '#proj3': 'test'
    })
    expect(result.projections).toBe('#proj1,#proj2,#proj3')
  })

  it('fails when invalid type is passed in object', () => {
    expect(() => { projectionBuilder({ User: {} }, DefaultTable) })
      .toThrow('Only arrays or strings are supported')
  })

  it('fails when projections are not strings', () => {
    expect(() => { projectionBuilder({ User: ['pk',[]] }, DefaultTable) })
      .toThrow('Entity projections must be string values')
  })

  it('fails when entity is invalid', () => {
    expect(() => { projectionBuilder({ Test: 'pk,sk' }, DefaultTable) })
      .toThrow(`'Test' is not a valid entity on this table`)
  })

  it('fails when projection is an invalid type', () => {
    expect(() => { projectionBuilder(['pk',1], DefaultTable) })
      .toThrow(`'number' is an invalid type. Projections require strings or arrays`)
  })

  it('skips duplicate attributes', () => {

    // Get projection with type
    const result = projectionBuilder('pk,sk,pk',DefaultTable,null,false)

    // console.log(JSON.stringify(result.names,null,2))
    expect(result.names).toEqual({
      '#proj1': 'pk',
      '#proj2': 'sk',
    })
    expect(result.projections).toBe('#proj1,#proj2')
  })

})
