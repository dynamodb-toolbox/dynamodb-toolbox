const parseCompositeKey = require('../lib/parseCompositeKey')

// Simulate attributes
const attributes = {
  sk: { type: 'string', sortKey: true }
}

describe('parseCompositeKey', () => {

  it('converts item config to linked mapping', async () => {
    let result = parseCompositeKey('linked',['sk',0, { save:true }],{linked:{}},attributes)  
    expect(result).toEqual({ linked: { save: true, type: 'string', coerce: true, link: 'sk', pos: 0 } })
    let result2 = parseCompositeKey('linked2',['sk',1],{linked:{}},attributes)  
    expect(result2).toEqual({ linked2: { type: 'string', coerce: true, link: 'sk', pos: 1 } })
  })

  it('fails on missing mapped field', async () => {
    expect(() => {
      parseCompositeKey('linked',['skx',0],{linked:{}},attributes)  
    }).toThrow(`'linked' must reference another field`)
  })

  it('fails on non-numeric position', async () => {
    expect(() => {
      parseCompositeKey('linked',['sk','1'],{linked:{}},attributes)  
    }).toThrow(`'linked' position value must be numeric`)
  })

  it('fails on invalid configuration', async () => {
    expect(() => {
      parseCompositeKey('linked',['sk',0,[]],{linked:{}},attributes)  
    }).toThrow(`'linked' type must be 'string', 'number', 'boolean' or a configuration object`)
  })

})
