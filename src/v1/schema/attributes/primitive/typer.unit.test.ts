import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { Never, AtLeastOnce, Always } from '../constants'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $defaults
} from '../constants/attributeOptions'

import { string, number, boolean, binary } from './typer'
import { freezePrimitiveAttribute } from './freeze'
import type { PrimitiveAttribute, $PrimitiveAttribute } from './interface'

describe('primitiveAttribute', () => {
  const path = 'some.path'

  describe('string', () => {
    it('returns default string', () => {
      const str = string()

      const assertStr: A.Contains<
        typeof str,
        {
          [$type]: 'string'
          [$required]: AtLeastOnce
          [$hidden]: false
          [$savedAs]: undefined
          [$key]: false
          [$enum]: undefined
          [$defaults]: {
            key: undefined
            put: undefined
            update: undefined
          }
        }
      > = 1
      assertStr

      const assertExtends: A.Extends<typeof str, $PrimitiveAttribute> = 1
      assertExtends

      const frozenStr = freezePrimitiveAttribute(str, path)
      const assertFrozenExtends: A.Extends<typeof frozenStr, PrimitiveAttribute> = 1
      assertFrozenExtends

      expect(str).toMatchObject({
        [$type]: 'string',
        [$required]: 'atLeastOnce',
        [$hidden]: false,
        [$savedAs]: undefined,
        [$key]: false,
        [$enum]: undefined,
        [$defaults]: {
          key: undefined,
          put: undefined,
          update: undefined
        }
      })
    })

    it('returns required string (option)', () => {
      const strAtLeastOnce = string({ required: 'atLeastOnce' })
      const strAlways = string({ required: 'always' })
      const strNever = string({ required: 'never' })

      const assertAtLeastOnce: A.Contains<typeof strAtLeastOnce, { [$required]: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertAlways: A.Contains<typeof strAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof strNever, { [$required]: Never }> = 1
      assertNever

      expect(strAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(strAlways).toMatchObject({ [$required]: 'always' })
      expect(strNever).toMatchObject({ [$required]: 'never' })
    })

    it('returns required string (method)', () => {
      const strAtLeastOnce = string().required()
      const strAlways = string().required('always')
      const strNever = string().required('never')
      const strOpt = string().optional()

      const assertAtLeastOnce: A.Contains<typeof strAtLeastOnce, { [$required]: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertAlways: A.Contains<typeof strAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof strNever, { [$required]: Never }> = 1
      assertNever
      const assertOpt: A.Contains<typeof strOpt, { [$required]: Never }> = 1
      assertOpt

      expect(strAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(strAlways).toMatchObject({ [$required]: 'always' })
      expect(strNever).toMatchObject({ [$required]: 'never' })
      expect(strOpt).toMatchObject({ [$required]: 'never' })
    })

    it('returns hidden string (option)', () => {
      const str = string({ hidden: true })

      const assertStr: A.Contains<typeof str, { [$hidden]: true }> = 1
      assertStr

      expect(str).toMatchObject({ [$hidden]: true })
    })

    it('returns hidden string (method)', () => {
      const str = string().hidden()

      const assertStr: A.Contains<typeof str, { [$hidden]: true }> = 1
      assertStr

      expect(str).toMatchObject({ [$hidden]: true })
    })

    it('returns key string (option)', () => {
      const str = string({ key: true })

      const assertStr: A.Contains<typeof str, { [$key]: true; [$required]: AtLeastOnce }> = 1
      assertStr

      expect(str).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
    })

    it('returns key string (method)', () => {
      const str = string().key()

      const assertStr: A.Contains<typeof str, { [$key]: true; [$required]: Always }> = 1
      assertStr

      expect(str).toMatchObject({ [$key]: true, [$required]: 'always' })
    })

    it('returns savedAs string (option)', () => {
      const str = string({ savedAs: 'foo' })

      const assertStr: A.Contains<typeof str, { [$savedAs]: 'foo' }> = 1
      assertStr

      expect(str).toMatchObject({ [$savedAs]: 'foo' })
    })

    it('returns savedAs string (method)', () => {
      const str = string().savedAs('foo')

      const assertStr: A.Contains<typeof str, { [$savedAs]: 'foo' }> = 1
      assertStr

      expect(str).toMatchObject({ [$savedAs]: 'foo' })
    })

    it('returns string with enum values (method)', () => {
      string().enum(
        // @ts-expect-error
        42,
        'foo',
        'bar'
      )

      const invalidCall = () =>
        freezePrimitiveAttribute(
          string().enum(
            // @ts-expect-error
            42,
            'foo',
            'bar'
          ),
          path
        )

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
      )

      const str = string().enum('foo', 'bar')

      const assertStr: A.Contains<typeof str, { [$enum]: ['foo', 'bar'] }> = 1
      assertStr

      expect(str).toMatchObject({ [$enum]: ['foo', 'bar'] })
    })

    it('returns defaulted string (option)', () => {
      const invalidStr = string({
        // TOIMPROVE: add type constraints here
        defaults: { put: 42, update: undefined, key: undefined }
      })

      const invalidCall = () => freezePrimitiveAttribute(invalidStr, path)

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
        typeof strA,
        { [$defaults]: { key: string; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA).toMatchObject({
        [$defaults]: { key: 'hello', put: undefined, update: undefined }
      })

      const assertStrB: A.Contains<
        typeof strB,
        { [$defaults]: { key: undefined; put: string; update: undefined } }
      > = 1
      assertStrB

      expect(strB).toMatchObject({
        [$defaults]: { key: undefined, put: 'world', update: undefined }
      })

      const assertStrC: A.Contains<
        typeof strC,
        { [$defaults]: { key: undefined; put: undefined; update: () => string } }
      > = 1
      assertStrC

      expect(strC).toMatchObject({
        [$defaults]: { key: undefined, put: undefined, update: sayHello }
      })
    })

    it('returns defaulted string (method)', () => {
      const invalidStr = string()
        // @ts-expect-error
        .putDefault(42)

      const invalidCall = () => freezePrimitiveAttribute(invalidStr, path)

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
        typeof strA,
        { [$defaults]: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStrA

      expect(strA).toMatchObject({
        [$defaults]: { key: 'hello', put: undefined, update: undefined }
      })

      const assertStrB: A.Contains<
        typeof strB,
        { [$defaults]: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStrB

      expect(strB).toMatchObject({
        [$defaults]: { key: undefined, put: 'world', update: undefined }
      })

      const assertStrC: A.Contains<
        typeof strC,
        { [$defaults]: { key: undefined; put: undefined; update: unknown } }
      > = 1
      assertStrC

      expect(strC).toMatchObject({
        [$defaults]: { key: undefined, put: undefined, update: sayHello }
      })
    })

    it('returns string with constant value (method)', () => {
      const invalidStr = string().const(
        // @ts-expect-error
        42
      )

      const invalidCall = () => freezePrimitiveAttribute(invalidStr, path)

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
      )

      const nonKeyStr = string().const('foo')

      const assertNonKeyStr: A.Contains<
        typeof nonKeyStr,
        { [$enum]: ['foo']; [$defaults]: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertNonKeyStr

      expect(nonKeyStr).toMatchObject({
        [$enum]: ['foo'],
        [$defaults]: { key: undefined, put: 'foo', update: undefined }
      })

      const keyStr = string().key().const('foo')

      const assertKeyStr: A.Contains<
        typeof keyStr,
        { [$enum]: ['foo']; [$defaults]: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertKeyStr

      expect(keyStr).toMatchObject({
        [$enum]: ['foo'],
        [$defaults]: { key: 'foo', put: undefined, update: undefined }
      })
    })

    it('returns string with PUT default value if it is not key (default shorthand)', () => {
      const str = string().default('hello')

      const assertStr: A.Contains<
        typeof str,
        { [$defaults]: { key: undefined; put: unknown; update: undefined } }
      > = 1
      assertStr

      expect(str).toMatchObject({
        [$defaults]: { key: undefined, put: 'hello', update: undefined }
      })
    })

    it('returns string with KEY default value if it is key (default shorthand)', () => {
      const str = string().key().default('hello')

      const assertStr: A.Contains<
        typeof str,
        { [$defaults]: { key: unknown; put: undefined; update: undefined } }
      > = 1
      assertStr

      expect(str).toMatchObject({
        [$defaults]: { key: 'hello', put: undefined, update: undefined }
      })
    })

    it('default with enum values', () => {
      const invalidStr = string().enum('foo', 'bar').default(
        // @ts-expect-error
        'baz'
      )

      const invalidCall = () => freezePrimitiveAttribute(invalidStr, path)

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
        typeof strA,
        { [$defaults]: { put: unknown }; [$enum]: ['foo', 'bar'] }
      > = 1
      assertStrA

      expect(strA).toMatchObject({ [$defaults]: { put: 'foo' }, [$enum]: ['foo', 'bar'] })

      const assertStrB: A.Contains<
        typeof strB,
        { [$defaults]: { put: unknown }; [$enum]: ['foo', 'bar'] }
      > = 1
      assertStrB

      expect(strB).toMatchObject({ [$defaults]: { put: sayFoo }, [$enum]: ['foo', 'bar'] })
    })
  })

  describe('number', () => {
    it('returns default number', () => {
      const num = number()

      const assertNum: A.Contains<typeof num, { [$type]: 'number' }> = 1
      assertNum

      expect(num).toMatchObject({ [$type]: 'number' })
    })
  })

  describe('boolean', () => {
    it('returns default boolean', () => {
      const bool = boolean()

      const assertBool: A.Contains<typeof bool, { [$type]: 'boolean' }> = 1
      assertBool

      expect(bool).toMatchObject({ [$type]: 'boolean' })
    })
  })

  describe('binary', () => {
    it('returns default binary', () => {
      const bin = binary()

      const assertBin: A.Contains<typeof bin, { [$type]: 'binary' }> = 1
      assertBin

      expect(bin).toMatchObject({ [$type]: 'binary' })
    })
  })
})
