import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../primitive'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/symbols'

import { map } from './typer'

describe('map', () => {
  const str = string()

  it('returns default map', () => {
    const mapped = map({ str })

    const assertMapAttribute: A.Contains<
      typeof mapped,
      {
        [$type]: 'map'
        [$attributes]: {
          str: typeof str
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$open]: false
        [$savedAs]: undefined
        [$default]: undefined
      }
    > = 1
    assertMapAttribute

    expect(mapped).toMatchObject({
      [$type]: 'map',
      [$attributes]: { str },
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$open]: false,
      [$savedAs]: undefined,
      [$hidden]: false
    })
  })

  it('returns required map (option)', () => {
    const mappedAtLeastOnce = map({ str }, { required: 'atLeastOnce' })
    const mappedOnlyOnce = map({ str }, { required: 'onlyOnce' })
    const mappedAlways = map({ str }, { required: 'always' })
    const mappedNever = map({ str }, { required: 'never' })

    const assertMapAttributeAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { [$required]: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeOnlyOnce: A.Contains<
      typeof mappedOnlyOnce,
      { [$required]: OnlyOnce }
    > = 1
    assertMapAttributeOnlyOnce
    const assertMapAttributeAlways: A.Contains<typeof mappedAlways, { [$required]: Always }> = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<typeof mappedNever, { [$required]: Never }> = 1
    assertMapAttributeNever

    expect(mappedAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(mappedOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(mappedAlways).toMatchObject({ [$required]: 'always' })
    expect(mappedNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedOnlyOnce = map({ str }).required('onlyOnce')
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')
    const mappedOpt = map({ str }).optional()

    const assertMapAttributeAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { [$required]: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeOnlyOnce: A.Contains<
      typeof mappedOnlyOnce,
      { [$required]: OnlyOnce }
    > = 1
    assertMapAttributeOnlyOnce
    const assertMapAttributeAlways: A.Contains<typeof mappedAlways, { [$required]: Always }> = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<typeof mappedNever, { [$required]: Never }> = 1
    assertMapAttributeNever
    const assertMapAttributeOpt: A.Contains<typeof mappedOpt, { [$required]: Never }> = 1
    assertMapAttributeOpt

    expect(mappedAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(mappedOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(mappedAlways).toMatchObject({ [$required]: 'always' })
    expect(mappedNever).toMatchObject({ [$required]: 'never' })
    expect(mappedOpt).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapAttribute: A.Contains<typeof mapped, { [$hidden]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapAttribute: A.Contains<typeof mapped, { [$hidden]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$hidden]: true })
  })

  it('returns key map (option)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapAttribute: A.Contains<typeof mapped, { [$key]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$key]: true })
  })

  it('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapAttribute: A.Contains<typeof mapped, { [$key]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$key]: true })
  })

  it('returns open map (option)', () => {
    const mapped = map({ str }, { open: true })

    const assertMapAttribute: A.Contains<typeof mapped, { [$open]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$open]: true })
  })

  it('returns open map (method)', () => {
    const mapped = map({ str }).open()

    const assertMapAttribute: A.Contains<typeof mapped, { [$open]: true }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$open]: true })
  })

  it('returns savedAs map (option)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapAttribute: A.Contains<typeof mapped, { [$savedAs]: 'foo' }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapAttribute: A.Contains<typeof mapped, { [$savedAs]: 'foo' }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$savedAs]: 'foo' })
  })

  describe('default', () => {
    it('accepts ComputedDefault as default value (option)', () => {
      const mapped = map({ str }, { default: ComputedDefault })

      const assertMapAttribute: A.Contains<typeof mapped, { [$default]: ComputedDefault }> = 1
      assertMapAttribute

      expect(mapped).toMatchObject({ [$default]: ComputedDefault })
    })

    it('accepts ComputedDefault as default value (method)', () => {
      const mapped = map({ str }).default(ComputedDefault)

      const assertMapAttribute: A.Contains<typeof mapped, { [$default]: ComputedDefault }> = 1
      assertMapAttribute

      expect(mapped).toMatchObject({ [$default]: ComputedDefault })
    })
  })

  it('nested map', () => {
    const mapped = map({
      nested: map({
        nestedAgain: map({
          str
        }).hidden()
      })
    })

    const assertMapAttribute: A.Contains<
      typeof mapped,
      {
        [$type]: 'map'
        [$attributes]: {
          nested: {
            [$type]: 'map'
            [$attributes]: {
              nestedAgain: {
                [$type]: 'map'
                [$attributes]: {
                  str: typeof str
                }
                [$required]: AtLeastOnce
                [$hidden]: true
                [$key]: false
                [$savedAs]: undefined
                [$default]: undefined
              }
            }
            [$required]: AtLeastOnce
            [$hidden]: false
            [$key]: false
            [$savedAs]: undefined
            [$default]: undefined
          }
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$default]: undefined
      }
    > = 1
    assertMapAttribute

    expect(mapped).toMatchObject({
      [$type]: 'map',
      [$attributes]: {
        nested: {
          [$type]: 'map',
          [$attributes]: {
            nestedAgain: {
              [$type]: 'map',
              [$attributes]: {
                str
              },
              [$required]: 'atLeastOnce',
              [$hidden]: true,
              [$key]: false,
              [$savedAs]: undefined,
              [$default]: undefined
            }
          },
          [$required]: 'atLeastOnce',
          [$hidden]: false,
          [$key]: false,
          [$savedAs]: undefined,
          [$default]: undefined
        }
      },
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$default]: undefined
    })
  })
})
