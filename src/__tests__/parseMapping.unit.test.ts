import parseMapping from '../lib/parseMapping.js'
import { TrackingInfo } from '../lib/parseEntity.js'

let track: TrackingInfo = {
  fields: [],
  defaults: [],
  required: [],
  linked: {},
  keys: []
}

beforeEach(() => {
  track = {
    fields: [],
    defaults: [],
    required: [],
    linked: {},
    keys: []
  }
})

describe('parseMapping', () => {
  test('parses simple mapping', async () => {
    expect(parseMapping('attr', { type: 'string' }, track)).toEqual({
      attr: { type: 'string', coerce: true }
    })
  })

  test('parses mapping with coerce set to false', async () => {
    expect(parseMapping('attr', { type: 'string', coerce: false }, track)).toEqual({
      attr: { type: 'string', coerce: false }
    })
  })

  test('fails on non-boolean coerce', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', coerce: 'false' }, track)
    }).toThrow(`'coerce' must be a boolean`)
  })

  test('parses mapping with onUpdate', async () => {
    expect(parseMapping('attr', { type: 'string', onUpdate: true }, track)).toEqual({
      attr: { type: 'string', coerce: true, onUpdate: true }
    })
  })

  test('parses mapping with hidden', async () => {
    expect(parseMapping('attr', { type: 'string', hidden: true }, track)).toEqual({
      attr: { type: 'string', coerce: true, hidden: true }
    })
  })

  test('parses mapping with save', async () => {
    expect(parseMapping('attr', { type: 'string', save: true }, track)).toEqual({
      attr: { type: 'string', coerce: true, save: true }
    })
  })

  test('parses mapping with required (true)', async () => {
    expect(parseMapping('attr', { type: 'string', required: true }, track)).toEqual({
      attr: { type: 'string', coerce: true, required: true }
    })
  })

  test('parses mapping with required (always)', async () => {
    expect(parseMapping('attr', { type: 'string', required: 'always' }, track)).toEqual({
      attr: { type: 'string', coerce: true, required: 'always' }
    })
  })

  test('fails on non-boolean required', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', required: 'false' }, track)
    }).toThrow(`'required' must be a boolean`)
  })

  test('fails on non-string map/alias', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', map: 1 }, track)
    }).toThrow(`'map' must be a unique string`)
  })

  test('fails on empty string value for map/alias', async () => {
    expect(() => {
      parseMapping('attr', { type: 'string', map: ' ' }, track)
    }).toThrow(`'map' must be a unique string`)
  })

  test('fails on duplicate alias or map field', async () => {
    expect(() => {
      parseMapping(
        'attr',
        { type: 'string', map: 'attr1' },
        Object.assign({}, track, { fields: ['attr1'] })
      )
    }).toThrow(`'map' must be a unique string`)
  })

  test('fails when a partitionKey field has an alias', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', partitionKey: true, alias: 'attr1' }, track)
    }).toThrow(`Attributes with a partitionKey cannot have a 'map' or 'alias' associated`)
  })

  test('fails when a partitionKey field has a map', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', partitionKey: true, map: 'attr1' }, track)
    }).toThrow(`Attributes with a partitionKey cannot have a 'map' or 'alias' associated`)
  })

  test('fails when a sortKey field has an alias', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', sortKey: true, alias: 'attr1' }, track)
    }).toThrow(`Attributes with a sortKey cannot have a 'map' or 'alias' associated`)
  })

  test('fails when a sortKey field has a map', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', sortKey: true, map: 'attr1' }, track)
    }).toThrow(`Attributes with a sortKey cannot have a 'map' or 'alias' associated`)
  })

  test('parses partitionKey as string', async () => {
    expect(parseMapping('attr', { type: 'string', partitionKey: 'GSI' }, track)).toEqual({
      attr: { type: 'string', partitionKey: 'GSI', coerce: true }
    })
  })

  test('parses partitionKey as an array', async () => {
    // @ts-expect-error 💥 TODO: Support GSIs
    expect(parseMapping('attr', { type: 'string', partitionKey: [true, 'GSI'] }, track)).toEqual({
      attr: { type: 'string', partitionKey: [true, 'GSI'], coerce: true }
    })
  })

  test('fails when a partitionKey has already been defined', async () => {
    expect(() => {
      parseMapping(
        'attr',
        { type: 'string', partitionKey: true },
        Object.assign({}, track, { keys: { partitionKey: 'pk' } })
      )
    }).toThrow(`'pk' has already been declared as the partitionKey`)
  })

  test('ignores partitionKey marked false', async () => {
    expect(parseMapping('attr', { type: 'string', partitionKey: false }, track)).toEqual({
      attr: { type: 'string', partitionKey: false, coerce: true }
    })
  })

  test('fails when partitionKey and sortKey are both used', async () => {
    expect(() => {
      parseMapping(
        'attr',
        { type: 'string', sortKey: true },
        Object.assign({}, track, { keys: { partitionKey: 'attr' } })
      )
    }).toThrow(`'attr' attribute cannot be both the partitionKey and sortKey`)
  })

  test('fails when partitionKey is not a boolean or string', async () => {
    expect(() => {
      // @ts-expect-error
      parseMapping('attr', { type: 'string', partitionKey: {} }, { keys: {} })
    }).toThrow(`'partitionKey' must be a boolean, string, or array`)
  })

  test('fails when partitionKey for index has already been assigned', async () => {
    expect(() => {
      parseMapping(
        'attr',
        { type: 'string', partitionKey: 'GSI' },
        Object.assign({}, track, { keys: { GSI: { partitionKey: 'GSIpk' } } })
      )
    }).toThrow(`'GSIpk' has already been declared as the partitionKey for the GSI index`)
  })

  test('fails when partitionKey index assignment is not a string', async () => {
    expect(() => {
      parseMapping(
        'attr',
        // @ts-expect-error
        { type: 'string', partitionKey: [{}] },
        Object.assign({}, track, { keys: { GSI: { partitionKey: 'GSIpk' } } })
      )
    }).toThrow(`Index assignments for 'attr' must be string or boolean values`)
  })

  test('fails when partitionKey index is also the sortKey', async () => {
    expect(() => {
      parseMapping(
        'attr',
        { type: 'string', sortKey: 'GSI' },
        Object.assign({}, track, { keys: { GSI: { partitionKey: 'attr' } } })
      )
    }).toThrow(`'attr' attribute cannot be both the partitionKey and sortKey for the GSI index`)
  })

  test('fails if map and alias are both set', async () => {
    expect(() => {
      parseMapping('attr', { type: 'string', map: 'test', alias: 'testx' }, track)
    }).toThrow(`'attr' cannot contain both an alias and a map`)
  })
})
