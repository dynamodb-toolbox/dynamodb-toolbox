import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, Always } from '../constants'
import { string } from '../primitive'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import { map } from './typer'
import type { MapAttribute, $MapAttribute } from './interface'
import { freezeMapAttribute } from './freeze'

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
        [$savedAs]: undefined
        [$defaults]: {
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertMapAttribute

    const assertExtends: A.Extends<typeof mapped, $MapAttribute> = 1
    assertExtends

    const frozenMap = freezeMapAttribute(mapped, 'some.path')
    const assertFrozenExtends: A.Extends<typeof frozenMap, MapAttribute> = 1
    assertFrozenExtends

    expect(mapped).toMatchObject({
      [$type]: 'map',
      [$attributes]: { str },
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$savedAs]: undefined,
      [$hidden]: false,
      [$defaults]: {
        put: undefined,
        update: undefined
      }
    })
  })

  it('returns required map (option)', () => {
    const mappedAtLeastOnce = map({ str }, { required: 'atLeastOnce' })
    const mappedAlways = map({ str }, { required: 'always' })
    const mappedNever = map({ str }, { required: 'never' })

    const assertMapAttributeAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { [$required]: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<typeof mappedAlways, { [$required]: Always }> = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<typeof mappedNever, { [$required]: Never }> = 1
    assertMapAttributeNever

    expect(mappedAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(mappedAlways).toMatchObject({ [$required]: 'always' })
    expect(mappedNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')
    const mappedOpt = map({ str }).optional()

    const assertMapAttributeAtLeastOnce: A.Contains<
      typeof mappedAtLeastOnce,
      { [$required]: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<typeof mappedAlways, { [$required]: Always }> = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<typeof mappedNever, { [$required]: Never }> = 1
    assertMapAttributeNever
    const assertMapAttributeOpt: A.Contains<typeof mappedOpt, { [$required]: Never }> = 1
    assertMapAttributeOpt

    expect(mappedAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
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

    const assertMapAttribute: A.Contains<
      typeof mapped,
      { [$key]: true; [$required]: AtLeastOnce }
    > = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapAttribute: A.Contains<typeof mapped, { [$key]: true; [$required]: Always }> = 1
    assertMapAttribute

    expect(mapped).toMatchObject({ [$key]: true, [$required]: 'always' })
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
      const mapped = map({ str }, { defaults: { put: ComputedDefault, update: undefined } })

      const assertMapAttribute: A.Contains<
        typeof mapped,
        { [$defaults]: { put: ComputedDefault; update: undefined } }
      > = 1
      assertMapAttribute

      expect(mapped).toMatchObject({ [$defaults]: { put: ComputedDefault, update: undefined } })
    })

    it('accepts ComputedDefault as default value (method)', () => {
      const mapped = map({ str }).updateDefault(ComputedDefault)

      const assertMapAttribute: A.Contains<
        typeof mapped,
        { [$defaults]: { put: undefined; update: ComputedDefault } }
      > = 1
      assertMapAttribute

      expect(mapped).toMatchObject({ [$defaults]: { put: undefined, update: ComputedDefault } })
    })

    it('accepts ComputedDefault as default values (method)', () => {
      const mapped = map({ str }).defaults(ComputedDefault)

      const assertMapAttribute: A.Contains<
        typeof mapped,
        { [$defaults]: { put: ComputedDefault; update: ComputedDefault } }
      > = 1
      assertMapAttribute

      expect(mapped).toMatchObject({
        [$defaults]: { put: ComputedDefault, update: ComputedDefault }
      })
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
                [$defaults]: {
                  put: undefined
                  update: undefined
                }
              }
            }
            [$required]: AtLeastOnce
            [$hidden]: false
            [$key]: false
            [$savedAs]: undefined
            [$defaults]: {
              put: undefined
              update: undefined
            }
          }
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$defaults]: {
          put: undefined
          update: undefined
        }
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
              [$defaults]: {
                put: undefined,
                update: undefined
              }
            }
          },
          [$required]: 'atLeastOnce',
          [$hidden]: false,
          [$key]: false,
          [$savedAs]: undefined,
          [$defaults]: {
            put: undefined,
            update: undefined
          }
        }
      },
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$defaults]: {
        put: undefined,
        update: undefined
      }
    })
  })
})
