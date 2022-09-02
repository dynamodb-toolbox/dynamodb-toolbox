import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../leaf'

import { map } from './typer'

describe('map', () => {
  const str = string().required()

  it('returns default map', () => {
    const mapped = map({ str })

    const assertMapped: A.Contains<
      typeof mapped,
      {
        _type: 'map'
        _properties: {
          str: typeof str
        }
        _required: Never
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
      _required: 'never',
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required map (option)', () => {
    const mappedAtLeastOnce = map({ str }, { required: 'atLeastOnce' })
    const mappedOnlyOnce = map({ str }, { required: 'onlyOnce' })
    const mappedAlways = map({ str }, { required: 'always' })
    const mappedNever = map({ str }, { required: 'never' })

    const assertMappedAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { _required: AtLeastOnce }
    > = 1
    assertMappedAtLeastOnce
    const assertMappedOnlyOnce: A.Contains<typeof mappedOnlyOnce, { _required: OnlyOnce }> = 1
    assertMappedOnlyOnce
    const assertMappedAlways: A.Contains<typeof mappedAlways, { _required: Always }> = 1
    assertMappedAlways
    const assertMappedNever: A.Contains<typeof mappedNever, { _required: Never }> = 1
    assertMappedNever

    expect(mappedAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(mappedOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(mappedAlways).toMatchObject({ _required: 'always' })
    expect(mappedNever).toMatchObject({ _required: 'never' })
  })

  it('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedOnlyOnce = map({ str }).required('onlyOnce')
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')

    const assertMappedAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { _required: AtLeastOnce }
    > = 1
    assertMappedAtLeastOnce
    const assertMappedOnlyOnce: A.Contains<typeof mappedOnlyOnce, { _required: OnlyOnce }> = 1
    assertMappedOnlyOnce
    const assertMappedAlways: A.Contains<typeof mappedAlways, { _required: Always }> = 1
    assertMappedAlways
    const assertMappedNever: A.Contains<typeof mappedNever, { _required: Never }> = 1
    assertMappedNever

    expect(mappedAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(mappedOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(mappedAlways).toMatchObject({ _required: 'always' })
    expect(mappedNever).toMatchObject({ _required: 'never' })
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

  it('returns open map (option)', () => {
    const mapped = map({ str }, { open: true })

    const assertMapped: A.Contains<typeof mapped, { _open: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _open: true })
  })

  it('returns open map (method)', () => {
    const mapped = map({ str }).open()

    const assertMapped: A.Contains<typeof mapped, { _open: true }> = 1
    assertMapped

    expect(mapped).toMatchObject({ _open: true })
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
                _required: Never
                _hidden: true
                _key: false
                _savedAs: undefined
                _default: undefined
              }
            }
            _required: AtLeastOnce
            _hidden: false
            _key: false
            _savedAs: undefined
            _default: undefined
          }
        }
        _required: Never
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
              _required: 'never',
              _hidden: true,
              _key: false,
              _savedAs: undefined,
              _default: undefined
            }
          },
          _required: 'atLeastOnce',
          _hidden: false,
          _key: false,
          _savedAs: undefined,
          _default: undefined
        }
      },
      _required: 'never',
      _hidden: false,
      _key: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
