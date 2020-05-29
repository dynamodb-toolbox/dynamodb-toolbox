const formatItem = require('../lib/formatItem')

const { DocumentClient } = require('./bootstrap-tests')

// Require Table and Entity classes
const Table = require('../classes/Table')
const Entity = require('../classes/Entity')


// Create basic table
let DefaultTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

// Create basic entity
DefaultTable.entities = new Entity({
  name: 'User',
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true },
    set: { type: 'set', setType: 'string', alias: 'set_alias' },
    set_alias2: { type: 'set', setType: 'string', map: 'set2' },
    number: 'number',
    list: { type: 'list', alias: 'list_alias' },
    list_alias2: { type: 'list', map: 'list2' },
    test: 'map',
    linked1: ['sk',0, { save: false }],
    linked2: ['sk',1, { save: false }],
    composite: { type: 'string', alias: 'composite_alias' },
    linked_alias1: ['composite',0, { save: false, alias: 'linked_alias_one' }],
    linked_alias2: ['composite',1, { save: false, alias: 'linked_alias_two' }],
  }
})

// console.log(DefaultTable.User);



describe('formatItem', () => {

  it('formats item with no alias', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ pk: 'test' })
    expect(result).toEqual({ pk: 'test' })
  })

  it('formats item with alias', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ list: ['test'] })
    expect(result).toEqual({ list_alias: ['test'] })
  })

  it('formats item with mapping', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ list2: ['test'] })
    expect(result).toEqual({ list_alias2: ['test'] })
  })

  it('formats item with set (alias)', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ set: DocumentClient.createSet([1,2,3]) })
    expect(result).toEqual({ set_alias: [1,2,3] })
  })

  it('formats item with set (map)', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ set2: DocumentClient.createSet([1,2,3]) })
    expect(result).toEqual({ set_alias2: [1,2,3] })
  })

  it('formats item with linked fields', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ sk: 'test1#test2' })  
    expect(result).toEqual({ sk: 'test1#test2', linked1: 'test1', linked2: 'test2' })
  })

  it('specifies attributes to include', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ pk: 'test' },['pk'])
    expect(result).toEqual({ pk: 'test' })
  })

  it('specifies attributes to include', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ list: ['test'] },['list'])
    expect(result).toEqual({ list_alias: ['test'] })
  })

  it('specifies attributes to include with linked fields', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ sk: 'test1#test2' }, ['linked1'])
    expect(result).toEqual({ linked1: 'test1' })
  })

  it('formats item with linked aliased fields', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ composite: 'test1#test2' })  
    expect(result).toEqual({ composite_alias: 'test1#test2', linked_alias_one: 'test1', linked_alias_two: 'test2' })
  })

  it('passes through attribute not specified in entity', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ unspecified: 'value' })  
    expect(result).toEqual({ unspecified: 'value' })
  })

})
