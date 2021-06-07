import { TableAttributes } from '../classes/Table'
import parseTableAttributes from '../lib/parseTableAttributes'

let attrs: TableAttributes = {
  pk: 'string', 
  sk: 'string'
}


describe('parseTableAttributes', () => {
  
  it('parse simple attributes', async () => {
    expect(parseTableAttributes(attrs,'pk','sk')).toEqual({ pk: { type: 'string', mappings: {} }, sk: { type: 'string', mappings: {} } })
  })

    // Removed this requirement 
  it.skip('fails when attribute is missing type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: {} }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it('fails when partitionKey is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ pk: 'map' }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'pk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
  })
 
  it('fails when sortKey is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ sk: 'map' }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'sk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
  }) 

  it('fails when attribute is an invalid type', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: 'not-a-type' }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it('fails when partitionKey is an invalid type (in object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ pk: { type: 'map' } }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'pk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
  })

  it('fails when sortKey is an invalid type (in object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ sk: { type: 'map' } }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'sk'. Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
  })

  it('fails when attribute is an invalid type (in an object config)', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: { type: 'not-a-type' } }),'pk','sk')
    }).toThrow(`Invalid or missing type for 'test'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it(`fails when attribute contains setType but isn't a set`, async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: { type: 'string', setType: 'string' } }),'pk','sk')
    }).toThrow(`'setType' is only valid for type 'set'`)
  })

  it(`fails when attribute contains invalid setType`, async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: { type: 'set', setType: 'invalid' } }),'pk','sk')
    }).toThrow(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
  })

  it('fails when attribute has an invalid config option', async () => {
    expect(() => {
      parseTableAttributes(Object.assign({},attrs,{ test: { type: 'string', invalid: 'invalid' } }),'pk','sk')
    }).toThrow(`'invalid' is not a valid property type`)
  })

})
