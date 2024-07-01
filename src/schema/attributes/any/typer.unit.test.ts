import type { A } from 'ts-toolbelt'

import { $state, $type } from '../constants/attributeOptions.js'
import { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { $AnyAttributeState, AnyAttribute } from './interface.js'
import { any } from './typer.js'

describe('anyAttribute', () => {
  test('returns default any', () => {
    const anyInstance = any()

    const assertType: A.Equals<(typeof anyInstance)[$type], 'any'> = 1
    assertType
    expect(anyInstance[$type]).toBe('any')

    const assertState: A.Equals<
      (typeof anyInstance)[$state],
      {
        required: AtLeastOnce
        hidden: false
        savedAs: undefined
        key: false
        defaults: { key: undefined; put: undefined; update: undefined }
        links: { key: undefined; put: undefined; update: undefined }
        castAs: unknown
      }
    > = 1
    assertState
    expect(anyInstance[$state]).toStrictEqual({
      required: 'atLeastOnce',
      hidden: false,
      savedAs: undefined,
      key: false,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined },
      castAs: undefined
    })

    const assertExtends: A.Extends<typeof anyInstance, $AnyAttributeState> = 1
    assertExtends

    const frozenAny = anyInstance.freeze('some.path')
    const assertFrozenExtends: A.Extends<typeof frozenAny, AnyAttribute> = 1
    assertFrozenExtends
  })

  test('returns required any (option)', () => {
    const anyAtLeastOnce = any({ required: 'atLeastOnce' })
    const anyAlways = any({ required: 'always' })
    const anyNever = any({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof anyAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyNever)[$state], { required: Never }> = 1
    assertNever

    expect(anyAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(anyAlways[$state].required).toBe('always')
    expect(anyNever[$state].required).toBe('never')
  })

  test('returns required any (method)', () => {
    const anyAtLeastOnce = any().required()
    const anyAlways = any().required('always')
    const anyNever = any().required('never')
    const anyOpt = any().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof anyAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof anyOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(anyAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(anyAlways[$state].required).toBe('always')
    expect(anyNever[$state].required).toBe('never')
    expect(anyOpt[$state].required).toBe('never')
  })

  test('returns hidden any (option)', () => {
    const anyInstance = any({ hidden: true })

    const assertAny: A.Contains<(typeof anyInstance)[$state], { hidden: true }> = 1
    assertAny

    expect(anyInstance[$state].hidden).toBe(true)
  })

  test('returns hidden any (method)', () => {
    const anyInstance = any().hidden()

    const assertAny: A.Contains<(typeof anyInstance)[$state], { hidden: true }> = 1
    assertAny

    expect(anyInstance[$state].hidden).toBe(true)
  })

  test('returns key any (option)', () => {
    const anyInstance = any({ key: true })

    const assertAny: A.Contains<
      (typeof anyInstance)[$state],
      { key: true; required: AtLeastOnce }
    > = 1
    assertAny

    expect(anyInstance[$state].key).toBe(true)
    expect(anyInstance[$state].required).toBe('atLeastOnce')
  })

  test('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<(typeof anyInstance)[$state], { key: true; required: Always }> = 1
    assertAny

    expect(anyInstance[$state].key).toBe(true)
    expect(anyInstance[$state].required).toBe('always')
  })

  test('returns savedAs any (option)', () => {
    const anyInstance = any({ savedAs: 'foo' })

    const assertAny: A.Contains<(typeof anyInstance)[$state], { savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance[$state].savedAs).toBe('foo')
  })

  test('returns savedAs any (method)', () => {
    const anyInstance = any().savedAs('foo')

    const assertAny: A.Contains<(typeof anyInstance)[$state], { savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance[$state].savedAs).toBe('foo')
  })

  test('returns castAs any (method)', () => {
    const anyInstance = any().castAs<'foo' | 'bar'>()

    const assertAny: A.Contains<(typeof anyInstance)[$state], { castAs: 'foo' | 'bar' }> = 1
    assertAny

    // Keeps cast type at type level only
    expect(anyInstance[$state].castAs).toBeUndefined()
  })

  test('returns any with default value (option)', () => {
    // TOIMPROVE: Add type constraints here
    const strA = any({ defaults: { key: 'hello', put: undefined, update: undefined } })
    const strB = any({ defaults: { key: undefined, put: 'world', update: undefined } })
    const sayHello = () => 'hello'
    const strC = any({ defaults: { key: undefined, put: undefined, update: sayHello } })

    const assertAnyA: A.Contains<
      (typeof strA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$state].defaults).toStrictEqual({ key: 'hello', put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      (typeof strB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$state].defaults).toStrictEqual({ key: undefined, put: 'world', update: undefined })

    const assertAnyC: A.Contains<
      (typeof strC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: sayHello
    })
  })

  test('returns any with default value (method)', () => {
    const strA = any().keyDefault('hello')
    const strB = any().putDefault('world')
    const sayHello = () => 'hello'
    const strC = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<
      (typeof strA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$state].defaults).toStrictEqual({ key: 'hello', put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      (typeof strB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$state].defaults).toStrictEqual({ key: undefined, put: 'world', update: undefined })

    const assertAnyC: A.Contains<
      (typeof strC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: sayHello
    })
  })

  test('returns any with PUT default value if it is not key (default shorthand)', () => {
    const str = any().default('hello')

    const assertAny: A.Contains<
      (typeof str)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAny

    expect(str[$state].defaults).toStrictEqual({ key: undefined, put: 'hello', update: undefined })
  })

  test('returns any with KEY default value if it is key (default shorthand)', () => {
    const str = any().key().default('hello')

    const assertAny: A.Contains<
      (typeof str)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAny

    expect(str[$state].defaults).toStrictEqual({ key: 'hello', put: undefined, update: undefined })
  })

  test('returns any with linked value (option)', () => {
    // TOIMPROVE: Add type constraints here
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true
    const strA = any({ links: { key: sayHello, put: undefined, update: undefined } })
    const strB = any({ links: { key: undefined, put: say42, update: undefined } })
    const strC = any({ links: { key: undefined, put: undefined, update: sayTrue } })

    const assertAnyA: A.Contains<
      (typeof strA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      (typeof strB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$state].links).toStrictEqual({ key: undefined, put: say42, update: undefined })

    const assertAnyC: A.Contains<
      (typeof strC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayTrue })
  })

  test('returns any with linked value (method)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true

    const strA = any().keyLink(sayHello)
    const strB = any().putLink(say42)
    const strC = any().updateLink(sayTrue)

    const assertAnyA: A.Contains<
      (typeof strA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      (typeof strB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$state].links).toStrictEqual({ key: undefined, put: say42, update: undefined })

    const assertAnyC: A.Contains<
      (typeof strC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayTrue })
  })

  test('returns any with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = any().link(sayHello)

    const assertAny: A.Contains<
      (typeof str)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAny

    expect(str[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  test('returns any with KEY link value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = any().key().link(sayHello)

    const assertAny: A.Contains<
      (typeof str)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAny

    expect(str[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
  })
})
