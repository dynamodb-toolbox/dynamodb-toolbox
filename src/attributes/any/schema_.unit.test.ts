import type { A } from 'ts-toolbelt'

import { jsonStringify } from '~/transformers/jsonStringify.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { AnySchema } from './schema.js'
import { any } from './schema_.js'

describe('any', () => {
  test('returns default any', () => {
    const anyInstance = any()

    const assertType: A.Equals<(typeof anyInstance)['type'], 'any'> = 1
    assertType
    expect(anyInstance.type).toBe('any')

    const assertProps: A.Equals<(typeof anyInstance)['props'], {}> = 1
    assertProps
    expect(anyInstance.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof anyInstance, AnySchema> = 1
    assertExtends
  })

  test('returns required any (option)', () => {
    const anyAtLeastOnce = any({ required: 'atLeastOnce' })
    const anyAlways = any({ required: 'always' })
    const anyNever = any({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof anyAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyNever)['props'], { required: Never }> = 1
    assertNever

    expect(anyAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(anyAlways.props.required).toBe('always')
    expect(anyNever.props.required).toBe('never')
  })

  test('returns required any (method)', () => {
    const anyAtLeastOnce = any().required()
    const anyAlways = any().required('always')
    const anyNever = any().required('never')
    const anyOpt = any().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof anyAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof anyOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(anyAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(anyAlways.props.required).toBe('always')
    expect(anyNever.props.required).toBe('never')
    expect(anyOpt.props.required).toBe('never')
  })

  test('returns hidden any (option)', () => {
    const anyInstance = any({ hidden: true })

    const assertAny: A.Contains<(typeof anyInstance)['props'], { hidden: true }> = 1
    assertAny

    expect(anyInstance.props.hidden).toBe(true)
  })

  test('returns hidden any (method)', () => {
    const anyInstance = any().hidden()

    const assertAny: A.Contains<(typeof anyInstance)['props'], { hidden: true }> = 1
    assertAny

    expect(anyInstance.props.hidden).toBe(true)
  })

  test('returns key any (option)', () => {
    const anyInstance = any({ key: true })

    const assertAny: A.Contains<(typeof anyInstance)['props'], { key: true }> = 1
    assertAny

    expect(anyInstance.props.key).toBe(true)
  })

  test('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<(typeof anyInstance)['props'], { key: true; required: Always }> = 1
    assertAny

    expect(anyInstance.props.key).toBe(true)
    expect(anyInstance.props.required).toBe('always')
  })

  test('returns savedAs any (option)', () => {
    const anyInstance = any({ savedAs: 'foo' })

    const assertAny: A.Contains<(typeof anyInstance)['props'], { savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance.props.savedAs).toBe('foo')
  })

  test('returns savedAs any (method)', () => {
    const anyInstance = any().savedAs('foo')

    const assertAny: A.Contains<(typeof anyInstance)['props'], { savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance.props.savedAs).toBe('foo')
  })

  test('returns castAs any (method)', () => {
    const anyInstance = any().castAs<'foo' | 'bar'>()

    const assertAny: A.Contains<(typeof anyInstance)['props'], { castAs: 'foo' | 'bar' }> = 1
    assertAny

    // Keeps cast type at type level only
    expect(anyInstance.props.castAs).toBeUndefined()
  })

  test('returns transformed any (option)', () => {
    const transformer = jsonStringify()
    const anyInstance = any({ transform: transformer })

    const assertAny: A.Contains<(typeof anyInstance)['props'], { transform: typeof transformer }> =
      1
    assertAny

    expect(anyInstance.props.transform).toBe(transformer)
  })

  test('returns transformed any (method)', () => {
    const transformer = jsonStringify()
    const anyInstance = any().transform(transformer)

    const assertAny: A.Contains<(typeof anyInstance)['props'], { transform: typeof transformer }> =
      1
    assertAny

    expect(anyInstance.props.transform).toBe(transformer)
  })

  test('returns any with default value (option)', () => {
    const anyA = any({ keyDefault: 'hello' })
    const anyB = any({ putDefault: 'world' })
    const sayHello = () => 'hello'
    const anyC = any({ updateDefault: sayHello })

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyDefault: unknown }> = 1
    assertAnyA

    expect(anyA.props.keyDefault).toBe('hello')

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putDefault: unknown }> = 1
    assertAnyB

    expect(anyB.props.putDefault).toBe('world')

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateDefault: unknown }> = 1
    assertAnyC

    expect(anyC.props.updateDefault).toBe(sayHello)
  })

  test('returns any with default value (method)', () => {
    const anyA = any().keyDefault('hello')
    const anyB = any().putDefault('world')
    const sayHello = () => 'hello'
    const anyC = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyDefault: unknown }> = 1
    assertAnyA

    expect(anyA.props.keyDefault).toBe('hello')

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putDefault: unknown }> = 1
    assertAnyB

    expect(anyB.props.putDefault).toBe('world')

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateDefault: unknown }> = 1
    assertAnyC

    expect(anyC.props.updateDefault).toBe(sayHello)
  })

  test('returns any with PUT default value if it is not key (default shorthand)', () => {
    const _any = any().default('hello')

    const assertAny: A.Contains<(typeof _any)['props'], { putDefault: unknown }> = 1
    assertAny

    expect(_any.props.putDefault).toBe('hello')
  })

  test('returns any with KEY default value if it is key (default shorthand)', () => {
    const _any = any().key().default('hello')

    const assertAny: A.Contains<(typeof _any)['props'], { keyDefault: unknown }> = 1
    assertAny

    expect(_any.props.keyDefault).toBe('hello')
  })

  test('returns any with linked value (option)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true
    const anyA = any({ keyLink: sayHello })
    const anyB = any({ putLink: say42 })
    const anyC = any({ updateLink: sayTrue })

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyLink: unknown }> = 1
    assertAnyA

    expect(anyA.props.keyLink).toBe(sayHello)

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putLink: unknown }> = 1
    assertAnyB

    expect(anyB.props.putLink).toBe(say42)

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateLink: unknown }> = 1
    assertAnyC

    expect(anyC.props.updateLink).toBe(sayTrue)
  })

  test('returns any with linked value (method)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true

    const anyA = any().keyLink(sayHello)
    const anyB = any().putLink(say42)
    const anyC = any().updateLink(sayTrue)

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyLink: unknown }> = 1
    assertAnyA

    expect(anyA.props.keyLink).toBe(sayHello)

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putLink: unknown }> = 1
    assertAnyB

    expect(anyB.props.putLink).toBe(say42)

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateLink: unknown }> = 1
    assertAnyC

    expect(anyC.props.updateLink).toBe(sayTrue)
  })

  test('returns any with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const _any = any().link(sayHello)

    const assertAny: A.Contains<(typeof _any)['props'], { putLink: unknown }> = 1
    assertAny

    expect(_any.props.putLink).toBe(sayHello)
  })

  test('returns any with KEY link value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const _any = any().key().link(sayHello)

    const assertAny: A.Contains<(typeof _any)['props'], { keyLink: unknown }> = 1
    assertAny

    expect(_any.props.keyLink).toBe(sayHello)
  })

  test('returns any with validator (option)', () => {
    const pass = () => true
    const anyA = any({ keyValidator: pass })
    const anyB = any({ putValidator: pass })
    const anyC = any({ updateValidator: pass })

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyValidator: Validator }> = 1
    assertAnyA

    expect(anyA.props.keyValidator).toBe(pass)

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putValidator: Validator }> = 1
    assertAnyB

    expect(anyB.props.putValidator).toBe(pass)

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateValidator: Validator }> = 1
    assertAnyC

    expect(anyC.props.updateValidator).toBe(pass)
  })

  test('returns any with validator (method)', () => {
    const pass = () => true

    const anyA = any().keyValidate(pass)
    const anyB = any().putValidate(pass)
    const anyC = any().updateValidate(pass)

    const assertAnyA: A.Contains<(typeof anyA)['props'], { keyValidator: Validator }> = 1
    assertAnyA

    expect(anyA.props.keyValidator).toBe(pass)

    const assertAnyB: A.Contains<(typeof anyB)['props'], { putValidator: Validator }> = 1
    assertAnyB

    expect(anyB.props.putValidator).toBe(pass)

    const assertAnyC: A.Contains<(typeof anyC)['props'], { updateValidator: Validator }> = 1
    assertAnyC

    expect(anyC.props.updateValidator).toBe(pass)

    const prevAny = any().castAs<string>()
    prevAny.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string, typeof prevAny]> = 1
      assertArgs

      return true
    })
  })

  test('returns any with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _any = any().validate(pass)

    expect(_any.props.putValidator).toBe(pass)
  })

  test('returns any with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _any = any().key().validate(pass)

    const assertAny: A.Contains<(typeof _any)['props'], { keyValidator: Validator }> = 1
    assertAny

    expect(_any.props.keyValidator).toBe(pass)
  })
})
