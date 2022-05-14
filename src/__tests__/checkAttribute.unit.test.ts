import checkAttribute from '../lib/checkAttribute'

// Require Table and Entity classes
import Table from '../classes/Table/Table'
import Entity from '../classes/Entity'

// Create basic table
let DefaultTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk'
})

// Create basic entity
DefaultTable.addEntity(
  new Entity({
    name: 'User',
    attributes: {
      pk: { type: 'string', partitionKey: true },
      sk: { type: 'string', sortKey: true },
      set: { type: 'set', setType: 'string', alias: 'set_alias' },
      set_alias2: { type: 'set', setType: 'string', map: 'set2' },
      number: 'number',
      list: { type: 'list', alias: 'list_alias' },
      list_alias2: { type: 'list', map: 'list2' },
      test: 'map'
    }
  } as const)
)

describe('checkAttribute', () => {
  it('checks attribute and returns table attribute', () => {
    expect(checkAttribute('number', DefaultTable.User.schema.attributes)).toBe('number')
    expect(checkAttribute('set', DefaultTable.User.schema.attributes)).toBe('set')
    expect(checkAttribute('set_alias', DefaultTable.User.schema.attributes)).toBe('set')
    expect(checkAttribute('set2', DefaultTable.User.schema.attributes)).toBe('set2')
    expect(checkAttribute('set_alias2', DefaultTable.User.schema.attributes)).toBe('set2')
    expect(checkAttribute('set.test', DefaultTable.User.schema.attributes)).toBe('set.test')
    expect(checkAttribute('set.test[0]', DefaultTable.User.schema.attributes)).toBe('set.test[0]')
    expect(checkAttribute('set.test.test2[0]', DefaultTable.User.schema.attributes)).toBe(
      'set.test.test2[0]'
    )
    expect(checkAttribute('set_alias.test', DefaultTable.User.schema.attributes)).toBe('set.test')
    expect(checkAttribute('set_alias.test[0]', DefaultTable.User.schema.attributes)).toBe(
      'set.test[0]'
    )
    expect(checkAttribute('set_alias.test.test2[0]', DefaultTable.User.schema.attributes)).toBe(
      'set.test.test2[0]'
    )
    expect(checkAttribute('set_alias2.test', DefaultTable.User.schema.attributes)).toBe('set2.test')
    expect(checkAttribute('set_alias2.test[0]', DefaultTable.User.schema.attributes)).toBe(
      'set2.test[0]'
    )
    expect(checkAttribute('set_alias2.test.test2[0]', DefaultTable.User.schema.attributes)).toBe(
      'set2.test.test2[0]'
    )
    expect(checkAttribute('test.test', DefaultTable.User.schema.attributes)).toBe('test.test')
    expect(checkAttribute('test.test[0]', DefaultTable.User.schema.attributes)).toBe('test.test[0]')
    expect(checkAttribute('list[1]', DefaultTable.User.schema.attributes)).toBe('list[1]')
    expect(checkAttribute('list[1]', DefaultTable.User.schema.attributes)).toBe('list[1]')
  })

  it('returns error on invalid attribute', () => {
    expect(() => {
      checkAttribute('missing-attribute', DefaultTable.User.schema.attributes)
    }).toThrow(`'missing-attribute' is not a valid attribute.`)
  })
})
