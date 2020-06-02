const parseEntity = require('../src/lib/parseEntity')

// Simulate Entity config
const entity = {
  name: 'TestEntity',
  timestamps: true,
  created: '_created',
  createdAlias: 'createdAlias',
  modified: '_modified',
  modifiedAlias: 'modifiedAlias',
  typeAlias: 'typeAlias',
  attributes: {
    pk: { partitionKey: true },
    sk: { sortKey: true },
    attr1: 'number',
    attr2: { type: 'list', required: true }
  },
  autoExecute: true,
  autoParse: true
}

describe('parseEntity', () => {

  it('parses entity definition with all available options', async () => {
    let ent = parseEntity(entity)
    expect(ent.name).toBe('TestEntity')
    expect(ent.schema.keys).toEqual({ partitionKey: 'pk', sortKey: 'sk' })
    expect(ent.schema.attributes).toHaveProperty('_created')
    expect(ent.schema.attributes).toHaveProperty('_modified')
    expect(ent.schema.attributes).toHaveProperty('createdAlias')
    expect(ent.schema.attributes).toHaveProperty('modifiedAlias')
    expect(ent.required).toEqual({attr2: false})
    expect(ent.linked).toEqual({})
    expect(ent.autoExecute).toBe(true)
    expect(ent.autoParse).toBe(true)
    expect(ent._etAlias).toBe('typeAlias')
  }) 

  it('fails on extra config option', async () => {
    expect(() => {
      parseEntity(Object.assign({},entity,{ invalidConfig: true }))
    }).toThrow(`Invalid Entity configuration options: invalidConfig`)
  })

})
