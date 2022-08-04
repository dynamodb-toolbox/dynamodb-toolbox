import { A } from 'ts-toolbelt'

import { string } from './leaf'
import { map } from './map'
import { ComputedDefault } from './utility'

describe('map', () => {
  const str = string({ required: true })

  it('returns default map', () => {
    const mapped = map({ str })

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: false
        _hidden: false
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: false,
      _hidden: false
    })
  })

  it('returns required map (option)', () => {
    const mapped = map({ str }, { required: true })

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: true
        _hidden: false
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: true,
      _hidden: false
    })
  })

  it('returns required map (method)', () => {
    const mapped = map({ str }).required()

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: true
        _hidden: false
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: true,
      _hidden: false
    })
  })

  it('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: false
        _hidden: true
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: false,
      _hidden: true
    })
  })

  it('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: false
        _hidden: true
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: false,
      _hidden: true
    })
  })

  it('nested map', () => {
    const mapped = map({
      nested: map({
        nestedAgain: map({
          str
        }).hidden()
      }).required()
    })

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          nested: {
            _type: 'map'
            _properties: {
              nestedAgain: {
                _type: 'map'
                _properties: {
                  str: typeof str
                }
                _required: false
                _hidden: true
                _default: undefined
              }
            }
            _required: true
            _hidden: false
            _default: undefined
          }
        }
        _required: false
        _hidden: false
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: {
        nested: {
          _type: 'map',
          _properties: {
            nestedAgain: {
              _type: 'map',
              _properties: {
                str
              },
              _required: false,
              _hidden: true
            }
          },
          _required: true,
          _hidden: false
        }
      },
      _required: false,
      _hidden: false
    })
  })

  describe('ComputedDefault', () => {
    it('accepts ComputedDefault as default value (option)', () => {
      const mapped = map({ str }, { default: ComputedDefault })

      const assertMapped: A.Contains<
        typeof mapped,
        {
          _type: 'map'
          _resolved?: unknown
          _required: false
          _hidden: false
          _default: ComputedDefault
        }
      > = 1
      assertMapped

      expect(mapped).toMatchObject({
        _type: 'map',
        _properties: { str },
        _required: false,
        _hidden: false,
        _default: ComputedDefault
      })
    })

    it('accepts ComputedDefault as default value (option)', () => {
      const mapped = map({ str }).default(ComputedDefault)

      const assertMapped: A.Contains<
        typeof mapped,
        {
          _type: 'map'
          _resolved?: unknown
          _required: false
          _hidden: false
          _default: ComputedDefault
        }
      > = 1
      assertMapped

      expect(mapped).toMatchObject({
        _type: 'map',
        _properties: { str },
        _required: false,
        _hidden: false,
        _default: ComputedDefault
      })
    })
  })
})
