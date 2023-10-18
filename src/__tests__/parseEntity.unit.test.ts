import parseEntity from '../lib/parseEntity.js'

// Simulate Entity config
const entity = {
  name: 'TestEntity',
  timestamps: true,
  created: '_created',
  createdAlias: 'createdAlias',
  modified: '_modified',
  modifiedAlias: 'modifiedAlias',
  typeAlias: 'typeAlias',
  typeHidden: true,
  attributes: {
    pk: { partitionKey: true },
    sk: { sortKey: true },
    attr1: 'number',
    attr2: { type: 'list', required: true }
  },
  autoExecute: true,
  autoParse: true
} as const

describe('parseEntity', () => {
  it('parses entity definition with all available options', async () => {
    const ent = parseEntity(entity)
    expect(ent.name).toBe('TestEntity')
    expect(ent.schema.keys).toEqual({ partitionKey: 'pk', sortKey: 'sk' })
    expect(ent.schema.attributes).toHaveProperty('_created')
    expect(ent.schema.attributes).toHaveProperty('_modified')
    expect(ent.schema.attributes).toHaveProperty('createdAlias')
    expect(ent.schema.attributes).toHaveProperty('modifiedAlias')
    expect(ent.required).toEqual({ attr2: false })
    expect(ent.linked).toEqual({})
    expect(ent.autoExecute).toBe(true)
    expect(ent.autoParse).toBe(true)
    expect(ent._etAlias).toBe('typeAlias')
    expect(ent.typeHidden).toBe(true)
  })

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const nonObjectValues = [null, 'string', true, 1, [], () => {}]
  nonObjectValues.forEach(value => {
    it(`fails on non-object value: ${value}`, async () => {
      const input: typeof entity = {
        ...entity,
        // @ts-expect-error
        attributes: value
      }

      expect(() => {
        parseEntity(input)
      }).toThrow('Please provide a valid \'attributes\' object')
    })
  })

  it('fails on extra config option', async () => {
    expect(() => {
      parseEntity(Object.assign({}, entity, { invalidConfig: true }))
    }).toThrow(`Invalid Entity configuration options: invalidConfig`)
  })
})
