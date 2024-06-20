import type { A } from 'ts-toolbelt'

import { Never, AtLeastOnce, Always } from '../constants/index.js'
import { string } from '../primitive/index.js'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'

import { map } from './typer.js'
import type { MapAttribute, $MapAttributeState } from './interface.js'

describe('map', () => {
  const str = string()

  test('returns default map', () => {
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
          key: undefined
          put: undefined
          update: undefined
        }
        [$links]: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertMapAttribute

    const assertExtends: A.Extends<typeof mapped, $MapAttributeState> = 1
    assertExtends

    const frozenMap = mapped.freeze('some.path')
    const assertFrozenExtends: A.Extends<typeof frozenMap, MapAttribute> = 1
    assertFrozenExtends

    expect(mapped[$type]).toBe('map')
    expect(mapped[$attributes]).toStrictEqual({ str })
    expect(mapped[$required]).toBe('atLeastOnce')
    expect(mapped[$key]).toBe(false)
    expect(mapped[$savedAs]).toBe(undefined)
    expect(mapped[$hidden]).toBe(false)
    expect(mapped[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
    expect(mapped[$links]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
  })

  test('returns required map (option)', () => {
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

    expect(mappedAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(mappedAlways[$required]).toBe('always')
    expect(mappedNever[$required]).toBe('never')
  })

  test('returns required map (method)', () => {
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

    expect(mappedAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(mappedAlways[$required]).toBe('always')
    expect(mappedNever[$required]).toBe('never')
    expect(mappedOpt[$required]).toBe('never')
  })

  test('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapAttribute: A.Contains<typeof mapped, { [$hidden]: true }> = 1
    assertMapAttribute

    expect(mapped[$hidden]).toBe(true)
  })

  test('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapAttribute: A.Contains<typeof mapped, { [$hidden]: true }> = 1
    assertMapAttribute

    expect(mapped[$hidden]).toBe(true)
  })

  test('returns key map (option)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapAttribute: A.Contains<
      typeof mapped,
      { [$key]: true; [$required]: AtLeastOnce }
    > = 1
    assertMapAttribute

    expect(mapped[$key]).toBe(true)
    expect(mapped[$required]).toBe('atLeastOnce')
  })

  test('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapAttribute: A.Contains<typeof mapped, { [$key]: true; [$required]: Always }> = 1
    assertMapAttribute

    expect(mapped[$key]).toBe(true)
    expect(mapped[$required]).toBe('always')
  })

  test('returns savedAs map (option)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapAttribute: A.Contains<typeof mapped, { [$savedAs]: 'foo' }> = 1
    assertMapAttribute

    expect(mapped[$savedAs]).toBe('foo')
  })

  test('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapAttribute: A.Contains<typeof mapped, { [$savedAs]: 'foo' }> = 1
    assertMapAttribute

    expect(mapped[$savedAs]).toBe('foo')
  })

  test('returns defaulted map (option)', () => {
    const mapA = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { defaults: { key: { str: 'foo' }, put: undefined, update: undefined } }
    )

    const assertMapAttribute: A.Contains<
      typeof mapA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMapAttribute

    expect(mapA[$defaults]).toStrictEqual({
      key: { str: 'foo' },
      put: undefined,
      update: undefined
    })

    const mapB = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { defaults: { key: undefined, put: { str: 'bar' }, update: undefined } }
    )

    const assertMapB: A.Contains<
      typeof mapB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$defaults]).toStrictEqual({
      key: undefined,
      put: { str: 'bar' },
      update: undefined
    })

    const mapC = map(
      { str },
      { defaults: { key: undefined, put: undefined, update: { str: 'baz' } } }
    )

    const assertMapC: A.Contains<
      typeof mapC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertMapC

    expect(mapC[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { str: 'baz' }
    })
  })

  test('returns defaulted map (method)', () => {
    const mapA = map({ str }).key().keyDefault({ str: 'foo' })

    const assertMapAttribute: A.Contains<
      typeof mapA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMapAttribute

    expect(mapA[$defaults]).toStrictEqual({
      key: { str: 'foo' },
      put: undefined,
      update: undefined
    })

    const mapB = map({ str }).putDefault({ str: 'bar' })

    const assertMapB: A.Contains<
      typeof mapB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$defaults]).toStrictEqual({
      key: undefined,
      put: { str: 'bar' },
      update: undefined
    })

    const mapC = map({ str }).updateDefault({ str: 'baz' })

    const assertMapC: A.Contains<
      typeof mapC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertMapC

    expect(mapC[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { str: 'baz' }
    })
  })

  test('returns map with PUT default value if it is not key (default shorthand)', () => {
    const mapAttr = map({ str }).default({ str: 'foo' })

    const assertMap: A.Contains<
      typeof mapAttr,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMap

    expect(mapAttr[$defaults]).toStrictEqual({
      key: undefined,
      put: { str: 'foo' },
      update: undefined
    })
  })

  test('returns map with KEY default value if it is key (default shorthand)', () => {
    const mapAttr = map({ str }).key().default({ str: 'bar' })

    const assertMap: A.Contains<
      typeof mapAttr,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMap

    expect(mapAttr[$defaults]).toStrictEqual({
      key: { str: 'bar' },
      put: undefined,
      update: undefined
    })
  })

  test('nested map', () => {
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
                  key: undefined
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
              key: undefined
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
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertMapAttribute
  })
})
