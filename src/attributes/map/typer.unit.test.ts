import type { A } from 'ts-toolbelt'

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

    const assertType: A.Equals<(typeof mapped)['type'], 'map'> = 1
    assertType
    expect(mapped.type).toBe('map')

    const assertState: A.Equals<(typeof mapped)['state'], {}> = 1
    assertState
    expect(mapped.state).toStrictEqual({})

    const assertAttr: A.Equals<(typeof mapped)['attributes'], { str: typeof str }> = 1
    assertAttr
    expect(mapped.attributes).toStrictEqual({ str })

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
      (typeof mappedAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<
      (typeof mappedAlways)['state'],
      { required: Always }
    > = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<(typeof mappedNever)['state'], { required: Never }> =
      1
    assertMapAttributeNever

    expect(mappedAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(mappedAlways.state.required).toBe('always')
    expect(mappedNever.state.required).toBe('never')
  })

  test('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')
    const mappedOpt = map({ str }).optional()

    const assertMapAttributeAtLeastOnce: A.Contains<
      (typeof mappedAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertMapAttributeAtLeastOnce
    const assertMapAttributeAlways: A.Contains<
      (typeof mappedAlways)['state'],
      { required: Always }
    > = 1
    assertMapAttributeAlways
    const assertMapAttributeNever: A.Contains<(typeof mappedNever)['state'], { required: Never }> =
      1
    assertMapAttributeNever
    const assertMapAttributeOpt: A.Contains<(typeof mappedOpt)['state'], { required: Never }> = 1
    assertMapAttributeOpt

    expect(mappedAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(mappedAlways.state.required).toBe('always')
    expect(mappedNever.state.required).toBe('never')
    expect(mappedOpt.state.required).toBe('never')
  })

  test('returns hidden map (option)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapAttribute: A.Contains<(typeof mapped)['state'], { hidden: true }> = 1
    assertMapAttribute

    expect(mapped.state.hidden).toBe(true)
  })

  test('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapAttribute: A.Contains<(typeof mapped)['state'], { hidden: true }> = 1
    assertMapAttribute

    expect(mapped.state.hidden).toBe(true)
  })

  test('returns key map (option)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapAttribute: A.Contains<(typeof mapped)['state'], { key: true }> = 1
    assertMapAttribute

    expect(mapped.state.key).toBe(true)
  })

  test('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapAttribute: A.Contains<
      (typeof mapped)['state'],
      { key: true; required: Always }
    > = 1
    assertMapAttribute

    expect(mapped.state.key).toBe(true)
    expect(mapped.state.required).toBe('always')
  })

  test('returns savedAs map (option)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapAttribute: A.Contains<(typeof mapped)['state'], { savedAs: 'foo' }> = 1
    assertMapAttribute

    expect(mapped.state.savedAs).toBe('foo')
  })

  test('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapAttribute: A.Contains<(typeof mapped)['state'], { savedAs: 'foo' }> = 1
    assertMapAttribute

    expect(mapped.state.savedAs).toBe('foo')
  })

  test('returns defaulted map (option)', () => {
    const mapA = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { keyDefault: { str: 'foo' } }
    )

    const assertMapAttribute: A.Contains<(typeof mapA)['state'], { keyDefault: unknown }> = 1
    assertMapAttribute

    expect(mapA.state.keyDefault).toStrictEqual({ str: 'foo' })

    const mapB = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { putDefault: { str: 'bar' } }
    )

    const assertMapB: A.Contains<(typeof mapB)['state'], { putDefault: unknown }> = 1
    assertMapB

    expect(mapB.state.putDefault).toStrictEqual({ str: 'bar' })

    const mapC = map({ str }, { updateDefault: { str: 'baz' } })

    const assertMapC: A.Contains<(typeof mapC)['state'], { updateDefault: unknown }> = 1
    assertMapC

    expect(mapC.state.updateDefault).toStrictEqual({ str: 'baz' })
  })

  test('returns defaulted map (method)', () => {
    const mapA = map({ str }).key().keyDefault({ str: 'foo' })

    const assertMapAttribute: A.Contains<(typeof mapA)['state'], { keyDefault: unknown }> = 1
    assertMapAttribute

    expect(mapA.state.keyDefault).toStrictEqual({ str: 'foo' })

    const mapB = map({ str }).putDefault({ str: 'bar' })

    const assertMapB: A.Contains<(typeof mapB)['state'], { putDefault: unknown }> = 1
    assertMapB

    expect(mapB.state.putDefault).toStrictEqual({ str: 'bar' })

    const mapC = map({ str }).updateDefault({ str: 'baz' })

    const assertMapC: A.Contains<(typeof mapC)['state'], { updateDefault: unknown }> = 1
    assertMapC

    expect(mapC.state.updateDefault).toStrictEqual({ str: 'baz' })
  })

  test('returns map with PUT default value if it is not key (default shorthand)', () => {
    const mapAttr = map({ str }).default({ str: 'foo' })

    const assertMap: A.Contains<(typeof mapAttr)['state'], { putDefault: unknown }> = 1
    assertMap

    expect(mapAttr.state.putDefault).toStrictEqual({ str: 'foo' })
  })

  test('returns map with KEY default value if it is key (default shorthand)', () => {
    const mapAttr = map({ str }).key().default({ str: 'bar' })

    const assertMap: A.Contains<(typeof mapAttr)['state'], { keyDefault: unknown }> = 1
    assertMap

    expect(mapAttr.state.keyDefault).toStrictEqual({ str: 'bar' })
  })

  test('returns map with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const mapA = map({ str: string(), num: number() }, { keyValidator: pass })
    const mapB = map({ str: string(), num: number() }, { putValidator: pass })
    const mapC = map({ str: string(), num: number() }, { updateValidator: pass })

    const assertMapA: A.Contains<(typeof mapA)['state'], { keyValidator: Validator }> = 1
    assertMapA

    expect(mapA.state.keyValidator).toBe(pass)

    const assertMapB: A.Contains<(typeof mapB)['state'], { putValidator: Validator }> = 1
    assertMapB

    expect(mapB.state.putValidator).toBe(pass)

    const assertMapC: A.Contains<(typeof mapC)['state'], { updateValidator: Validator }> = 1
    assertMapC

    expect(mapC.state.updateValidator).toBe(pass)
  })

  test('returns map with validator (method)', () => {
    const pass = () => true

    const mapA = map({ str: string(), num: number() }).keyValidate(pass)
    const mapB = map({ str: string(), num: number() }).putValidate(pass)
    const mapC = map({ str: string(), num: number() }).updateValidate(pass)

    const assertMapA: A.Contains<(typeof mapA)['state'], { keyValidator: Validator }> = 1
    assertMapA

    expect(mapA.state.keyValidator).toBe(pass)

    const assertMapB: A.Contains<(typeof mapB)['state'], { putValidator: Validator }> = 1
    assertMapB

    expect(mapB.state.putValidator).toBe(pass)

    const assertMapC: A.Contains<(typeof mapC)['state'], { updateValidator: Validator }> = 1
    assertMapC

    expect(mapC.state.updateValidator).toBe(pass)

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

    const assertMap: A.Contains<(typeof _map)['state'], { putValidator: Validator }> = 1
    assertMap

    expect(_map.state.putValidator).toBe(pass)
  })

  test('returns map with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _map = map({ str: string(), num: number() }).key().validate(pass)

    const assertMap: A.Contains<(typeof _map)['state'], { keyValidator: Validator }> = 1
    assertMap

    expect(_map.state.keyValidator).toBe(pass)
  })

  test('deep map', () => {
    const mapped = map({
      deep: map({
        deepAgain: map({ str }).hidden()
      })
    })

    const assertMapAttribute: A.Contains<
      typeof mapped,
      {
        type: 'map'
        attributes: {
          deep: {
            type: 'map'
            attributes: {
              deepAgain: {
                type: 'map'
                attributes: {
                  str: typeof str
                }
                state: {
                  hidden: true
                }
              }
            }
            state: {}
          }
        }
        state: {}
      }
    > = 1
    assertMapAttribute
  })
})
