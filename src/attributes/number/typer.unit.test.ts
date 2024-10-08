import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNumberAttribute } from './freeze.js'
import type { $NumberAttributeState, NumberAttribute } from './interface.js'
import { number } from './typer.js'

const path = 'some.path'

describe('number', () => {
  test('returns default number', () => {
    const num = number()

    const assertType: A.Equals<(typeof num)[$type], 'number'> = 1
    assertType
    expect(num[$type]).toBe('number')

    const assertState: A.Equals<
      (typeof num)[$state],
      {
        required: AtLeastOnce
        hidden: false
        key: false
        savedAs: undefined
        enum: undefined
        transform: undefined
        big: false
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
    expect(num[$state]).toStrictEqual({
      required: 'atLeastOnce',
      hidden: false,
      key: false,
      savedAs: undefined,
      enum: undefined,
      transform: undefined,
      big: false,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined },
      validators: { key: undefined, put: undefined, update: undefined }
    })

    const assertExtends: A.Extends<typeof num, $NumberAttributeState> = 1
    assertExtends

    const frozenNum = num.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenNum, NumberAttribute> = 1
    assertFrozenExtends
  })

  test('returns required number (option)', () => {
    const numAtLeastOnce = number({ required: 'atLeastOnce' })
    const numAlways = number({ required: 'always' })
    const numNever = number({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof numAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)[$state], { required: Never }> = 1
    assertNever

    expect(numAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(numAlways[$state].required).toBe('always')
    expect(numNever[$state].required).toBe('never')
  })

  test('returns required number (method)', () => {
    const numAtLeastOnce = number().required()
    const numAlways = number().required('always')
    const numNever = number().required('never')
    const numOpt = number().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof numAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(numAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(numAlways[$state].required).toBe('always')
    expect(numNever[$state].required).toBe('never')
    expect(numOpt[$state].required).toBe('never')
  })

  test('returns hidden number (option)', () => {
    const num = number({ hidden: true })

    const assertNum: A.Contains<(typeof num)[$state], { hidden: true }> = 1
    assertNum

    expect(num[$state].hidden).toBe(true)
  })

  test('returns hidden number (method)', () => {
    const num = number().hidden()

    const assertNum: A.Contains<(typeof num)[$state], { hidden: true }> = 1
    assertNum

    expect(num[$state].hidden).toBe(true)
  })

  test('returns key number (option)', () => {
    const num = number({ key: true })

    const assertNum: A.Contains<(typeof num)[$state], { key: true; required: AtLeastOnce }> = 1
    assertNum

    expect(num[$state].key).toBe(true)
    expect(num[$state].required).toBe('atLeastOnce')
  })

  test('returns key number (method)', () => {
    const num = number().key()

    const assertNum: A.Contains<(typeof num)[$state], { key: true; required: Always }> = 1
    assertNum

    expect(num[$state].key).toBe(true)
    expect(num[$state].required).toBe('always')
  })

  test('returns savedAs number (option)', () => {
    const num = number({ savedAs: 'foo' })

    const assertNum: A.Contains<(typeof num)[$state], { savedAs: 'foo' }> = 1
    assertNum

    expect(num[$state].savedAs).toBe('foo')
  })

  test('returns savedAs number (method)', () => {
    const num = number().savedAs('foo')

    const assertNum: A.Contains<(typeof num)[$state], { savedAs: 'foo' }> = 1
    assertNum

    expect(num[$state].savedAs).toBe('foo')
  })

  test('returns number with enum values (method)', () => {
    const invalidNumA = number().enum(
      // @ts-expect-error
      'foo',
      42
    )

    const invalidCallA = () => invalidNumA.freeze(path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const invalidNumB = number().enum(
      // @ts-expect-error
      BigInt('100000000'),
      42
    )

    const invalidCallB = () => invalidNumB.freeze(path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const num = number().enum(1, 2)

    const assertNum: A.Contains<(typeof num)[$state], { enum: [1, 2] }> = 1
    assertNum

    expect(num[$state].enum).toStrictEqual([1, 2])
  })

  test('returns defaulted number (option)', () => {
    const invalidNum = number({
      // TOIMPROVE: add type constraints here
      defaults: { put: 'foo', update: undefined, key: undefined }
    })

    const invalidCall = () => invalidNum.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    number({
      defaults: {
        key: undefined,
        put: undefined,
        // TOIMPROVE: add type constraints here
        update: () => 42
      }
    })

    const numA = number({ defaults: { key: 42, put: undefined, update: undefined } })
    const numB = number({ defaults: { key: undefined, put: 43, update: undefined } })
    const returnNum = () => 44
    const numC = number({ defaults: { key: undefined, put: undefined, update: returnNum } })

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { defaults: { key: number; put: undefined; update: undefined } }
    > = 1
    assertNumA

    expect(numA[$state].defaults).toStrictEqual({
      key: 42,
      put: undefined,
      update: undefined
    })

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { defaults: { key: undefined; put: number; update: undefined } }
    > = 1
    assertNumB

    expect(numB[$state].defaults).toStrictEqual({
      key: undefined,
      put: 43,
      update: undefined
    })

    const assertNumC: A.Contains<
      (typeof numC)[$state],
      { defaults: { key: undefined; put: undefined; update: () => number } }
    > = 1
    assertNumC

    expect(numC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNum
    })
  })

  test('returns transformed number (option)', () => {
    const transformer = {
      parse: (input: number | bigint): number => (typeof input === 'number' ? input + 1 : 0),
      format: (raw: number): number => raw - 1
    }

    const num = number({ transform: transformer })

    const assertNum: A.Contains<(typeof num)[$state], { transform: unknown }> = 1
    assertNum

    expect(num[$state].transform).toBe(transformer)
  })

  test('returns transformed number (method)', () => {
    const transformer = {
      parse: (input: number): number => input + 1,
      format: (raw: number | bigint): number => (typeof raw === 'number' ? raw - 1 : 0)
    }

    const num = number().transform(transformer)

    const assertNum: A.Contains<(typeof num)[$state], { transform: typeof transformer }> = 1
    assertNum

    expect(num[$state].transform).toBe(transformer)
  })

  test('returns big number (option)', () => {
    const num = number({ big: true })

    const assertNum: A.Contains<(typeof num)[$state], { big: true }> = 1
    assertNum

    expect(num[$state].big).toBe(true)
  })

  test('returns big number (method)', () => {
    const num = number().big()

    const assertNum: A.Contains<(typeof num)[$state], { big: true }> = 1
    assertNum

    expect(num[$state].big).toBe(true)
  })

  test('returns defaulted number (method)', () => {
    const invalidNumA = number()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCallA = () => invalidNumA.freeze(path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    number()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const invalidNumB = number()
      // @ts-expect-error
      .putDefault(BigInt('1000000'))

    const invalidCallB = () => invalidNumB.freeze(path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    number()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const numA = number().keyDefault(42)
    const numB = number().putDefault(43)
    const returnNumber = () => 44
    const numC = number().updateDefault(returnNumber)

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNumA

    expect(numA[$state].defaults).toStrictEqual({
      key: 42,
      put: undefined,
      update: undefined
    })

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNumB

    expect(numB[$state].defaults).toStrictEqual({
      key: undefined,
      put: 43,
      update: undefined
    })

    const assertNumC: A.Contains<
      (typeof numC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertNumC

    expect(numC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNumber
    })

    const numBig = number().big().default(BigInt('10000000'))

    const assertNumBig: A.Contains<
      (typeof numBig)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNumBig

    expect(numBig[$state].defaults).toStrictEqual({
      key: undefined,
      put: BigInt('10000000'),
      update: undefined
    })
  })

  test('returns number with PUT default value if it is not key (default shorthand)', () => {
    const num = number().default(42)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].defaults).toStrictEqual({
      key: undefined,
      put: 42,
      update: undefined
    })
  })

  test('returns number with KEY default value if it is key (default shorthand)', () => {
    const num = number().key().default(42)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].defaults).toStrictEqual({
      key: 42,
      put: undefined,
      update: undefined
    })
  })

  test('default with enum values', () => {
    const invalidNum = number().enum(42, 43).default(
      // @ts-expect-error
      44
    )

    const invalidCall = () => invalidNum.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const numA = number().enum(42, 43).default(42)
    const sayFoo = (): 42 => 42
    const numB = number().enum(42, 43).default(sayFoo)

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { defaults: { put: unknown }; enum: [42, 43] }
    > = 1
    assertNumA

    expect(numA[$state].defaults).toMatchObject({ put: 42 })
    expect(numA[$state].enum).toStrictEqual([42, 43])

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { defaults: { put: unknown }; enum: [42, 43] }
    > = 1
    assertNumB

    expect(numB[$state].defaults).toMatchObject({ put: sayFoo })
    expect(numB[$state].enum).toStrictEqual([42, 43])
  })

  test('returns number with constant value (method)', () => {
    const invalidNum = number().const(
      // @ts-expect-error
      'foo'
    )

    const invalidCall = () => invalidNum.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyNum = number().const(42)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)[$state],
      { enum: [42]; defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum[$state].enum).toStrictEqual([42])
    expect(nonKeyNum[$state].defaults).toStrictEqual({
      key: undefined,
      put: 42,
      update: undefined
    })

    const keyNum = number().key().const(42)

    const assertKeyNum: A.Contains<
      (typeof keyNum)[$state],
      { enum: [42]; defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertKeyNum

    expect(keyNum[$state].enum).toStrictEqual([42])
    expect(keyNum[$state].defaults).toStrictEqual({
      key: 42,
      put: undefined,
      update: undefined
    })
  })

  test('returns linked number (method)', () => {
    const returnNumber = () => 42
    const numA = number().keyLink(returnNumber)
    const numB = number().putLink(returnNumber)
    const numC = number().updateLink(returnNumber)

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNumA

    expect(numA[$state].links).toStrictEqual({
      key: returnNumber,
      put: undefined,
      update: undefined
    })

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNumB

    expect(numB[$state].links).toStrictEqual({
      key: undefined,
      put: returnNumber,
      update: undefined
    })

    const assertNumC: A.Contains<
      (typeof numC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertNumC

    expect(numC[$state].links).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNumber
    })
  })

  test('returns number with PUT linked value if it is not key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().link(returnNumber)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].links).toStrictEqual({
      key: undefined,
      put: returnNumber,
      update: undefined
    })
  })

  test('returns number with KEY linked value if it is key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().key().link(returnNumber)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].links).toStrictEqual({
      key: returnNumber,
      put: undefined,
      update: undefined
    })
  })

  test('returns number with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const numA = number({ validators: { key: pass, put: undefined, update: undefined } })
    const numB = number({ validators: { key: undefined, put: pass, update: undefined } })
    const numC = number({ validators: { key: undefined, put: undefined, update: pass } })

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNumA

    expect(numA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNumB

    expect(numB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertNumC: A.Contains<
      (typeof numC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertNumC

    expect(numC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns number with validator (method)', () => {
    const pass = () => true

    const numA = number().keyValidate(pass)
    const numB = number().putValidate(pass)
    const numC = number().updateValidate(pass)

    const assertNumA: A.Contains<
      (typeof numA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNumA

    expect(numA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertNumB: A.Contains<
      (typeof numB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNumB

    expect(numB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertNumC: A.Contains<
      (typeof numC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertNumC

    expect(numC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

    const prevNum = number()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [number, FreezeNumberAttribute<typeof prevNum>]> = 1
      assertArgs

      return true
    })

    const prevOptNum = number().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [number, FreezeNumberAttribute<typeof prevOptNum>]> =
        1
      assertArgs

      return true
    })
  })

  test('returns number with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const num = number().validate(pass)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns number with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const num = number().key().validate(pass)

    const assertNum: A.Contains<
      (typeof num)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNum

    expect(num[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })
})
