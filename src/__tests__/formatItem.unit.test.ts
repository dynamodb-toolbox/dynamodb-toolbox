import formatItem from '../lib/formatItem'
import { ddbDocClient as DocumentClient } from './bootstrap-tests'

// Require Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity'

// Create basic table
let DefaultTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

// Create basic entity
DefaultTable.addEntity(new Entity({
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
    composite1: { type: 'string', alias: 'composite1_alias' },
    linked3: ['composite1',0, { save: false }],
    linked4: ['composite1',1, { save: false, alias: 'linked4_alias' }],
    composite2_alias: { type: 'string', map: 'composite2' },
    linked5: ['composite2_alias',0, { save: false, }],
    linked6: ['composite2_alias',1, { save: false, alias: 'linked6_alias' }],
  }
}))

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
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ set: new Set([1,2,3]) })
    expect(result).toEqual({ set_alias: new Set([1,2,3]) })
  })

  it('formats item with set (map)', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ set2: new Set([1,2,3]) })
    expect(result).toEqual({ set_alias2: new Set([1,2,3]) })
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

  it('formats item with linked aliased composite field', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ composite1: 'test1#test2' })  
    expect(result).toEqual({ composite1_alias: 'test1#test2', linked3: 'test1', linked4_alias: 'test2' })
  })

  it('formats item with linked mapped composite field', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ composite2: 'test1#test2'  })  
    expect(result).toEqual({ composite2_alias: 'test1#test2', linked5: 'test1', linked6_alias: 'test2' })
  })

  it('passes through attribute not specified in entity', () => {
    let result = formatItem(DocumentClient)(DefaultTable.User.schema.attributes,DefaultTable.User.linked,{ unspecified: 'value' })  
    expect(result).toEqual({ unspecified: 'value' })
  })

})
