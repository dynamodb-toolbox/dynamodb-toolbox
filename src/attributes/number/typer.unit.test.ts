import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNumberAttribute } from './freeze.js'
import type { NumberAttribute, NumberSchema } from './interface.js'
import { number } from './typer.js'

const path = 'some.path'

describe('number', () => {
  test('returns default number', () => {
    const num = number()

    const assertType: A.Equals<(typeof num)['type'], 'number'> = 1
    assertType
    expect(num.type).toBe('number')

    const assertState: A.Equals<(typeof num)['state'], {}> = 1
    assertState
    expect(num.state).toStrictEqual({})

    const assertExtends: A.Extends<typeof num, NumberSchema> = 1
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
      (typeof numAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)['state'], { required: Never }> = 1
    assertNever

    expect(numAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(numAlways.state.required).toBe('always')
    expect(numNever.state.required).toBe('never')
  })

  test('returns required number (method)', () => {
    const numAtLeastOnce = number().required()
    const numAlways = number().required('always')
    const numNever = number().required('never')
    const numOpt = number().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof numAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(numAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(numAlways.state.required).toBe('always')
    expect(numNever.state.required).toBe('never')
    expect(numOpt.state.required).toBe('never')
  })

  test('returns hidden number (option)', () => {
    const num = number({ hidden: true })

    const assertNum: A.Contains<(typeof num)['state'], { hidden: true }> = 1
    assertNum

    expect(num.state.hidden).toBe(true)
  })

  test('returns hidden number (method)', () => {
    const num = number().hidden()

    const assertNum: A.Contains<(typeof num)['state'], { hidden: true }> = 1
    assertNum

    expect(num.state.hidden).toBe(true)
  })

  test('returns key number (option)', () => {
    const num = number({ key: true })

    const assertNum: A.Contains<(typeof num)['state'], { key: true }> = 1
    assertNum

    expect(num.state.key).toBe(true)
  })

  test('returns key number (method)', () => {
    const num = number().key()

    const assertNum: A.Contains<(typeof num)['state'], { key: true; required: Always }> = 1
    assertNum

    expect(num.state.key).toBe(true)
    expect(num.state.required).toBe('always')
  })

  test('returns savedAs number (option)', () => {
    const num = number({ savedAs: 'foo' })

    const assertNum: A.Contains<(typeof num)['state'], { savedAs: 'foo' }> = 1
    assertNum

    expect(num.state.savedAs).toBe('foo')
  })

  test('returns savedAs number (method)', () => {
    const num = number().savedAs('foo')

    const assertNum: A.Contains<(typeof num)['state'], { savedAs: 'foo' }> = 1
    assertNum

    expect(num.state.savedAs).toBe('foo')
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

    const superInvalidCallA = () => invalidNumA.check(path)

    expect(superInvalidCallA).toThrow(DynamoDBToolboxError)
    expect(superInvalidCallA).toThrow(
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

    const superInvalidCallB = () => invalidNumB.check(path)

    expect(superInvalidCallB).toThrow(DynamoDBToolboxError)
    expect(superInvalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const num = number().enum(1, 2)

    const assertNum: A.Contains<(typeof num)['state'], { enum: [1, 2] }> = 1
    assertNum

    expect(num.state.enum).toStrictEqual([1, 2])
  })

  test('returns transformed number (option)', () => {
    const transformer = {
      encode: (input: number | bigint): number => (typeof input === 'number' ? input + 1 : 0),
      decode: (raw: number): number => raw - 1
    }

    const num = number({ transform: transformer })

    const assertNum: A.Contains<(typeof num)['state'], { transform: unknown }> = 1
    assertNum

    expect(num.state.transform).toBe(transformer)
  })

  test('returns transformed number (method)', () => {
    const transformer = {
      encode: (input: number): number => input + 1,
      decode: (raw: number | bigint): number => (typeof raw === 'number' ? raw - 1 : 0)
    }

    const num = number().transform(transformer)

    const assertNum: A.Contains<(typeof num)['state'], { transform: typeof transformer }> = 1
    assertNum

    expect(num.state.transform).toBe(transformer)
  })

  test('returns big number (option)', () => {
    const num = number({ big: true })

    const assertNum: A.Contains<(typeof num)['state'], { big: true }> = 1
    assertNum

    expect(num.state.big).toBe(true)
  })

  test('returns big number (method)', () => {
    const num = number().big()

    const assertNum: A.Contains<(typeof num)['state'], { big: true }> = 1
    assertNum

    expect(num.state.big).toBe(true)
  })

  test('returns defaulted number (option)', () => {
    const invalidNum = number({
      // TOIMPROVE: add type constraints here
      putDefault: 'foo'
    })

    const invalidCall = () => invalidNum.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    const superInvalidCall = () => invalidNum.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    // TOIMPROVE: add type constraints here
    number({ updateDefault: () => 42 })

    const numA = number({ keyDefault: 42 })
    const numB = number({ putDefault: 43 })
    const returnNum = () => 44
    const numC = number({ updateDefault: returnNum })

    const assertNumA: A.Contains<(typeof numA)['state'], { keyDefault: number }> = 1
    assertNumA

    expect(numA.state.keyDefault).toBe(42)

    const assertNumB: A.Contains<(typeof numB)['state'], { putDefault: number }> = 1
    assertNumB

    expect(numB.state.putDefault).toBe(43)

    const assertNumC: A.Contains<(typeof numC)['state'], { updateDefault: () => number }> = 1
    assertNumC

    expect(numC.state.updateDefault).toBe(returnNum)
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

    const superInvalidCallA = () => invalidNumA.check(path)

    expect(superInvalidCallA).toThrow(DynamoDBToolboxError)
    expect(superInvalidCallA).toThrow(
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

    const superInvalidCallB = () => invalidNumB.check(path)

    expect(superInvalidCallB).toThrow(DynamoDBToolboxError)
    expect(superInvalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    number()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const numA = number().keyDefault(42)
    const numB = number().putDefault(43)
    const returnNumber = () => 44
    const numC = number().updateDefault(returnNumber)

    const assertNumA: A.Contains<(typeof numA)['state'], { keyDefault: unknown }> = 1
    assertNumA

    expect(numA.state.keyDefault).toBe(42)

    const assertNumB: A.Contains<(typeof numB)['state'], { putDefault: unknown }> = 1
    assertNumB

    expect(numB.state.putDefault).toBe(43)

    const assertNumC: A.Contains<(typeof numC)['state'], { updateDefault: unknown }> = 1
    assertNumC

    expect(numC.state.updateDefault).toBe(returnNumber)

    const numBig = number().big().default(BigInt('10000000'))

    const assertNumBig: A.Contains<(typeof numBig)['state'], { putDefault: unknown }> = 1
    assertNumBig

    expect(numBig.state.putDefault).toBe(BigInt('10000000'))
  })

  test('returns number with PUT default value if it is not key (default shorthand)', () => {
    const num = number().default(42)

    const assertNum: A.Contains<(typeof num)['state'], { putDefault: unknown }> = 1
    assertNum

    expect(num.state.putDefault).toBe(42)
  })

  test('returns number with KEY default value if it is key (default shorthand)', () => {
    const num = number().key().default(42)

    const assertNum: A.Contains<(typeof num)['state'], { keyDefault: unknown }> = 1
    assertNum

    expect(num.state.keyDefault).toBe(42)
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

    const superInvalidCall = () => invalidNum.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const numA = number().enum(42, 43).default(42)
    const sayFoo = (): 42 => 42
    const numB = number().enum(42, 43).default(sayFoo)

    const assertNumA: A.Contains<(typeof numA)['state'], { putDefault: unknown; enum: [42, 43] }> =
      1
    assertNumA

    expect(numA.state.putDefault).toBe(42)
    expect(numA.state.enum).toStrictEqual([42, 43])

    const assertNumB: A.Contains<(typeof numB)['state'], { putDefault: unknown; enum: [42, 43] }> =
      1
    assertNumB

    expect(numB.state.putDefault).toBe(sayFoo)
    expect(numB.state.enum).toStrictEqual([42, 43])
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

    const superInvalidCall = () => invalidNum.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyNum = number().const(42)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)['state'],
      { enum: [42]; putDefault: unknown }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum.state.enum).toStrictEqual([42])
    expect(nonKeyNum.state.putDefault).toBe(42)

    const keyNum = number().key().const(42)

    const assertKeyNum: A.Contains<(typeof keyNum)['state'], { enum: [42]; keyDefault: unknown }> =
      1
    assertKeyNum

    expect(keyNum.state.enum).toStrictEqual([42])
    expect(keyNum.state.keyDefault).toBe(42)
  })

  test('returns linked number (method)', () => {
    const returnNumber = () => 42
    const numA = number().keyLink(returnNumber)
    const numB = number().putLink(returnNumber)
    const numC = number().updateLink(returnNumber)

    const assertNumA: A.Contains<(typeof numA)['state'], { keyLink: unknown }> = 1
    assertNumA

    expect(numA.state.keyLink).toBe(returnNumber)

    const assertNumB: A.Contains<(typeof numB)['state'], { putLink: unknown }> = 1
    assertNumB

    expect(numB.state.putLink).toBe(returnNumber)

    const assertNumC: A.Contains<(typeof numC)['state'], { updateLink: unknown }> = 1
    assertNumC

    expect(numC.state.updateLink).toBe(returnNumber)
  })

  test('returns number with PUT linked value if it is not key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().link(returnNumber)

    const assertNum: A.Contains<(typeof num)['state'], { putLink: unknown }> = 1
    assertNum

    expect(num.state.putLink).toBe(returnNumber)
  })

  test('returns number with KEY linked value if it is key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().key().link(returnNumber)

    const assertNum: A.Contains<(typeof num)['state'], { keyLink: unknown }> = 1
    assertNum

    expect(num.state.keyLink).toBe(returnNumber)
  })

  test('returns number with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const numA = number({ keyValidator: pass })
    const numB = number({ putValidator: pass })
    const numC = number({ updateValidator: pass })

    const assertNumA: A.Contains<(typeof numA)['state'], { keyValidator: Validator }> = 1
    assertNumA

    expect(numA.state.keyValidator).toBe(pass)

    const assertNumB: A.Contains<(typeof numB)['state'], { putValidator: Validator }> = 1
    assertNumB

    expect(numB.state.putValidator).toBe(pass)

    const assertNumC: A.Contains<(typeof numC)['state'], { updateValidator: Validator }> = 1
    assertNumC

    expect(numC.state.updateValidator).toBe(pass)
  })

  test('returns number with validator (method)', () => {
    const pass = () => true

    const numA = number().keyValidate(pass)
    const numB = number().putValidate(pass)
    const numC = number().updateValidate(pass)

    const assertNumA: A.Contains<(typeof numA)['state'], { keyValidator: Validator }> = 1
    assertNumA

    expect(numA.state.keyValidator).toBe(pass)

    const assertNumB: A.Contains<(typeof numB)['state'], { putValidator: Validator }> = 1
    assertNumB

    expect(numB.state.putValidator).toBe(pass)

    const assertNumC: A.Contains<(typeof numC)['state'], { updateValidator: Validator }> = 1
    assertNumC

    expect(numC.state.updateValidator).toBe(pass)

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

    const assertNum: A.Contains<(typeof num)['state'], { putValidator: Validator }> = 1
    assertNum

    expect(num.state.putValidator).toBe(pass)
  })

  test('returns number with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const num = number().key().validate(pass)

    const assertNum: A.Contains<(typeof num)['state'], { keyValidator: Validator }> = 1
    assertNum

    expect(num.state.keyValidator).toBe(pass)
  })
})
