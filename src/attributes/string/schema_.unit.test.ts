import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { StringSchema } from './schema.js'
import { string } from './schema_.js'

const path = 'some.path'

describe('string', () => {
  test('returns default string', () => {
    const str = string()

    const assertType: A.Equals<(typeof str)['type'], 'string'> = 1
    assertType
    expect(str.type).toBe('string')

    const assertProps: A.Equals<(typeof str)['props'], {}> = 1
    assertProps
    expect(str.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof str, StringSchema> = 1
    assertExtends
  })

  test('returns required string (option)', () => {
    const strAtLeastOnce = string({ required: 'atLeastOnce' })
    const strAlways = string({ required: 'always' })
    const strNever = string({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof strAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof strAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof strNever)['props'], { required: Never }> = 1
    assertNever

    expect(strAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(strAlways.props.required).toBe('always')
    expect(strNever.props.required).toBe('never')
  })

  test('returns required string (method)', () => {
    const strAtLeastOnce = string().required()
    const strAlways = string().required('always')
    const strNever = string().required('never')
    const strOpt = string().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof strAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof strAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof strNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof strOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(strAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(strAlways.props.required).toBe('always')
    expect(strNever.props.required).toBe('never')
    expect(strOpt.props.required).toBe('never')
  })

  test('returns hidden string (option)', () => {
    const str = string({ hidden: true })

    const assertStr: A.Contains<(typeof str)['props'], { hidden: true }> = 1
    assertStr

    expect(str.props.hidden).toBe(true)
  })

  test('returns hidden string (method)', () => {
    const str = string().hidden()

    const assertStr: A.Contains<(typeof str)['props'], { hidden: true }> = 1
    assertStr

    expect(str.props.hidden).toBe(true)
  })

  test('returns key string (option)', () => {
    const str = string({ key: true })

    const assertStr: A.Contains<(typeof str)['props'], { key: true }> = 1
    assertStr

    expect(str.props.key).toBe(true)
  })

  test('returns key string (method)', () => {
    const str = string().key()

    const assertStr: A.Contains<(typeof str)['props'], { key: true; required: Always }> = 1
    assertStr

    expect(str.props.key).toBe(true)
    expect(str.props.required).toBe('always')
  })

  test('returns savedAs string (option)', () => {
    const str = string({ savedAs: 'foo' })

    const assertStr: A.Contains<(typeof str)['props'], { savedAs: 'foo' }> = 1
    assertStr

    expect(str.props.savedAs).toBe('foo')
  })

  test('returns savedAs string (method)', () => {
    const str = string().savedAs('foo')

    const assertStr: A.Contains<(typeof str)['props'], { savedAs: 'foo' }> = 1
    assertStr

    expect(str.props.savedAs).toBe('foo')
  })

  test('returns string with enum values (method)', () => {
    const invalidStr = string().enum(
      // @ts-expect-error
      42,
      'foo',
      'bar'
    )

    const superInvalidCall = () => invalidStr.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const str = string().enum('foo', 'bar')

    const assertStr: A.Contains<(typeof str)['props'], { enum: ['foo', 'bar'] }> = 1
    assertStr

    expect(str.props.enum).toStrictEqual(['foo', 'bar'])
  })

  test('returns defaulted string (option)', () => {
    const invalidStr = string({
      // TOIMPROVE: add type constraints here
      putDefault: 42
    })

    const superInvalidCall = () => invalidStr.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    string({
      // TOIMPROVE: add type constraints here
      updateDefault: () => 42
    })

    const strA = string({ keyDefault: 'hello' })
    const strB = string({ putDefault: 'world' })
    const sayHello = () => 'hello'
    const strC = string({ updateDefault: sayHello })

    const assertStrA: A.Contains<(typeof strA)['props'], { keyDefault: string }> = 1
    assertStrA

    expect(strA.props.keyDefault).toBe('hello')

    const assertStrB: A.Contains<(typeof strB)['props'], { putDefault: string }> = 1
    assertStrB

    expect(strB.props.putDefault).toBe('world')

    const assertStrC: A.Contains<(typeof strC)['props'], { updateDefault: () => string }> = 1
    assertStrC

    expect(strC.props.updateDefault).toBe(sayHello)
  })

  test('returns transformed string (option)', () => {
    const transformer = prefix('test')
    const str = string({ transform: transformer })

    const assertStr: A.Contains<(typeof str)['props'], { transform: typeof transformer }> = 1
    assertStr

    expect(str.props.transform).toBe(transformer)
  })

  test('returns transformed string (method)', () => {
    const transformer = prefix('test')
    const str = string().transform(transformer)

    const assertStr: A.Contains<(typeof str)['props'], { transform: typeof transformer }> = 1
    assertStr

    expect(str.props.transform).toBe(transformer)
  })

  test('returns defaulted string (method)', () => {
    const invalidStr = string()
      // @ts-expect-error
      .putDefault(42)

    const superInvalidCall = () => invalidStr.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    string()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 42)

    const strA = string().keyDefault('hello')
    const strB = string().putDefault('world')
    const sayHello = () => 'hello'
    const strC = string().updateDefault(sayHello)

    const assertStrA: A.Contains<(typeof strA)['props'], { keyDefault: unknown }> = 1
    assertStrA

    expect(strA.props.keyDefault).toBe('hello')

    const assertStrB: A.Contains<(typeof strB)['props'], { putDefault: unknown }> = 1
    assertStrB

    expect(strB.props.putDefault).toBe('world')

    const assertStrC: A.Contains<(typeof strC)['props'], { updateDefault: unknown }> = 1
    assertStrC

    expect(strC.props.updateDefault).toBe(sayHello)
  })

  test('returns string with PUT default value if it is not key (default shorthand)', () => {
    const str = string().default('hello')

    const assertStr: A.Contains<(typeof str)['props'], { putDefault: unknown }> = 1
    assertStr

    expect(str.props.putDefault).toBe('hello')
  })

  test('returns string with KEY default value if it is key (default shorthand)', () => {
    const str = string().key().default('hello')

    const assertStr: A.Contains<(typeof str)['props'], { keyDefault: unknown }> = 1
    assertStr

    expect(str.props.keyDefault).toBe('hello')
  })

  test('default with enum values', () => {
    const invalidStr = string().enum('foo', 'bar').default(
      // @ts-expect-error
      'baz'
    )

    const superInvalidCall = () => invalidStr.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const strA = string().enum('foo', 'bar').default('foo')
    const sayFoo = (): 'foo' => 'foo'
    const strB = string().enum('foo', 'bar').default(sayFoo)

    const assertStrA: A.Contains<
      (typeof strA)['props'],
      { putDefault: unknown; enum: ['foo', 'bar'] }
    > = 1
    assertStrA

    expect(strA.props.putDefault).toBe('foo')
    expect(strA.props.enum).toStrictEqual(['foo', 'bar'])

    const assertStrB: A.Contains<
      (typeof strB)['props'],
      { putDefault: unknown; enum: ['foo', 'bar'] }
    > = 1
    assertStrB

    expect(strB.props.putDefault).toBe(sayFoo)
    expect(strB.props.enum).toStrictEqual(['foo', 'bar'])
  })

  test('returns string with constant value (method)', () => {
    const invalidStr = string().const(
      // @ts-expect-error
      42
    )

    const superInvalidCall = () => invalidStr.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyStr = string().const('foo')

    const assertNonKeyStr: A.Contains<
      (typeof nonKeyStr)['props'],
      { enum: ['foo']; putDefault: unknown }
    > = 1
    assertNonKeyStr

    expect(nonKeyStr.props.enum).toStrictEqual(['foo'])
    expect(nonKeyStr.props.putDefault).toBe('foo')

    const keyStr = string().key().const('foo')

    const assertKeyStr: A.Contains<
      (typeof keyStr)['props'],
      { enum: ['foo']; keyDefault: unknown }
    > = 1
    assertKeyStr

    expect(keyStr.props.enum).toStrictEqual(['foo'])
    expect(keyStr.props.keyDefault).toBe('foo')
  })

  test('returns linked string (method)', () => {
    const sayHello = () => 'hello'
    const strA = string().keyLink(sayHello)
    const strB = string().putLink(sayHello)
    const strC = string().updateLink(sayHello)

    const assertStrA: A.Contains<(typeof strA)['props'], { keyLink: unknown }> = 1
    assertStrA

    expect(strA.props.keyLink).toBe(sayHello)

    const assertStrB: A.Contains<(typeof strB)['props'], { putLink: unknown }> = 1
    assertStrB

    expect(strB.props.putLink).toBe(sayHello)

    const assertStrC: A.Contains<(typeof strC)['props'], { updateLink: unknown }> = 1
    assertStrC

    expect(strC.props.updateLink).toBe(sayHello)
  })

  test('returns string with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = string().link(sayHello)

    const assertStr: A.Contains<(typeof str)['props'], { putLink: unknown }> = 1
    assertStr

    expect(str.props.putLink).toBe(sayHello)
  })

  test('returns string with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = string().key().link(sayHello)

    const assertStr: A.Contains<(typeof str)['props'], { keyLink: unknown }> = 1
    assertStr

    expect(str.props.keyLink).toBe(sayHello)
  })

  test('returns string with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const strA = string({ keyValidator: pass })
    const strB = string({ putValidator: pass })
    const strC = string({ updateValidator: pass })

    const assertStrA: A.Contains<(typeof strA)['props'], { keyValidator: Validator }> = 1
    assertStrA

    expect(strA.props.keyValidator).toBe(pass)

    const assertStrB: A.Contains<(typeof strB)['props'], { putValidator: Validator }> = 1
    assertStrB

    expect(strB.props.putValidator).toBe(pass)

    const assertStrC: A.Contains<(typeof strC)['props'], { updateValidator: Validator }> = 1
    assertStrC

    expect(strC.props.updateValidator).toBe(pass)
  })

  test('returns string with validator (method)', () => {
    const pass = () => true

    const strA = string().keyValidate(pass)
    const strB = string().putValidate(pass)
    const strC = string().updateValidate(pass)

    const assertStrA: A.Contains<(typeof strA)['props'], { keyValidator: Validator }> = 1
    assertStrA

    expect(strA.props.keyValidator).toBe(pass)

    const assertStrB: A.Contains<(typeof strB)['props'], { putValidator: Validator }> = 1
    assertStrB

    expect(strB.props.putValidator).toBe(pass)

    const assertStrC: A.Contains<(typeof strC)['props'], { updateValidator: Validator }> = 1
    assertStrC

    expect(strC.props.updateValidator).toBe(pass)

    const prevString = string()
    prevString.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string, typeof prevString]> = 1
      assertArgs

      return true
    })

    const prevOptString = string().optional()
    prevOptString.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string, typeof prevOptString]> = 1
      assertArgs

      return true
    })
  })

  test('returns string with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const str = string().validate(pass)

    const assertStr: A.Contains<(typeof str)['props'], { putValidator: Validator }> = 1
    assertStr

    expect(str.props.putValidator).toBe(pass)
  })

  test('returns string with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const str = string().key().validate(pass)

    const assertStr: A.Contains<(typeof str)['props'], { keyValidator: Validator }> = 1
    assertStr

    expect(str.props.keyValidator).toBe(pass)
  })
})
