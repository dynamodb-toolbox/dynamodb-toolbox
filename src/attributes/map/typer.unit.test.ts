import type { A } from 'ts-toolbelt'

import { $attributes, $type } from '../constants/attributeOptions.js'
import { $state } from '../constants/index.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeMapAttribute } from './freeze.js'
import type { $MapAttributeState, MapAttribute } from './interface.js'
import { map } from './typer.js'

describe('map', () => {
  const str = string()

  test('returns default map', () => {
    const mapped = map({ str })

    const assertType: A.Equals<(typeof mapped)[$type], 'map'> = 1
    assertType
    expect(mapped[$type]).toBe('map')

    const assertState: A.Equals<
      (typeof mapped)[$state],
      {
        required: AtLeastOnce
        hidden: false
        key: false
        savedAs: undefined
        defaults: {
          key: undefined
          put: undefined
          update: undefined
        }
        links: {
          key: undefined
          put: undefined
          update: undefined
        }
        validators: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertState
    expect(mapped[$state]).toStrictEqual({
      required: 'atLeastOnce',
      key: false,
      savedAs: undefined,
      hidden: false,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined },
      validators: { key: undefined, put: undefined, update: undefined }
    })

    const assertAttr: A.Equals<(typeof mapped)[$attributes], { str: typeof str }> = 1
    assertAttr
    expect(mapped[$attributes]).toStrictEqual({ str })

    const assertExtends: A.Extends<typeof mapped, $MapAttributeState> = 1
    assertExtends

    const frozenMap = mapped.freeze('some.path')
    const assertFrozenExtends: A.Extends<typeof frozenMap, MapAttribute> = 1
    assertFrozenExtends
  })

  test('returns required map (option)', () => {
    const mappedAtLeastOnce = map({ str }, { required: 'atLeastOnce' })
    const mappedAlways = map({ str }, { required: 'always' })
    const mappedNever = map({ str }, { required: 'never' })

    const assertMapAttributeAtLeastOnce: A.Contains<
      (typeof mappedAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<
      (typeof mappedAlways)[$state],
      { required: Always }
    > = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<(typeof mappedNever)[$state], { required: Never }> = 1
    assertMapAttributeNever

    expect(mappedAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(mappedAlways[$state].required).toBe('always')
    expect(mappedNever[$state].required).toBe('never')
  })

  test('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')
    const mappedOpt = map({ str }).optional()

    const assertMapAttributeAtLeastOnce: A.Contains<
      (typeof mappedAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<
      (typeof mappedAlways)[$state],
      { required: Always }
    > = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<(typeof mappedNever)[$state], { required: Never }> = 1
    assertMapAttributeNever
    const assertMapAttributeOpt: A.Contains<(typeof mappedOpt)[$state], { required: Never }> = 1
    assertMapAttributeOpt

    expect(mappedAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(mappedAlways[$state].required).toBe('always')
    expect(mappedNever[$state].required).toBe('never')
    expect(mappedOpt[$state].required).toBe('never')
  })

  test('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapAttribute: A.Contains<(typeof mapped)[$state], { hidden: true }> = 1
    assertMapAttribute

    expect(mapped[$state].hidden).toBe(true)
  })

  test('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapAttribute: A.Contains<(typeof mapped)[$state], { hidden: true }> = 1
    assertMapAttribute

    expect(mapped[$state].hidden).toBe(true)
  })

  test('returns key map (option)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapAttribute: A.Contains<
      (typeof mapped)[$state],
      { key: true; required: AtLeastOnce }
    > = 1
    assertMapAttribute

    expect(mapped[$state].key).toBe(true)
    expect(mapped[$state].required).toBe('atLeastOnce')
  })

  test('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapAttribute: A.Contains<(typeof mapped)[$state], { key: true; required: Always }> =
      1
    assertMapAttribute

    expect(mapped[$state].key).toBe(true)
    expect(mapped[$state].required).toBe('always')
  })

  test('returns savedAs map (option)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapAttribute: A.Contains<(typeof mapped)[$state], { savedAs: 'foo' }> = 1
    assertMapAttribute

    expect(mapped[$state].savedAs).toBe('foo')
  })

  test('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapAttribute: A.Contains<(typeof mapped)[$state], { savedAs: 'foo' }> = 1
    assertMapAttribute

    expect(mapped[$state].savedAs).toBe('foo')
  })

  test('returns defaulted map (option)', () => {
    const mapA = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { defaults: { key: { str: 'foo' }, put: undefined, update: undefined } }
    )

    const assertMapAttribute: A.Contains<
      (typeof mapA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMapAttribute

    expect(mapA[$state].defaults).toStrictEqual({
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
      (typeof mapB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$state].defaults).toStrictEqual({
      key: undefined,
      put: { str: 'bar' },
      update: undefined
    })

    const mapC = map(
      { str },
      { defaults: { key: undefined, put: undefined, update: { str: 'baz' } } }
    )

    const assertMapC: A.Contains<
      (typeof mapC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertMapC

    expect(mapC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { str: 'baz' }
    })
  })

  test('returns defaulted map (method)', () => {
    const mapA = map({ str }).key().keyDefault({ str: 'foo' })

    const assertMapAttribute: A.Contains<
      (typeof mapA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMapAttribute

    expect(mapA[$state].defaults).toStrictEqual({
      key: { str: 'foo' },
      put: undefined,
      update: undefined
    })

    const mapB = map({ str }).putDefault({ str: 'bar' })

    const assertMapB: A.Contains<
      (typeof mapB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$state].defaults).toStrictEqual({
      key: undefined,
      put: { str: 'bar' },
      update: undefined
    })

    const mapC = map({ str }).updateDefault({ str: 'baz' })

    const assertMapC: A.Contains<
      (typeof mapC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertMapC

    expect(mapC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { str: 'baz' }
    })
  })

  test('returns map with PUT default value if it is not key (default shorthand)', () => {
    const mapAttr = map({ str }).default({ str: 'foo' })

    const assertMap: A.Contains<
      (typeof mapAttr)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertMap

    expect(mapAttr[$state].defaults).toStrictEqual({
      key: undefined,
      put: { str: 'foo' },
      update: undefined
    })
  })

  test('returns map with KEY default value if it is key (default shorthand)', () => {
    const mapAttr = map({ str }).key().default({ str: 'bar' })

    const assertMap: A.Contains<
      (typeof mapAttr)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertMap

    expect(mapAttr[$state].defaults).toStrictEqual({
      key: { str: 'bar' },
      put: undefined,
      update: undefined
    })
  })

  test('returns map with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const mapA = map(
      { str: string(), num: number() },
      { validators: { key: pass, put: undefined, update: undefined } }
    )
    const mapB = map(
      { str: string(), num: number() },
      { validators: { key: undefined, put: pass, update: undefined } }
    )
    const mapC = map(
      { str: string(), num: number() },
      { validators: { key: undefined, put: undefined, update: pass } }
    )

    const assertMapA: A.Contains<
      (typeof mapA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertMapA

    expect(mapA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertMapB: A.Contains<
      (typeof mapB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertMapC: A.Contains<
      (typeof mapC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertMapC

    expect(mapC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns map with validator (method)', () => {
    const pass = () => true

    const mapA = map({ str: string(), num: number() }).keyValidate(pass)
    const mapB = map({ str: string(), num: number() }).putValidate(pass)
    const mapC = map({ str: string(), num: number() }).updateValidate(pass)

    const assertMapA: A.Contains<
      (typeof mapA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertMapA

    expect(mapA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertMapB: A.Contains<
      (typeof mapB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertMapB

    expect(mapB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertMapC: A.Contains<
      (typeof mapC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertMapC

    expect(mapC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

    const prevMap = map({ str: string(), num: number() })
    prevMap.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [{ str: string; num: number }, FreezeMapAttribute<typeof prevMap>]
      > = 1
      assertArgs

      return true
    })

    const prevOptMap = map({ str: string(), num: number() }).optional()
    prevOptMap.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [{ str: string; num: number }, FreezeMapAttribute<typeof prevOptMap>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns map with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _map = map({ str: string(), num: number() }).validate(pass)

    const assertMap: A.Contains<
      (typeof _map)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertMap

    expect(_map[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns map with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _map = map({ str: string(), num: number() }).key().validate(pass)

    const assertMap: A.Contains<
      (typeof _map)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertMap

    expect(_map[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })

  test('deep map', () => {
    const mapped = map({
      deep: map({
        deepAgain: map({
          str
        }).hidden()
      })
    })

    const assertMapAttribute: A.Contains<
      typeof mapped,
      {
        [$type]: 'map'
        [$attributes]: {
          deep: {
            [$type]: 'map'
            [$attributes]: {
              deepAgain: {
                [$type]: 'map'
                [$attributes]: {
                  str: typeof str
                }
                [$state]: {
                  required: AtLeastOnce
                  hidden: true
                  key: false
                  savedAs: undefined
                  defaults: {
                    key: undefined
                    put: undefined
                    update: undefined
                  }
                }
              }
            }
            [$state]: {
              required: AtLeastOnce
              hidden: false
              key: false
              savedAs: undefined
              defaults: {
                key: undefined
                put: undefined
                update: undefined
              }
            }
          }
        }
        [$state]: {
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: undefined
          defaults: {
            key: undefined
            put: undefined
            update: undefined
          }
        }
      }
    > = 1
    assertMapAttribute
  })

  const thisIsATest = map({
    a: string(),
    b: string(),
    c: string(),
    d: string(),
    e: string(),
    f: string(),
    g: string(),
    h: string(),
    i: string(),
    j: string(),
    k: string(),
    l: string(),
    m: string(),
    n: string(),
    o: string(),
    p: string(),
    q: string(),
    r: string(),
    s: string(),
    t: string(),
    u: string(),
    v: string(),
    w: string(),
    x: string(),
    y: string(),
    z: string(),
    a0: string(),
    b0: string(),
    c0: string(),
    d0: string(),
    e0: string(),
    f0: string(),
    g0: string(),
    h0: string(),
    i0: string(),
    j0: string(),
    k0: string(),
    l0: string(),
    m0: string(),
    n0: string(),
    o0: string(),
    p0: string(),
    q0: string(),
    r0: string(),
    s0: string(),
    t0: string(),
    u0: string(),
    v0: string(),
    w0: string(),
    x0: string(),
    y0: string(),
    z0: string(),
    a1: string(),
    b1: string(),
    c1: string(),
    d1: string(),
    e1: string(),
    f1: string(),
    g1: string(),
    h1: string(),
    i1: string(),
    j1: string(),
    k1: string(),
    l1: string(),
    m1: string(),
    n1: string(),
    o1: string(),
    p1: string(),
    q1: string(),
    r1: string(),
    s1: string(),
    t1: string(),
    u1: string(),
    v1: string(),
    w1: string(),
    x1: string(),
    y1: string(),
    z1: string()
  }).freeze()
  thisIsATest.attributes
})
