import type { A } from 'ts-toolbelt'

import { binary, boolean } from '~/schema/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'

import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { Light } from '../utils/light.js'
import type { MapSchema } from './schema.js'
import { map } from './schema_.js'

describe('map', () => {
  const str = string()

  test('returns default map', () => {
    const mapped = map({ str })

    const assertType: A.Equals<(typeof mapped)['type'], 'map'> = 1
    assertType
    expect(mapped.type).toBe('map')

    const assertProps: A.Equals<(typeof mapped)['props'], {}> = 1
    assertProps
    expect(mapped.props).toStrictEqual({})

    const assertAttr: A.Equals<(typeof mapped)['attributes'], { str: Light<typeof str> }> = 1
    assertAttr
    expect(mapped.attributes).toStrictEqual({ str })

    const assertExtends: A.Extends<typeof mapped, MapSchema> = 1
    assertExtends
  })

  test('returns required map (props)', () => {
    const mappedAtLeastOnce = map({ str }, { required: 'atLeastOnce' })
    const mappedAlways = map({ str }, { required: 'always' })
    const mappedNever = map({ str }, { required: 'never' })

    const assertMapSchemaAtLeastOnce: A.Contains<
      (typeof mappedAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertMapSchemaAtLeastOnce
    const assertMapSchemaAlways: A.Contains<(typeof mappedAlways)['props'], { required: Always }> =
      1
    assertMapSchemaAlways
    const assertMapSchemaNever: A.Contains<(typeof mappedNever)['props'], { required: Never }> = 1
    assertMapSchemaNever

    expect(mappedAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(mappedAlways.props.required).toBe('always')
    expect(mappedNever.props.required).toBe('never')
  })

  test('returns required map (method)', () => {
    const mappedAtLeastOnce = map({ str }).required()
    const mappedAlways = map({ str }).required('always')
    const mappedNever = map({ str }).required('never')
    const mappedOpt = map({ str }).optional()

    const assertMapSchemaAtLeastOnce: A.Contains<
      (typeof mappedAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertMapSchemaAtLeastOnce
    const assertMapSchemaAlways: A.Contains<(typeof mappedAlways)['props'], { required: Always }> =
      1
    assertMapSchemaAlways
    const assertMapSchemaNever: A.Contains<(typeof mappedNever)['props'], { required: Never }> = 1
    assertMapSchemaNever
    const assertMapSchemaOpt: A.Contains<(typeof mappedOpt)['props'], { required: Never }> = 1
    assertMapSchemaOpt

    expect(mappedAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(mappedAlways.props.required).toBe('always')
    expect(mappedNever.props.required).toBe('never')
    expect(mappedOpt.props.required).toBe('never')
  })

  test('returns hidden map (props)', () => {
    const mapped = map({ str }, { hidden: true })

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { hidden: true }> = 1
    assertMapSchema

    expect(mapped.props.hidden).toBe(true)
  })

  test('returns hidden map (method)', () => {
    const mapped = map({ str }).hidden()

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { hidden: true }> = 1
    assertMapSchema

    expect(mapped.props.hidden).toBe(true)
  })

  test('returns key map (props)', () => {
    const mapped = map({ str }, { key: true })

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { key: true }> = 1
    assertMapSchema

    expect(mapped.props.key).toBe(true)
  })

  test('returns key map (method)', () => {
    const mapped = map({ str }).key()

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { key: true; required: Always }> = 1
    assertMapSchema

    expect(mapped.props.key).toBe(true)
    expect(mapped.props.required).toBe('always')
  })

  test('returns savedAs map (props)', () => {
    const mapped = map({ str }, { savedAs: 'foo' })

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { savedAs: 'foo' }> = 1
    assertMapSchema

    expect(mapped.props.savedAs).toBe('foo')
  })

  test('returns savedAs map (method)', () => {
    const mapped = map({ str }).savedAs('foo')

    const assertMapSchema: A.Contains<(typeof mapped)['props'], { savedAs: 'foo' }> = 1
    assertMapSchema

    expect(mapped.props.savedAs).toBe('foo')
  })

  test('returns defaulted map (props)', () => {
    const mapA = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { keyDefault: { str: 'foo' } }
    )

    const assertMapSchema: A.Contains<(typeof mapA)['props'], { keyDefault: unknown }> = 1
    assertMapSchema

    expect(mapA.props.keyDefault).toStrictEqual({ str: 'foo' })

    const mapB = map(
      { str },
      // TOIMPROVE: Try to add type constraints here
      { putDefault: { str: 'bar' } }
    )

    const assertMapB: A.Contains<(typeof mapB)['props'], { putDefault: unknown }> = 1
    assertMapB

    expect(mapB.props.putDefault).toStrictEqual({ str: 'bar' })

    const mapC = map({ str }, { updateDefault: { str: 'baz' } })

    const assertMapC: A.Contains<(typeof mapC)['props'], { updateDefault: unknown }> = 1
    assertMapC

    expect(mapC.props.updateDefault).toStrictEqual({ str: 'baz' })
  })

  test('returns defaulted map (method)', () => {
    const mapA = map({ str }).key().keyDefault({ str: 'foo' })

    const assertMapSchema: A.Contains<(typeof mapA)['props'], { keyDefault: unknown }> = 1
    assertMapSchema

    expect(mapA.props.keyDefault).toStrictEqual({ str: 'foo' })

    const mapB = map({ str }).putDefault({ str: 'bar' })

    const assertMapB: A.Contains<(typeof mapB)['props'], { putDefault: unknown }> = 1
    assertMapB

    expect(mapB.props.putDefault).toStrictEqual({ str: 'bar' })

    const mapC = map({ str }).updateDefault({ str: 'baz' })

    const assertMapC: A.Contains<(typeof mapC)['props'], { updateDefault: unknown }> = 1
    assertMapC

    expect(mapC.props.updateDefault).toStrictEqual({ str: 'baz' })
  })

  test('returns map with PUT default value if it is not key (default shorthand)', () => {
    const mapSchema = map({ str }).default({ str: 'foo' })

    const assertMap: A.Contains<(typeof mapSchema)['props'], { putDefault: unknown }> = 1
    assertMap

    expect(mapSchema.props.putDefault).toStrictEqual({ str: 'foo' })
  })

  test('returns map with KEY default value if it is key (default shorthand)', () => {
    const mapSchema = map({ str }).key().default({ str: 'bar' })

    const assertMap: A.Contains<(typeof mapSchema)['props'], { keyDefault: unknown }> = 1
    assertMap

    expect(mapSchema.props.keyDefault).toStrictEqual({ str: 'bar' })
  })

  test('returns map with validator (props)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const mapA = map({ str: string(), num: number() }, { keyValidator: pass })
    const mapB = map({ str: string(), num: number() }, { putValidator: pass })
    const mapC = map({ str: string(), num: number() }, { updateValidator: pass })

    const assertMapA: A.Contains<(typeof mapA)['props'], { keyValidator: Validator }> = 1
    assertMapA

    expect(mapA.props.keyValidator).toBe(pass)

    const assertMapB: A.Contains<(typeof mapB)['props'], { putValidator: Validator }> = 1
    assertMapB

    expect(mapB.props.putValidator).toBe(pass)

    const assertMapC: A.Contains<(typeof mapC)['props'], { updateValidator: Validator }> = 1
    assertMapC

    expect(mapC.props.updateValidator).toBe(pass)
  })

  test('returns map with validator (method)', () => {
    const pass = () => true

    const mapA = map({ str: string(), num: number() }).keyValidate(pass)
    const mapB = map({ str: string(), num: number() }).putValidate(pass)
    const mapC = map({ str: string(), num: number() }).updateValidate(pass)

    const assertMapA: A.Contains<(typeof mapA)['props'], { keyValidator: Validator }> = 1
    assertMapA

    expect(mapA.props.keyValidator).toBe(pass)

    const assertMapB: A.Contains<(typeof mapB)['props'], { putValidator: Validator }> = 1
    assertMapB

    expect(mapB.props.putValidator).toBe(pass)

    const assertMapC: A.Contains<(typeof mapC)['props'], { updateValidator: Validator }> = 1
    assertMapC

    expect(mapC.props.updateValidator).toBe(pass)

    const prevMap = map({ str: string(), num: number() })
    prevMap.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [{ str: string; num: number }, typeof prevMap]> = 1
      assertArgs

      return true
    })

    const prevOptMap = map({ str: string(), num: number() }).optional()
    prevOptMap.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [{ str: string; num: number }, typeof prevOptMap]> = 1
      assertArgs

      return true
    })
  })

  test('returns map with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _map = map({ str: string(), num: number() }).validate(pass)

    const assertMap: A.Contains<(typeof _map)['props'], { putValidator: Validator }> = 1
    assertMap

    expect(_map.props.putValidator).toBe(pass)
  })

  test('returns map with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _map = map({ str: string(), num: number() }).key().validate(pass)

    const assertMap: A.Contains<(typeof _map)['props'], { keyValidator: Validator }> = 1
    assertMap

    expect(_map.props.keyValidator).toBe(pass)
  })

  test('deep map', () => {
    const mapped = map({
      deep: map({
        deepAgain: map({ str }).hidden()
      })
    })

    const assertMapSchema: A.Contains<
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
                  str: Light<typeof str>
                }
                props: {
                  hidden: true
                }
              }
            }
            props: {}
          }
        }
        props: {}
      }
    > = 1
    assertMapSchema
  })

  const reqStr = string()
  const hidBool = boolean().hidden()
  const defNum = number().putDefault(42)
  const savedAsBin = binary().savedAs('_b')
  const keyStr = string().key()
  const enumStr = string().enum('foo', 'bar')

  test('pick', () => {
    const prevMap = map({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevMap>(({ reqStr }) => reqStr)
    const mapped = prevMap.and({ linkedStr })

    const pickedMap = mapped.pick(
      'hidBool',
      'defNum',
      'savedAsBin',
      'keyStr',
      'enumStr',
      'linkedStr'
    )

    const assertMap: A.Equals<
      (typeof pickedMap)['attributes'],
      {
        hidBool: ResetLinks<typeof hidBool>
        defNum: ResetLinks<typeof defNum>
        savedAsBin: ResetLinks<typeof savedAsBin>
        keyStr: ResetLinks<typeof keyStr>
        enumStr: ResetLinks<typeof enumStr>
        linkedStr: ResetLinks<typeof linkedStr>
      }
    > = 1
    assertMap

    expect(pickedMap.attributes).toMatchObject({ hidBool, defNum, savedAsBin, keyStr, enumStr })
    expect(pickedMap.attributes).not.toHaveProperty('reqStr')
    expect(pickedMap.attributes.linkedStr.props).toMatchObject({ putLink: undefined })

    // doesn't mute original sch
    expect(mapped.attributes).toHaveProperty('reqStr')
  })

  test('omit', () => {
    const prevMap = map({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevMap>(({ reqStr }) => reqStr)
    const mapped = prevMap.and({ linkedStr })

    const omittedSch = mapped.omit('reqStr')

    const assertSch: A.Equals<
      (typeof omittedSch)['attributes'],
      {
        hidBool: ResetLinks<typeof hidBool>
        defNum: ResetLinks<typeof defNum>
        savedAsBin: ResetLinks<typeof savedAsBin>
        keyStr: ResetLinks<typeof keyStr>
        enumStr: ResetLinks<typeof enumStr>
        linkedStr: ResetLinks<typeof linkedStr>
      }
    > = 1
    assertSch
    expect(omittedSch.attributes).toMatchObject({ hidBool, defNum, savedAsBin, keyStr, enumStr })
    expect(omittedSch.attributes).not.toHaveProperty('reqStr')
    expect(omittedSch.attributes.linkedStr.props).toMatchObject({ putLink: undefined })

    // doesn't mute original sch
    expect(mapped.attributes).toHaveProperty('reqStr')
  })
})
