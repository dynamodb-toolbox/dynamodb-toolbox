import { TrackingInfo } from '../lib/parseEntity'
import parseCompositeKey from '../lib/parseCompositeKey'

// Simulate attributes
const attributes = {
  sk: { type: 'string', sortKey: true }
} as const

const track: TrackingInfo = {
  fields: [],
  defaults: [],
  required: [],
  linked: {},
  keys: []
}

describe('parseCompositeKey', () => {
  it('converts item config to linked mapping', async () => {
    let result = parseCompositeKey('linked', ['sk', 0, { save: false }], track, attributes)
    expect(result).toEqual({
      linked: { save: false, type: 'string', coerce: true, link: 'sk', pos: 0 }
    })
    let result2 = parseCompositeKey('linked2', ['sk', 1], track, attributes)
    expect(result2).toEqual({
      linked2: { save: true, type: 'string', coerce: true, link: 'sk', pos: 1 }
    })
  })

  it('fails on missing mapped field', async () => {
    expect(() => {
      parseCompositeKey('linked', ['skx', 0], track, attributes)
    }).toThrow(`'linked' must reference another field`)
  })

  it('fails on non-numeric position', async () => {
    expect(() => {
      parseCompositeKey('linked', ['sk', '1'], track, attributes)
    }).toThrow(`'linked' position value must be numeric`)
  })

  it('fails on invalid configuration', async () => {
    expect(() => {
      parseCompositeKey('linked', ['sk', 0, []], track, attributes)
    }).toThrow(`'linked' type must be 'string', 'number', 'boolean' or a configuration object`)
  })
})
