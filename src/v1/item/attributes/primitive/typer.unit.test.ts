import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $default
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
          [$default]: undefined
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
        [$default]: undefined
      })
    })

    it('returns required string (option)', () => {
      const strAtLeastOnce = string({ required: 'atLeastOnce' })
      const strOnlyOnce = string({ required: 'onlyOnce' })
      const strAlways = string({ required: 'always' })
      const strNever = string({ required: 'never' })

      const assertAtLeastOnce: A.Contains<typeof strAtLeastOnce, { [$required]: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof strOnlyOnce, { [$required]: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof strAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof strNever, { [$required]: Never }> = 1
      assertNever

      expect(strAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(strOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
      expect(strAlways).toMatchObject({ [$required]: 'always' })
      expect(strNever).toMatchObject({ [$required]: 'never' })
    })

    it('returns required string (method)', () => {
      const strAtLeastOnce = string().required()
      const strOnlyOnce = string().required('onlyOnce')
      const strAlways = string().required('always')
      const strNever = string().required('never')
      const strOpt = string().optional()

      const assertAtLeastOnce: A.Contains<typeof strAtLeastOnce, { [$required]: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof strOnlyOnce, { [$required]: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof strAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof strNever, { [$required]: Never }> = 1
      assertNever
      const assertOpt: A.Contains<typeof strOpt, { [$required]: Never }> = 1
      assertOpt

      expect(strAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(strOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
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

      const assertStr: A.Contains<typeof str, { [$key]: true }> = 1
      assertStr

      expect(str).toMatchObject({ [$key]: true })
    })

    it('returns key string (method)', () => {
      const str = string().key()

      const assertStr: A.Contains<typeof str, { [$key]: true }> = 1
      assertStr

      expect(str).toMatchObject({ [$key]: true })
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
        expect.objectContaining({ code: 'invalidPrimitiveAttributeEnumValueType', path })
      )

      const str = string().enum('foo', 'bar')

      const assertStr: A.Contains<typeof str, { [$enum]: ['foo', 'bar'] }> = 1
      assertStr

      expect(str).toMatchObject({ [$enum]: ['foo', 'bar'] })
    })

    it('returns string with default value (option)', () => {
      string({
        // @ts-expect-error
        default: 42
      })

      const invalidCall = () =>
        freezePrimitiveAttribute(
          string({
            // @ts-expect-error
            default: 42
          }),
          path
        )

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'invalidPrimitiveAttributeDefaultValueType', path })
      )

      string({
        // @ts-expect-error Unable to throw here (it would require executing the fn)
        default: () => 42
      })

      const strA = string({ default: 'hello' })
      const sayHello = () => 'hello'
      const strB = string({ default: sayHello })

      const assertStrA: A.Contains<typeof strA, { [$default]: 'hello' }> = 1
      assertStrA

      expect(strA).toMatchObject({ [$default]: 'hello' })

      const assertStrB: A.Contains<typeof strB, { [$default]: () => string }> = 1
      assertStrB

      expect(strB).toMatchObject({ [$default]: sayHello })
    })

    it('returns string with default value (method)', () => {
      string().default(
        // @ts-expect-error
        42
      )

      const invalidCall = () =>
        freezePrimitiveAttribute(
          string().default(
            // @ts-expect-error
            42
          ),
          path
        )

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'invalidPrimitiveAttributeDefaultValueType', path })
      )

      string().default(
        // @ts-expect-error Unable to throw here (it would require executing the fn)
        () => 42
      )

      const strA = string().default('hello')
      const sayHello = () => 'hello'
      const strB = string().default(sayHello)

      const assertStrA: A.Contains<typeof strA, { [$default]: 'hello' }> = 1
      assertStrA

      expect(strA).toMatchObject({ [$default]: 'hello' })

      const assertStrB: A.Contains<typeof strB, { [$default]: () => string }> = 1
      assertStrB

      expect(strB).toMatchObject({ [$default]: sayHello })
    })

    it('default with enum values', () => {
      string().enum('foo', 'bar').default(
        // @ts-expect-error
        'baz'
      )

      const invalidCall = () =>
        freezePrimitiveAttribute(
          string().enum('foo', 'bar').default(
            // @ts-expect-error
            'baz'
          ),
          path
        )

      expect(invalidCall).toThrow(DynamoDBToolboxError)
      expect(invalidCall).toThrow(
        expect.objectContaining({ code: 'invalidPrimitiveAttributeDefaultValueRange', path })
      )

      const strA = string().enum('foo', 'bar').default('foo')
      const sayFoo = (): 'foo' => 'foo'
      const strB = string().enum('foo', 'bar').default(sayFoo)

      const assertStrA: A.Contains<typeof strA, { [$default]: 'foo'; [$enum]: ['foo', 'bar'] }> = 1
      assertStrA

      expect(strA).toMatchObject({ [$default]: 'foo' })

      const assertStrB: A.Contains<
        typeof strB,
        { [$default]: () => 'foo'; [$enum]: ['foo', 'bar'] }
      > = 1
      assertStrB

      expect(strB).toMatchObject({ [$default]: sayFoo, [$enum]: ['foo', 'bar'] })
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

  describe('ComputedDefault', () => {
    it('accepts ComputedDefault as default value (option)', () => {
      const str = string({ default: ComputedDefault })

      const assertStr: A.Contains<typeof str, { [$default]: ComputedDefault }> = 1
      assertStr

      expect(str).toMatchObject({ [$default]: ComputedDefault })
    })

    it('accepts ComputedDefault as default value (option)', () => {
      const str = string().default(ComputedDefault)

      const assertStr: A.Contains<typeof str, { [$default]: ComputedDefault }> = 1
      assertStr

      expect(str).toMatchObject({ [$default]: ComputedDefault })
    })
  })
})
