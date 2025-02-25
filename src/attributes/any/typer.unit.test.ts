import type { A } from 'ts-toolbelt'

import { jsonStringify } from '~/transformers/jsonStringify.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeAnyAttribute } from './freeze.js'
import type { $AnyAttributeState, AnyAttribute } from './interface.js'
import { any } from './typer.js'

describe('anyAttribute', () => {
  test('returns default any', () => {
    const anyInstance = any()

    const assertType: A.Equals<(typeof anyInstance)[$type], 'any'> = 1
    assertType
    expect(anyInstance[$type]).toBe('any')

    const assertState: A.Equals<(typeof anyInstance)[$state], {}> = 1
    assertState
    expect(anyInstance[$state]).toStrictEqual({})

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

    const assertAny: A.Contains<(typeof anyInstance)[$state], { key: true }> = 1
    assertAny

    expect(anyInstance[$state].key).toBe(true)
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

  test('returns transformed any (option)', () => {
    const transformer = jsonStringify()
    const anyInstance = any({ transform: transformer })

    const assertAny: A.Contains<(typeof anyInstance)[$state], { transform: typeof transformer }> = 1
    assertAny

    expect(anyInstance[$state].transform).toBe(transformer)
  })

  test('returns transformed any (method)', () => {
    const transformer = jsonStringify()
    const anyInstance = any().transform(transformer)

    const assertAny: A.Contains<(typeof anyInstance)[$state], { transform: typeof transformer }> = 1
    assertAny

    expect(anyInstance[$state].transform).toBe(transformer)
  })

  test('returns any with default value (option)', () => {
    const anyA = any({ keyDefault: 'hello' })
    const anyB = any({ putDefault: 'world' })
    const sayHello = () => 'hello'
    const anyC = any({ updateDefault: sayHello })

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyDefault: unknown }> = 1
    assertAnyA

    expect(anyA[$state].keyDefault).toBe('hello')

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putDefault: unknown }> = 1
    assertAnyB

    expect(anyB[$state].putDefault).toBe('world')

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateDefault: unknown }> = 1
    assertAnyC

    expect(anyC[$state].updateDefault).toBe(sayHello)
  })

  test('returns any with default value (method)', () => {
    const anyA = any().keyDefault('hello')
    const anyB = any().putDefault('world')
    const sayHello = () => 'hello'
    const anyC = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyDefault: unknown }> = 1
    assertAnyA

    expect(anyA[$state].keyDefault).toBe('hello')

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putDefault: unknown }> = 1
    assertAnyB

    expect(anyB[$state].putDefault).toBe('world')

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateDefault: unknown }> = 1
    assertAnyC

    expect(anyC[$state].updateDefault).toBe(sayHello)
  })

  test('returns any with PUT default value if it is not key (default shorthand)', () => {
    const _any = any().default('hello')

    const assertAny: A.Contains<(typeof _any)[$state], { putDefault: unknown }> = 1
    assertAny

    expect(_any[$state].putDefault).toBe('hello')
  })

  test('returns any with KEY default value if it is key (default shorthand)', () => {
    const _any = any().key().default('hello')

    const assertAny: A.Contains<(typeof _any)[$state], { keyDefault: unknown }> = 1
    assertAny

    expect(_any[$state].keyDefault).toBe('hello')
  })

  test('returns any with linked value (option)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true
    const anyA = any({ keyLink: sayHello })
    const anyB = any({ putLink: say42 })
    const anyC = any({ updateLink: sayTrue })

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyLink: unknown }> = 1
    assertAnyA

    expect(anyA[$state].keyLink).toBe(sayHello)

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putLink: unknown }> = 1
    assertAnyB

    expect(anyB[$state].putLink).toBe(say42)

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateLink: unknown }> = 1
    assertAnyC

    expect(anyC[$state].updateLink).toBe(sayTrue)
  })

  test('returns any with linked value (method)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true

    const anyA = any().keyLink(sayHello)
    const anyB = any().putLink(say42)
    const anyC = any().updateLink(sayTrue)

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyLink: unknown }> = 1
    assertAnyA

    expect(anyA[$state].keyLink).toBe(sayHello)

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putLink: unknown }> = 1
    assertAnyB

    expect(anyB[$state].putLink).toBe(say42)

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateLink: unknown }> = 1
    assertAnyC

    expect(anyC[$state].updateLink).toBe(sayTrue)
  })

  test('returns any with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const _any = any().link(sayHello)

    const assertAny: A.Contains<(typeof _any)[$state], { putLink: unknown }> = 1
    assertAny

    expect(_any[$state].putLink).toBe(sayHello)
  })

  test('returns any with KEY link value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const _any = any().key().link(sayHello)

    const assertAny: A.Contains<(typeof _any)[$state], { keyLink: unknown }> = 1
    assertAny

    expect(_any[$state].keyLink).toBe(sayHello)
  })

  test('returns any with validator (option)', () => {
    const pass = () => true
    const anyA = any({ keyValidator: pass })
    const anyB = any({ putValidator: pass })
    const anyC = any({ updateValidator: pass })

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyValidator: Validator }> = 1
    assertAnyA

    expect(anyA[$state].keyValidator).toBe(pass)

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putValidator: Validator }> = 1
    assertAnyB

    expect(anyB[$state].putValidator).toBe(pass)

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateValidator: Validator }> = 1
    assertAnyC

    expect(anyC[$state].updateValidator).toBe(pass)
  })

  test('returns any with validator (method)', () => {
    const pass = () => true

    const anyA = any().keyValidate(pass)
    const anyB = any().putValidate(pass)
    const anyC = any().updateValidate(pass)

    const assertAnyA: A.Contains<(typeof anyA)[$state], { keyValidator: Validator }> = 1
    assertAnyA

    expect(anyA[$state].keyValidator).toBe(pass)

    const assertAnyB: A.Contains<(typeof anyB)[$state], { putValidator: Validator }> = 1
    assertAnyB

    expect(anyB[$state].putValidator).toBe(pass)

    const assertAnyC: A.Contains<(typeof anyC)[$state], { updateValidator: Validator }> = 1
    assertAnyC

    expect(anyC[$state].updateValidator).toBe(pass)

    const prevAny = any().castAs<string>()
    prevAny.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string, FreezeAnyAttribute<typeof prevAny>]> = 1
      assertArgs

      return true
    })
  })

  test('returns any with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _any = any().validate(pass)

    expect(_any[$state].putValidator).toBe(pass)
  })

  test('returns any with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _any = any().key().validate(pass)

    const assertAny: A.Contains<(typeof _any)[$state], { keyValidator: Validator }> = 1
    assertAny

    expect(_any[$state].keyValidator).toBe(pass)
  })
})
