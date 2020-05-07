const parseMapping = require('../lib/parseMapping')


describe('parseMapping', () => {
  
  it('parses simple mapping', async () => {
    expect(parseMapping('attr',{ type: 'string' },{}))
      .toEqual({ attr: { type: 'string', coerce: true } })
  })
 
  it('parses mapping with coerce set to false', async () => {
    expect(parseMapping('attr',{ type: 'string', coerce: false },{}))
      .toEqual({ attr: { type: 'string', coerce: false } })
  })

  it('fails on non-boolean coerce', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', coerce: 'false' },{})
    }).toThrow(`'coerce' must be a boolean`)
  })

  it('parses mapping with onUpdate', async () => {
    expect(parseMapping('attr',{ type: 'string', onUpdate: true },{}))
      .toEqual({ attr: { type: 'string', coerce: true, onUpdate: true } })
  })

  it('parses mapping with hidden', async () => {
    expect(parseMapping('attr',{ type: 'string', hidden: true },{}))
      .toEqual({ attr: { type: 'string', coerce: true, hidden: true } })
  })

  it('parses mapping with save', async () => {
    expect(parseMapping('attr',{ type: 'string', save: true },{}))
      .toEqual({ attr: { type: 'string', coerce: true, save: true } })
  })

  it('parses mapping with required (true)', async () => {
    expect(parseMapping('attr',{ type: 'string', required: true },{ required: {}}))
      .toEqual({ attr: { type: 'string', coerce: true, required: true } })
  })

  it('parses mapping with required (always)', async () => {
    expect(parseMapping('attr',{ type: 'string', required: 'always' },{ required: {}}))
      .toEqual({ attr: { type: 'string', coerce: true, required: 'always' } })
  })

  it('fails on non-boolean required', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', required: 'false' },{})
    }).toThrow(`'required' must be a boolean`)
  })

  it('fails on non-string map/alias', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', map: 1 },{ })
    }).toThrow(`'map' must be a unique string`)
  })

  it('fails on empty string value for map/alias', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', map: ' ' },{ fields: [] })
    }).toThrow(`'map' must be a unique string`)
  })

  it('fails on duplicate alias or map field', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', map: 'attr1' },{ fields: ['attr1'] })
    }).toThrow(`'map' must be a unique string`)
  })

  it('fails when a partitionKey field has an alias', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: true, alias: 'attr1' },{ fields: [] })
    }).toThrow(`Attributes with a partitionKey cannot have a 'map' or 'alias' associated`)
  })

  it('fails when a partitionKey field has a map', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: true, map: 'attr1' },{ fields: [] })
    }).toThrow(`Attributes with a partitionKey cannot have a 'map' or 'alias' associated`)
  })

  it('fails when a sortKey field has an alias', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', sortKey: true, alias: 'attr1' },{ fields: [] })
    }).toThrow(`Attributes with a sortKey cannot have a 'map' or 'alias' associated`)
  })

  it('fails when a sortKey field has a map', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', sortKey: true, map: 'attr1' },{ fields: [] })
    }).toThrow(`Attributes with a sortKey cannot have a 'map' or 'alias' associated`)
  })

  it('parses partitionKey as string', async () => {
    expect(parseMapping('attr',{ type: 'string', partitionKey: 'GSI' },{ keys: {} }))
      .toEqual({ attr: { type: 'string', partitionKey: 'GSI', coerce: true } })
  })

  it('parses partitionKey as an array', async () => {
    expect(parseMapping('attr',{ type: 'string', partitionKey: [true,'GSI'] },{ keys: {} }))
      .toEqual({ attr: { type: 'string', partitionKey: [true,'GSI'], coerce: true } })
  })

  it('fails when a partitionKey has already been defined', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: true },{ keys: { partitionKey: 'pk' } })
    }).toThrow(`'pk' has already been declared as the partitionKey`)
  })

  it('ignores partitionKey marked false', async () => {
    expect(parseMapping('attr',{ type: 'string', partitionKey: false },{ keys: {} }))
      .toEqual({ attr: { type: 'string', partitionKey: false, coerce: true } })
  })

  it('fails when partitionKey and sortKey are both used', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', sortKey: true },{ keys: { partitionKey: 'attr' } })
    }).toThrow(`'attr' attribute cannot be both the partitionKey and sortKey`)
  })

  it('fails when partitionKey is not a boolean or string', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: {} },{ keys: { } })
    }).toThrow(`'partitionKey' must be a boolean, string, or array`)
  })

  it('fails when partitionKey for index has already been assigned', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: 'GSI' },{ keys: { GSI: { partitionKey: 'GSIpk'} } })
    }).toThrow(`'GSIpk' has already been declared as the partitionKey for the GSI index`)
  })

  it('fails when partitionKey index assignment is not a string', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', partitionKey: [{}] },{ keys: { GSI: { partitionKey: 'GSIpk'} } })
    }).toThrow(`Index assignments for 'attr' must be string or boolean values`)
  })

  it('fails when partitionKey index is also the sortKey', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', sortKey: 'GSI' },{ keys: { GSI: { partitionKey: 'attr'} } })
    }).toThrow(`'attr' attribute cannot be both the partitionKey and sortKey for the GSI index`)
  })

  it('fails if map and alias are both set', async () => {
    expect(() => {
      parseMapping('attr',{ type: 'string', map: 'test', alias: 'testx' },{ fields: [] })
    }).toThrow(`'attr' cannot contain both an alias and a map`)
  })

  it('allows false as default value', async () => {
    expect(parseMapping('attr', { type: 'boolean', default: false }, { defaults: {} }))
      .toEqual({ attr: { coerce: true, type: 'boolean', default: false } })
  })

})
