import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeStringAttribute } from './freeze.js'
import type { $StringAttributeState, StringAttribute } from './interface.js'
import { string } from './typer.js'

const path = 'some.path'

describe('string', () => {
  test('returns default string', () => {
    const str = string()

    const assertType: A.Equals<(typeof str)[$type], 'string'> = 1
    assertType
    expect(str[$type]).toBe('string')

    const assertState: A.Equals<(typeof str)[$state], {}> = 1
    assertState
    expect(str[$state]).toStrictEqual({})

    const assertExtends: A.Extends<typeof str, $StringAttributeState> = 1
    assertExtends

    const frozenStr = str.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenStr, StringAttribute> = 1
    assertFrozenExtends
  })

  test('returns required string (option)', () => {
    const strAtLeastOnce = string({ required: 'atLeastOnce' })
    const strAlways = string({ required: 'always' })
    const strNever = string({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof strAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof strAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof strNever)[$state], { required: Never }> = 1
    assertNever

    expect(strAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(strAlways[$state].required).toBe('always')
    expect(strNever[$state].required).toBe('never')
  })

  test('returns required string (method)', () => {
    const strAtLeastOnce = string().required()
    const strAlways = string().required('always')
    const strNever = string().required('never')
    const strOpt = string().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof strAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof strAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof strNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof strOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(strAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(strAlways[$state].required).toBe('always')
    expect(strNever[$state].required).toBe('never')
    expect(strOpt[$state].required).toBe('never')
  })

  test('returns hidden string (option)', () => {
    const str = string({ hidden: true })

    const assertStr: A.Contains<(typeof str)[$state], { hidden: true }> = 1
    assertStr

    expect(str[$state].hidden).toBe(true)
  })

  test('returns hidden string (method)', () => {
    const str = string().hidden()

    const assertStr: A.Contains<(typeof str)[$state], { hidden: true }> = 1
    assertStr

    expect(str[$state].hidden).toBe(true)
  })

  test('returns key string (option)', () => {
    const str = string({ key: true })

    const assertStr: A.Contains<(typeof str)[$state], { key: true }> = 1
    assertStr

    expect(str[$state].key).toBe(true)
  })

  test('returns key string (method)', () => {
    const str = string().key()

    const assertStr: A.Contains<(typeof str)[$state], { key: true; required: Always }> = 1
    assertStr

    expect(str[$state].key).toBe(true)
    expect(str[$state].required).toBe('always')
  })

  test('returns savedAs string (option)', () => {
    const str = string({ savedAs: 'foo' })

    const assertStr: A.Contains<(typeof str)[$state], { savedAs: 'foo' }> = 1
    assertStr

    expect(str[$state].savedAs).toBe('foo')
  })

  test('returns savedAs string (method)', () => {
    const str = string().savedAs('foo')

    const assertStr: A.Contains<(typeof str)[$state], { savedAs: 'foo' }> = 1
    assertStr

    expect(str[$state].savedAs).toBe('foo')
  })

  test('returns string with enum values (method)', () => {
    const invalidStr = string().enum(
      // @ts-expect-error
      42,
      'foo',
      'bar'
    )

    const invalidCall = () => invalidStr.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const str = string().enum('foo', 'bar')

    const assertStr: A.Contains<(typeof str)[$state], { enum: ['foo', 'bar'] }> = 1
    assertStr

    expect(str[$state].enum).toStrictEqual(['foo', 'bar'])
  })

  test('returns defaulted string (option)', () => {
    const invalidStr = string({
      // TOIMPROVE: add type constraints here
      putDefault: 42
    })

    const invalidCall = () => invalidStr.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
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

    const assertStrA: A.Contains<(typeof strA)[$state], { keyDefault: string }> = 1
    assertStrA

    expect(strA[$state].keyDefault).toBe('hello')

    const assertStrB: A.Contains<(typeof strB)[$state], { putDefault: string }> = 1
    assertStrB

    expect(strB[$state].putDefault).toBe('world')

    const assertStrC: A.Contains<(typeof strC)[$state], { updateDefault: () => string }> = 1
    assertStrC

    expect(strC[$state].updateDefault).toBe(sayHello)
  })

  test('returns transformed string (option)', () => {
    const transformer = prefix('test')
    const str = string({ transform: transformer })

    const assertStr: A.Contains<(typeof str)[$state], { transform: typeof transformer }> = 1
    assertStr

    expect(str[$state].transform).toBe(transformer)
  })

  test('returns transformed string (method)', () => {
    const transformer = prefix('test')
    const str = string().transform(transformer)

    const assertStr: A.Contains<(typeof str)[$state], { transform: typeof transformer }> = 1
    assertStr

    expect(str[$state].transform).toBe(transformer)
  })

  test('returns defaulted string (method)', () => {
    const invalidStr = string()
      // @ts-expect-error
      .putDefault(42)

    const invalidCall = () => invalidStr.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    string()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 42)

    const strA = string().keyDefault('hello')
    const strB = string().putDefault('world')
    const sayHello = () => 'hello'
    const strC = string().updateDefault(sayHello)

    const assertStrA: A.Contains<(typeof strA)[$state], { keyDefault: unknown }> = 1
    assertStrA

    expect(strA[$state].keyDefault).toBe('hello')

    const assertStrB: A.Contains<(typeof strB)[$state], { putDefault: unknown }> = 1
    assertStrB

    expect(strB[$state].putDefault).toBe('world')

    const assertStrC: A.Contains<(typeof strC)[$state], { updateDefault: unknown }> = 1
    assertStrC

    expect(strC[$state].updateDefault).toBe(sayHello)
  })

  test('returns string with PUT default value if it is not key (default shorthand)', () => {
    const str = string().default('hello')

    const assertStr: A.Contains<(typeof str)[$state], { putDefault: unknown }> = 1
    assertStr

    expect(str[$state].putDefault).toBe('hello')
  })

  test('returns string with KEY default value if it is key (default shorthand)', () => {
    const str = string().key().default('hello')

    const assertStr: A.Contains<(typeof str)[$state], { keyDefault: unknown }> = 1
    assertStr

    expect(str[$state].keyDefault).toBe('hello')
  })

  test('default with enum values', () => {
    const invalidStr = string().enum('foo', 'bar').default(
      // @ts-expect-error
      'baz'
    )

    const invalidCall = () => invalidStr.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const strA = string().enum('foo', 'bar').default('foo')
    const sayFoo = (): 'foo' => 'foo'
    const strB = string().enum('foo', 'bar').default(sayFoo)

    const assertStrA: A.Contains<
      (typeof strA)[$state],
      { putDefault: unknown; enum: ['foo', 'bar'] }
    > = 1
    assertStrA

    expect(strA[$state].putDefault).toBe('foo')
    expect(strA[$state].enum).toStrictEqual(['foo', 'bar'])

    const assertStrB: A.Contains<
      (typeof strB)[$state],
      { putDefault: unknown; enum: ['foo', 'bar'] }
    > = 1
    assertStrB

    expect(strB[$state].putDefault).toBe(sayFoo)
    expect(strB[$state].enum).toStrictEqual(['foo', 'bar'])
  })

  test('returns string with constant value (method)', () => {
    const invalidStr = string().const(
      // @ts-expect-error
      42
    )

    const invalidCall = () => invalidStr.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyStr = string().const('foo')

    const assertNonKeyStr: A.Contains<
      (typeof nonKeyStr)[$state],
      { enum: ['foo']; putDefault: unknown }
    > = 1
    assertNonKeyStr

    expect(nonKeyStr[$state].enum).toStrictEqual(['foo'])
    expect(nonKeyStr[$state].putDefault).toBe('foo')

    const keyStr = string().key().const('foo')

    const assertKeyStr: A.Contains<
      (typeof keyStr)[$state],
      { enum: ['foo']; keyDefault: unknown }
    > = 1
    assertKeyStr

    expect(keyStr[$state].enum).toStrictEqual(['foo'])
    expect(keyStr[$state].keyDefault).toBe('foo')
  })

  test('returns linked string (method)', () => {
    const sayHello = () => 'hello'
    const strA = string().keyLink(sayHello)
    const strB = string().putLink(sayHello)
    const strC = string().updateLink(sayHello)

    const assertStrA: A.Contains<(typeof strA)[$state], { keyLink: unknown }> = 1
    assertStrA

    expect(strA[$state].keyLink).toBe(sayHello)

    const assertStrB: A.Contains<(typeof strB)[$state], { putLink: unknown }> = 1
    assertStrB

    expect(strB[$state].putLink).toBe(sayHello)

    const assertStrC: A.Contains<(typeof strC)[$state], { updateLink: unknown }> = 1
    assertStrC

    expect(strC[$state].updateLink).toBe(sayHello)
  })

  test('returns string with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = string().link(sayHello)

    const assertStr: A.Contains<(typeof str)[$state], { putLink: unknown }> = 1
    assertStr

    expect(str[$state].putLink).toBe(sayHello)
  })

  test('returns string with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = string().key().link(sayHello)

    const assertStr: A.Contains<(typeof str)[$state], { keyLink: unknown }> = 1
    assertStr

    expect(str[$state].keyLink).toBe(sayHello)
  })

  test('returns string with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const strA = string({ keyValidator: pass })
    const strB = string({ putValidator: pass })
    const strC = string({ updateValidator: pass })

    const assertStrA: A.Contains<(typeof strA)[$state], { keyValidator: Validator }> = 1
    assertStrA

    expect(strA[$state].keyValidator).toBe(pass)

    const assertStrB: A.Contains<(typeof strB)[$state], { putValidator: Validator }> = 1
    assertStrB

    expect(strB[$state].putValidator).toBe(pass)

    const assertStrC: A.Contains<(typeof strC)[$state], { updateValidator: Validator }> = 1
    assertStrC

    expect(strC[$state].updateValidator).toBe(pass)
  })

  test('returns string with validator (method)', () => {
    const pass = () => true

    const strA = string().keyValidate(pass)
    const strB = string().putValidate(pass)
    const strC = string().updateValidate(pass)

    const assertStrA: A.Contains<(typeof strA)[$state], { keyValidator: Validator }> = 1
    assertStrA

    expect(strA[$state].keyValidator).toBe(pass)

    const assertStrB: A.Contains<(typeof strB)[$state], { putValidator: Validator }> = 1
    assertStrB

    expect(strB[$state].putValidator).toBe(pass)

    const assertStrC: A.Contains<(typeof strC)[$state], { updateValidator: Validator }> = 1
    assertStrC

    expect(strC[$state].updateValidator).toBe(pass)

    const prevString = string()
    prevString.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string, FreezeStringAttribute<typeof prevString>]> =
        1
      assertArgs

      return true
    })

    const prevOptString = string().optional()
    prevOptString.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [string, FreezeStringAttribute<typeof prevOptString>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns string with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const str = string().validate(pass)

    const assertStr: A.Contains<(typeof str)[$state], { putValidator: Validator }> = 1
    assertStr

    expect(str[$state].putValidator).toBe(pass)
  })

  test('returns string with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const str = string().key().validate(pass)

    const assertStr: A.Contains<(typeof str)[$state], { keyValidator: Validator }> = 1
    assertStr

    expect(str[$state].keyValidator).toBe(pass)
  })
})
