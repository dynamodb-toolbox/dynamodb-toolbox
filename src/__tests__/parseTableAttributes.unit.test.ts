import { TableAttributes } from '../classes/Table/types.js'
import parseTableAttributes from '../lib/parseTableAttributes.js'

const attrs: TableAttributes = {
  pk: 'string',
  sk: 'string'
}

describe('parseTableAttributes', () => {
  test('parse simple attributes', async () => {
    expect(parseTableAttributes(attrs, 'pk', 'sk')).toEqual({
      pk: { type: 'string', mappings: {} },
      sk: { type: 'string', mappings: {} }
    })
  })

  // Removed this requirement
  it.skip('fails when attribute is missing type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { test: {} }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'bigint', 'list', 'map', 'binary', and 'set'.`
    )
  })

  test('fails when partitionKey is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { pk: 'map' }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'pk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`
    )
  })

  test('fails when sortKey is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { sk: 'map' }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'sk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`
    )
  })

  test('fails when attribute is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { test: 'not-a-type' }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'bigint', 'list', 'map', 'binary', and 'set'.`
    )
  })

  test('fails when partitionKey is an invalid type (in object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { pk: { type: 'map' } }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'pk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`
    )
  })

  test('fails when sortKey is an invalid type (in object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { sk: { type: 'map' } }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'sk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`
    )
  })

  test('fails when attribute is an invalid type (in an object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({}, attrs, { test: { type: 'not-a-type' } }), 'pk', 'sk')
    }).toThrow(
      `Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'bigint', 'list', 'map', 'binary', and 'set'.`
    )
  })

  test(`fails when attribute contains setType but isn't a set`, async () => {
    expect(() => {
      parseTableAttributes(
        Object.assign({}, attrs, { test: { type: 'string', setType: 'string' } }),
        'pk',
        'sk'
      )
    }).toThrow(`'setType' is only valid for type 'set'`)
  })

  test(`fails when attribute contains invalid setType`, async () => {
    expect(() => {
      parseTableAttributes(
        Object.assign({}, attrs, { test: { type: 'set', setType: 'invalid' } }),
        'pk',
        'sk'
      )
    }).toThrow(`Invalid 'setType', must be 'string', 'number', 'bigint' or 'binary'`)
  })

  test('fails when attribute has an invalid config option', async () => {
    expect(() => {
      parseTableAttributes(
        Object.assign({}, attrs, { test: { type: 'string', invalid: 'invalid' } }),
        'pk',
        'sk'
      )
    }).toThrow(`'invalid' is not a valid property type`)
  })
})
