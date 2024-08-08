import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import { binary } from '../binary/index.js'
import { boolean } from '../boolean/index.js'
import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { nul } from '../nul/typer.js'
import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezePrimitiveAttribute } from './freeze.js'
import type { $PrimitiveAttribute, PrimitiveAttribute } from './interface.js'

describe('primitiveAttribute', () => {
  const path = 'some.path'

  describe('string', () => {
    test('returns default string', () => {
      const str = string()

      const assertType: A.Equals<(typeof str)[$type], 'string'> = 1
      assertType
      expect(str[$type]).toBe('string')

      const assertState: A.Equals<
        (typeof str)[$state],
        {
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: undefined
          enum: undefined
          transform: undefined
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
      expect(str[$state]).toStrictEqual({
        required: 'atLeastOnce',
        hidden: false,
        key: false,
        savedAs: undefined,
        enum: undefined,
        transform: undefined,
        defaults: { key: undefined, put: undefined, update: undefined },
        links: { key: undefined, put: undefined, update: undefined },
        validators: { key: undefined, put: undefined, update: undefined }
      })

      const assertExtends: A.Extends<typeof str, $PrimitiveAttribute> = 1
      assertExtends

      const frozenStr = str.freeze(path)
      const assertFrozenExtends: A.Extends<typeof frozenStr, PrimitiveAttribute> = 1
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

      const assertStr: A.Contains<(typeof str)[$state], { key: true; required: AtLeastOnce }> = 1
      assertStr

      expect(str[$state].key).toBe(true)
      expect(str[$state].required).toBe('atLeastOnce')
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
        defaults: { put: 42, update: undefined, key: undefined }
      })

      const invalidCall = () => invalidStr.freeze(path)

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
      )

      string({
        defaults: {
          key: undefined,
          put: undefined,
          // TOIMPROVE: add type constraints here
          update: () => 42
        }
      })

      const strA = string({ defaults: { key: 'hello', put: undefined, update: undefined } })
      const strB = string({ defaults: { key: undefined, put: 'world', update: undefined } })
      const sayHello = () => 'hello'
      const strC = string({ defaults: { key: undefined, put: undefined, update: sayHello } })

      const assertStrA: A.Contains<
        (typeof strA)[$state],
        { defaults: { key: string; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA[$state].defaults).toStrictEqual({
        key: 'hello',
        put: undefined,
        update: undefined
      })

      const assertStrB: A.Contains<
        (typeof strB)[$state],
        { defaults: { key: undefined; put: string; update: undefined } }
      > = 1
      assertStrB

      expect(strB[$state].defaults).toStrictEqual({
        key: undefined,
        put: 'world',
        update: undefined
      })

      const assertStrC: A.Contains<
        (typeof strC)[$state],
        { defaults: { key: undefined; put: undefined; update: () => string } }
      > = 1
      assertStrC

      expect(strC[$state].defaults).toStrictEqual({
        key: undefined,
        put: undefined,
        update: sayHello
      })
    })

    test('returns transformed string (option)', () => {
      const transformer = prefix('test')
      const str = string({ transform: transformer })

      const assertStr: A.Contains<(typeof str)[$state], { transform: unknown }> = 1
      assertStr

      expect(str[$state].transform).toBe(transformer)
    })

    test('returns transformed string (method)', () => {
      const transformer = prefix('test')
      const str = string().transform(transformer)

      const assertStr: A.Contains<(typeof str)[$state], { transform: unknown }> = 1
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

      const assertStrA: A.Contains<
        (typeof strA)[$state],
        { defaults: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA[$state].defaults).toStrictEqual({
        key: 'hello',
        put: undefined,
        update: undefined
      })

      const assertStrB: A.Contains<
        (typeof strB)[$state],
        { defaults: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStrB

      expect(strB[$state].defaults).toStrictEqual({
        key: undefined,
        put: 'world',
        update: undefined
      })

      const assertStrC: A.Contains<
        (typeof strC)[$state],
        { defaults: { key: undefined; put: undefined; update: unknown } }
      > = 1
      assertStrC

      expect(strC[$state].defaults).toStrictEqual({
        key: undefined,
        put: undefined,
        update: sayHello
      })
    })

    test('returns string with PUT default value if it is not key (default shorthand)', () => {
      const str = string().default('hello')

      const assertStr: A.Contains<
        (typeof str)[$state],
        { defaults: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStr

      expect(str[$state].defaults).toStrictEqual({
        key: undefined,
        put: 'hello',
        update: undefined
      })
    })

    test('returns string with KEY default value if it is key (default shorthand)', () => {
      const str = string().key().default('hello')

      const assertStr: A.Contains<
        (typeof str)[$state],
        { defaults: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStr

      expect(str[$state].defaults).toStrictEqual({
        key: 'hello',
        put: undefined,
        update: undefined
      })
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
        { defaults: { put: unknown }; enum: ['foo', 'bar'] }
      > = 1
      assertStrA

      expect(strA[$state].defaults).toMatchObject({ put: 'foo' })
      expect(strA[$state].enum).toStrictEqual(['foo', 'bar'])

      const assertStrB: A.Contains<
        (typeof strB)[$state],
        { defaults: { put: unknown }; enum: ['foo', 'bar'] }
      > = 1
      assertStrB

      expect(strB[$state].defaults).toMatchObject({ put: sayFoo })
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
        { enum: ['foo']; defaults: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertNonKeyStr

      expect(nonKeyStr[$state].enum).toStrictEqual(['foo'])
      expect(nonKeyStr[$state].defaults).toStrictEqual({
        key: undefined,
        put: 'foo',
        update: undefined
      })

      const keyStr = string().key().const('foo')

      const assertKeyStr: A.Contains<
        (typeof keyStr)[$state],
        { enum: ['foo']; defaults: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertKeyStr

      expect(keyStr[$state].enum).toStrictEqual(['foo'])
      expect(keyStr[$state].defaults).toStrictEqual({
        key: 'foo',
        put: undefined,
        update: undefined
      })
    })

    test('returns linked string (method)', () => {
      const sayHello = () => 'hello'
      const strA = string().keyLink(sayHello)
      const strB = string().putLink(sayHello)
      const strC = string().updateLink(sayHello)

      const assertStrA: A.Contains<
        (typeof strA)[$state],
        { links: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

      const assertStrB: A.Contains<
        (typeof strB)[$state],
        { links: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStrB

      expect(strB[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

      const assertStrC: A.Contains<
        (typeof strC)[$state],
        { links: { key: undefined; put: undefined; update: unknown } }
      > = 1
      assertStrC

      expect(strC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
    })

    test('returns string with PUT linked value if it is not key (link shorthand)', () => {
      const sayHello = () => 'hello'
      const str = string().link(sayHello)

      const assertStr: A.Contains<
        (typeof str)[$state],
        { links: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStr

      expect(str[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
    })

    test('returns string with KEY linked value if it is key (link shorthand)', () => {
      const sayHello = () => 'hello'
      const str = string().key().link(sayHello)

      const assertStr: A.Contains<
        (typeof str)[$state],
        { links: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStr

      expect(str[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
    })

    test('returns string with validator (option)', () => {
      // TOIMPROVE: Add type constraints here
      const pass = () => true
      const strA = string({ validators: { key: pass, put: undefined, update: undefined } })
      const strB = string({ validators: { key: undefined, put: pass, update: undefined } })
      const strC = string({ validators: { key: undefined, put: undefined, update: pass } })

      const assertStrA: A.Contains<
        (typeof strA)[$state],
        { validators: { key: Validator; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA[$state].validators).toStrictEqual({
        key: pass,
        put: undefined,
        update: undefined
      })

      const assertStrB: A.Contains<
        (typeof strB)[$state],
        { validators: { key: undefined; put: Validator; update: undefined } }
      > = 1
      assertStrB

      expect(strB[$state].validators).toStrictEqual({
        key: undefined,
        put: pass,
        update: undefined
      })

      const assertStrC: A.Contains<
        (typeof strC)[$state],
        { validators: { key: undefined; put: undefined; update: Validator } }
      > = 1
      assertStrC

      expect(strC[$state].validators).toStrictEqual({
        key: undefined,
        put: undefined,
        update: pass
      })
    })

    test('returns string with validator (method)', () => {
      const pass = () => true

      const strA = string().keyValidate(pass)
      const strB = string().putValidate(pass)
      const strC = string().updateValidate(pass)

      expect(strA[$state].validators).toStrictEqual({
        key: pass,
        put: undefined,
        update: undefined
      })

      expect(strB[$state].validators).toStrictEqual({
        key: undefined,
        put: pass,
        update: undefined
      })

      expect(strC[$state].validators).toStrictEqual({
        key: undefined,
        put: undefined,
        update: pass
      })

      const prevString = string()
      prevString.validate((...args) => {
        const assertArgs: A.Equals<
          typeof args,
          [string, FreezePrimitiveAttribute<typeof prevString>]
        > = 1
        assertArgs

        return true
      })

      const prevOptString = string().optional()
      prevOptString.validate((...args) => {
        const assertArgs: A.Equals<
          typeof args,
          [string | undefined, FreezePrimitiveAttribute<typeof prevOptString>]
        > = 1
        assertArgs

        return true
      })
    })

    test('returns string with PUT validator if it is not key (validate shorthand)', () => {
      const pass = () => true
      const str = string().validate(pass)

      expect(str[$state].validators).toStrictEqual({
        key: undefined,
        put: pass,
        update: undefined
      })
    })

    test('returns string with KEY validator if it is key (link shorthand)', () => {
      const pass = () => true
      const str = string().key().validate(pass)

      expect(str[$state].validators).toStrictEqual({
        key: pass,
        put: undefined,
        update: undefined
      })
    })
  })

  describe('null', () => {
    test('returns default null', () => {
      const nu = nul()

      const assertNu: A.Contains<typeof nu, { [$type]: 'null' }> = 1
      assertNu

      expect(nu[$type]).toBe('null')
    })
  })

  describe('number', () => {
    test('returns default number', () => {
      const num = number()

      const assertNum: A.Contains<typeof num, { [$type]: 'number' }> = 1
      assertNum

      expect(num[$type]).toBe('number')
    })
  })

  describe('boolean', () => {
    test('returns default boolean', () => {
      const bool = boolean()

      const assertBool: A.Contains<typeof bool, { [$type]: 'boolean' }> = 1
      assertBool

      expect(bool[$type]).toBe('boolean')
    })
  })

  describe('binary', () => {
    test('returns default binary', () => {
      const bin = binary()

      const assertBin: A.Contains<typeof bin, { [$type]: 'binary' }> = 1
      assertBin

      expect(bin[$type]).toBe('binary')
    })
  })
})
