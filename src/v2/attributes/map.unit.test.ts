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
        _key: false
        _savedAs: undefined
        _default: undefined
      }
    > = 1
    assertMapped

    expect(mapped).toMatchObject({
      _type: 'map',
      _properties: { str },
      _required: false,
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required map (option)', () => {
    const mapped = map({ str }, { required: true })

    const assertMapped: A.Contains<typeof mapped, { _required: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _required: true })
  })

  it('returns required map (method)', () => {
    const mapped = map({ str }).required()

    const assertMapped: A.Contains<typeof mapped, { _required: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _required: true })
  })

  it('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapped: A.Contains<typeof mapped, { _hidden: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _hidden: true })
  })

  it('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapped: A.Contains<typeof mapped, { _hidden: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _hidden: true })
  })

  it('returns key map (option)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapped: A.Contains<typeof mapped, { _key: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _key: true })
  })

  it('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapped: A.Contains<typeof mapped, { _key: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _key: true })
  })

  it('returns savedAs map (option)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapped: A.Contains<typeof mapped, { _savedAs: 'foo' }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapped: A.Contains<typeof mapped, { _savedAs: 'foo' }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _savedAs: 'foo' })
  })

  describe('default', () => {
    it('accepts ComputedDefault as default value (option)', () => {
      const mapped = map({ str }, { default: ComputedDefault })

      const assertMapped: A.Contains<typeof mapped, { _default: ComputedDefault }> = 1
      assertMapped

      expect(mapped).toMatchObject({ _default: ComputedDefault })
    })

    it('accepts ComputedDefault as default value (option)', () => {
      const mapped = map({ str }).default(ComputedDefault)

      const assertMapped: A.Contains<typeof mapped, { _default: ComputedDefault }> = 1
      assertMapped

      expect(mapped).toMatchObject({ _default: ComputedDefault })
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
                _key: false
                _savedAs: undefined
                _default: undefined
              }
            }
            _required: true
            _hidden: false
            _key: false
            _savedAs: undefined
            _default: undefined
          }
        }
        _required: false
        _hidden: false
        _key: false
        _savedAs: undefined
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
              _hidden: true,
              _key: false,
              _savedAs: undefined,
              _default: undefined
            }
          },
          _required: true,
          _hidden: false,
          _key: false,
          _savedAs: undefined,
          _default: undefined
        }
      },
      _required: false,
      _hidden: false,
      _key: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
