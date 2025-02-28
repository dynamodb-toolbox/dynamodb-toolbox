import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { NumberSchema } from './schema.js'
import { number } from './schema_.js'

const path = 'some.path'

describe('number', () => {
  test('returns default number', () => {
    const num = number()

    const assertType: A.Equals<(typeof num)['type'], 'number'> = 1
    assertType
    expect(num.type).toBe('number')

    const assertProps: A.Equals<(typeof num)['props'], {}> = 1
    assertProps
    expect(num.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof num, NumberSchema> = 1
    assertExtends
  })

  test('returns required number (prop)', () => {
    const numAtLeastOnce = number({ required: 'atLeastOnce' })
    const numAlways = number({ required: 'always' })
    const numNever = number({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof numAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)['props'], { required: Never }> = 1
    assertNever

    expect(numAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(numAlways.props.required).toBe('always')
    expect(numNever.props.required).toBe('never')
  })

  test('returns required number (method)', () => {
    const numAtLeastOnce = number().required()
    const numAlways = number().required('always')
    const numNever = number().required('never')
    const numOpt = number().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof numAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof numAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof numNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(numAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(numAlways.props.required).toBe('always')
    expect(numNever.props.required).toBe('never')
    expect(numOpt.props.required).toBe('never')
  })

  test('returns hidden number (prop)', () => {
    const num = number({ hidden: true })

    const assertNum: A.Contains<(typeof num)['props'], { hidden: true }> = 1
    assertNum

    expect(num.props.hidden).toBe(true)
  })

  test('returns hidden number (method)', () => {
    const num = number().hidden()

    const assertNum: A.Contains<(typeof num)['props'], { hidden: true }> = 1
    assertNum

    expect(num.props.hidden).toBe(true)
  })

  test('returns key number (prop)', () => {
    const num = number({ key: true })

    const assertNum: A.Contains<(typeof num)['props'], { key: true }> = 1
    assertNum

    expect(num.props.key).toBe(true)
  })

  test('returns key number (method)', () => {
    const num = number().key()

    const assertNum: A.Contains<(typeof num)['props'], { key: true; required: Always }> = 1
    assertNum

    expect(num.props.key).toBe(true)
    expect(num.props.required).toBe('always')
  })

  test('returns savedAs number (prop)', () => {
    const num = number({ savedAs: 'foo' })

    const assertNum: A.Contains<(typeof num)['props'], { savedAs: 'foo' }> = 1
    assertNum

    expect(num.props.savedAs).toBe('foo')
  })

  test('returns savedAs number (method)', () => {
    const num = number().savedAs('foo')

    const assertNum: A.Contains<(typeof num)['props'], { savedAs: 'foo' }> = 1
    assertNum

    expect(num.props.savedAs).toBe('foo')
  })

  test('returns number with enum values (method)', () => {
    const invalidNumA = number().enum(
      // @ts-expect-error
      'foo',
      42
    )

    const invalidCallA = () => invalidNumA.check(path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidEnumValueType', path })
    )

    const invalidNumB = number().enum(
      // @ts-expect-error
      BigInt('100000000'),
      42
    )

    const invalidCallB = () => invalidNumB.check(path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidEnumValueType', path })
    )

    const num = number().enum(1, 2)

    const assertNum: A.Contains<(typeof num)['props'], { enum: [1, 2] }> = 1
    assertNum

    expect(num.props.enum).toStrictEqual([1, 2])
  })

  test('returns transformed number (prop)', () => {
    const transformer = {
      encode: (input: number | bigint): number => (typeof input === 'number' ? input + 1 : 0),
      decode: (raw: number): number => raw - 1
    }

    const num = number({ transform: transformer })

    const assertNum: A.Contains<(typeof num)['props'], { transform: unknown }> = 1
    assertNum

    expect(num.props.transform).toBe(transformer)
  })

  test('returns transformed number (method)', () => {
    const transformer = {
      encode: (input: number): number => input + 1,
      decode: (raw: number | bigint): number => (typeof raw === 'number' ? raw - 1 : 0)
    }

    const num = number().transform(transformer)

    const assertNum: A.Contains<(typeof num)['props'], { transform: typeof transformer }> = 1
    assertNum

    expect(num.props.transform).toBe(transformer)
  })

  test('returns big number (prop)', () => {
    const num = number({ big: true })

    const assertNum: A.Contains<(typeof num)['props'], { big: true }> = 1
    assertNum

    expect(num.props.big).toBe(true)
  })

  test('returns big number (method)', () => {
    const num = number().big()

    const assertNum: A.Contains<(typeof num)['props'], { big: true }> = 1
    assertNum

    expect(num.props.big).toBe(true)
  })

  test('returns defaulted number (prop)', () => {
    const invalidNum = number({
      // TOIMPROVE: add type constraints here
      putDefault: 'foo'
    })

    const invalidCall = () => invalidNum.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    // TOIMPROVE: add type constraints here
    number({ updateDefault: () => 42 })

    const numA = number({ keyDefault: 42 })
    const numB = number({ putDefault: 43 })
    const returnNum = () => 44
    const numC = number({ updateDefault: returnNum })

    const assertNumA: A.Contains<(typeof numA)['props'], { keyDefault: number }> = 1
    assertNumA

    expect(numA.props.keyDefault).toBe(42)

    const assertNumB: A.Contains<(typeof numB)['props'], { putDefault: number }> = 1
    assertNumB

    expect(numB.props.putDefault).toBe(43)

    const assertNumC: A.Contains<(typeof numC)['props'], { updateDefault: () => number }> = 1
    assertNumC

    expect(numC.props.updateDefault).toBe(returnNum)
  })

  test('returns defaulted number (method)', () => {
    const invalidNumA = number()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCallA = () => invalidNumA.check(path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    number()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const invalidNumB = number()
      // @ts-expect-error
      .putDefault(BigInt('1000000'))

    const invalidCallB = () => invalidNumB.check(path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    number()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const numA = number().keyDefault(42)
    const numB = number().putDefault(43)
    const returnNumber = () => 44
    const numC = number().updateDefault(returnNumber)

    const assertNumA: A.Contains<(typeof numA)['props'], { keyDefault: unknown }> = 1
    assertNumA

    expect(numA.props.keyDefault).toBe(42)

    const assertNumB: A.Contains<(typeof numB)['props'], { putDefault: unknown }> = 1
    assertNumB

    expect(numB.props.putDefault).toBe(43)

    const assertNumC: A.Contains<(typeof numC)['props'], { updateDefault: unknown }> = 1
    assertNumC

    expect(numC.props.updateDefault).toBe(returnNumber)

    const numBig = number().big().default(BigInt('10000000'))

    const assertNumBig: A.Contains<(typeof numBig)['props'], { putDefault: unknown }> = 1
    assertNumBig

    expect(numBig.props.putDefault).toBe(BigInt('10000000'))
  })

  test('returns number with PUT default value if it is not key (default shorthand)', () => {
    const num = number().default(42)

    const assertNum: A.Contains<(typeof num)['props'], { putDefault: unknown }> = 1
    assertNum

    expect(num.props.putDefault).toBe(42)
  })

  test('returns number with KEY default value if it is key (default shorthand)', () => {
    const num = number().key().default(42)

    const assertNum: A.Contains<(typeof num)['props'], { keyDefault: unknown }> = 1
    assertNum

    expect(num.props.keyDefault).toBe(42)
  })

  test('default with enum values', () => {
    const invalidNum = number().enum(42, 43).default(
      // @ts-expect-error
      44
    )

    const invalidCall = () => invalidNum.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitive.invalidDefaultValueRange',
        path
      })
    )

    const numA = number().enum(42, 43).default(42)
    const sayFoo = (): 42 => 42
    const numB = number().enum(42, 43).default(sayFoo)

    const assertNumA: A.Contains<(typeof numA)['props'], { putDefault: unknown; enum: [42, 43] }> =
      1
    assertNumA

    expect(numA.props.putDefault).toBe(42)
    expect(numA.props.enum).toStrictEqual([42, 43])

    const assertNumB: A.Contains<(typeof numB)['props'], { putDefault: unknown; enum: [42, 43] }> =
      1
    assertNumB

    expect(numB.props.putDefault).toBe(sayFoo)
    expect(numB.props.enum).toStrictEqual([42, 43])
  })

  test('returns number with constant value (method)', () => {
    const invalidNum = number().const(
      // @ts-expect-error
      'foo'
    )

    const invalidCall = () => invalidNum.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidEnumValueType', path })
    )

    const nonKeyNum = number().const(42)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)['props'],
      { enum: [42]; putDefault: unknown }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum.props.enum).toStrictEqual([42])
    expect(nonKeyNum.props.putDefault).toBe(42)

    const keyNum = number().key().const(42)

    const assertKeyNum: A.Contains<(typeof keyNum)['props'], { enum: [42]; keyDefault: unknown }> =
      1
    assertKeyNum

    expect(keyNum.props.enum).toStrictEqual([42])
    expect(keyNum.props.keyDefault).toBe(42)
  })

  test('returns linked number (method)', () => {
    const returnNumber = () => 42
    const numA = number().keyLink(returnNumber)
    const numB = number().putLink(returnNumber)
    const numC = number().updateLink(returnNumber)

    const assertNumA: A.Contains<(typeof numA)['props'], { keyLink: unknown }> = 1
    assertNumA

    expect(numA.props.keyLink).toBe(returnNumber)

    const assertNumB: A.Contains<(typeof numB)['props'], { putLink: unknown }> = 1
    assertNumB

    expect(numB.props.putLink).toBe(returnNumber)

    const assertNumC: A.Contains<(typeof numC)['props'], { updateLink: unknown }> = 1
    assertNumC

    expect(numC.props.updateLink).toBe(returnNumber)
  })

  test('returns number with PUT linked value if it is not key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().link(returnNumber)

    const assertNum: A.Contains<(typeof num)['props'], { putLink: unknown }> = 1
    assertNum

    expect(num.props.putLink).toBe(returnNumber)
  })

  test('returns number with KEY linked value if it is key (link shorthand)', () => {
    const returnNumber = () => 42
    const num = number().key().link(returnNumber)

    const assertNum: A.Contains<(typeof num)['props'], { keyLink: unknown }> = 1
    assertNum

    expect(num.props.keyLink).toBe(returnNumber)
  })

  test('returns number with validator (prop)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const numA = number({ keyValidator: pass })
    const numB = number({ putValidator: pass })
    const numC = number({ updateValidator: pass })

    const assertNumA: A.Contains<(typeof numA)['props'], { keyValidator: Validator }> = 1
    assertNumA

    expect(numA.props.keyValidator).toBe(pass)

    const assertNumB: A.Contains<(typeof numB)['props'], { putValidator: Validator }> = 1
    assertNumB

    expect(numB.props.putValidator).toBe(pass)

    const assertNumC: A.Contains<(typeof numC)['props'], { updateValidator: Validator }> = 1
    assertNumC

    expect(numC.props.updateValidator).toBe(pass)
  })

  test('returns number with validator (method)', () => {
    const pass = () => true

    const numA = number().keyValidate(pass)
    const numB = number().putValidate(pass)
    const numC = number().updateValidate(pass)

    const assertNumA: A.Contains<(typeof numA)['props'], { keyValidator: Validator }> = 1
    assertNumA

    expect(numA.props.keyValidator).toBe(pass)

    const assertNumB: A.Contains<(typeof numB)['props'], { putValidator: Validator }> = 1
    assertNumB

    expect(numB.props.putValidator).toBe(pass)

    const assertNumC: A.Contains<(typeof numC)['props'], { updateValidator: Validator }> = 1
    assertNumC

    expect(numC.props.updateValidator).toBe(pass)

    const prevNum = number()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [number, typeof prevNum]> = 1
      assertArgs

      return true
    })

    const prevOptNum = number().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [number, typeof prevOptNum]> = 1
      assertArgs

      return true
    })
  })

  test('returns number with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const num = number().validate(pass)

    const assertNum: A.Contains<(typeof num)['props'], { putValidator: Validator }> = 1
    assertNum

    expect(num.props.putValidator).toBe(pass)
  })

  test('returns number with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const num = number().key().validate(pass)

    const assertNum: A.Contains<(typeof num)['props'], { keyValidator: Validator }> = 1
    assertNum

    expect(num.props.keyValidator).toBe(pass)
  })
})
