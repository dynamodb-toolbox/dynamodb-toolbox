import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { BooleanSchema } from './schema.js'
import { boolean } from './schema_.js'

const path = 'some.path'

describe('boolean', () => {
  test('returns default boolean', () => {
    const bool = boolean()

    const assertType: A.Equals<(typeof bool)['type'], 'boolean'> = 1
    assertType
    expect(bool.type).toBe('boolean')

    const assertProps: A.Equals<(typeof bool)['props'], {}> = 1
    assertProps
    expect(bool.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof bool, BooleanSchema> = 1
    assertExtends
  })

  test('returns required boolean (option)', () => {
    const boolAtLeastOnce = boolean({ required: 'atLeastOnce' })
    const boolAlways = boolean({ required: 'always' })
    const boolNever = boolean({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof boolAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)['props'], { required: Never }> = 1
    assertNever

    expect(boolAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(boolAlways.props.required).toBe('always')
    expect(boolNever.props.required).toBe('never')
  })

  test('returns required boolean (method)', () => {
    const boolAtLeastOnce = boolean().required()
    const boolAlways = boolean().required('always')
    const boolNever = boolean().required('never')
    const numOpt = boolean().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof boolAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(boolAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(boolAlways.props.required).toBe('always')
    expect(boolNever.props.required).toBe('never')
    expect(numOpt.props.required).toBe('never')
  })

  test('returns hidden boolean (option)', () => {
    const bool = boolean({ hidden: true })

    const assertBool: A.Contains<(typeof bool)['props'], { hidden: true }> = 1
    assertBool

    expect(bool.props.hidden).toBe(true)
  })

  test('returns hidden boolean (method)', () => {
    const bool = boolean().hidden()

    const assertBool: A.Contains<(typeof bool)['props'], { hidden: true }> = 1
    assertBool

    expect(bool.props.hidden).toBe(true)
  })

  test('returns key boolean (option)', () => {
    const bool = boolean({ key: true })

    const assertBool: A.Contains<(typeof bool)['props'], { key: true }> = 1
    assertBool

    expect(bool.props.key).toBe(true)
  })

  test('returns key boolean (method)', () => {
    const bool = boolean().key()

    const assertBool: A.Contains<(typeof bool)['props'], { key: true; required: Always }> = 1
    assertBool

    expect(bool.props.key).toBe(true)
    expect(bool.props.required).toBe('always')
  })

  test('returns savedAs boolean (option)', () => {
    const bool = boolean({ savedAs: 'foo' })

    const assertBool: A.Contains<(typeof bool)['props'], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool.props.savedAs).toBe('foo')
  })

  test('returns savedAs boolean (method)', () => {
    const bool = boolean().savedAs('foo')

    const assertBool: A.Contains<(typeof bool)['props'], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool.props.savedAs).toBe('foo')
  })

  test('returns boolean with enum values (method)', () => {
    const invalidBool = boolean().enum(
      // @ts-expect-error
      'foo',
      true
    )

    const invalidCall = () => invalidBool.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidEnumValueType', path })
    )

    const bool = boolean().enum(true)

    const assertBool: A.Contains<(typeof bool)['props'], { enum: [true] }> = 1
    assertBool

    expect(bool.props.enum).toStrictEqual([true])
  })

  test('returns defaulted boolean (option)', () => {
    const invalidBool = boolean({
      // TOIMPROVE: add type constraints here
      putDefault: 42
    })

    const invalidCall = () => invalidBool.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    boolean({
      // TOIMPROVE: add type constraints here
      updateDefault: () => 42
    })

    const boolA = boolean({ keyDefault: true })
    const boolB = boolean({ putDefault: true })
    const returnTrue = () => true
    const boolC = boolean({ updateDefault: returnTrue })

    const assertBoolA: A.Contains<(typeof boolA)['props'], { keyDefault: boolean }> = 1
    assertBoolA

    expect(boolA.props.keyDefault).toBe(true)

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putDefault: boolean }> = 1
    assertBoolB

    expect(boolB.props.putDefault).toBe(true)

    const assertBoolC: A.Contains<(typeof boolC)['props'], { updateDefault: () => boolean }> = 1
    assertBoolC

    expect(boolC.props.updateDefault).toBe(returnTrue)
  })

  test('returns transformed boolean (option)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean({ transform: negate })

    const assertBool: A.Contains<(typeof bool)['props'], { transform: typeof negate }> = 1
    assertBool

    expect(bool.props.transform).toBe(negate)
  })

  test('returns transformed boolean (method)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean().transform(negate)

    const assertBool: A.Contains<(typeof bool)['props'], { transform: typeof negate }> = 1
    assertBool

    expect(bool.props.transform).toBe(negate)
  })

  test('returns defaulted boolean (method)', () => {
    const invalidBool = boolean()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCall = () => invalidBool.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    boolean()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const boolA = boolean().keyDefault(true)
    const boolB = boolean().putDefault(true)
    const returnTrue = () => true
    const boolC = boolean().updateDefault(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['props'], { keyDefault: unknown }> = 1
    assertBoolA

    expect(boolA.props.keyDefault).toBe(true)

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putDefault: unknown }> = 1
    assertBoolB

    expect(boolB.props.putDefault).toBe(true)

    const assertBoolC: A.Contains<(typeof boolC)['props'], { updateDefault: unknown }> = 1
    assertBoolC

    expect(boolC.props.updateDefault).toBe(returnTrue)
  })

  test('returns boolean with PUT default value if it is not key (default shorthand)', () => {
    const bool = boolean().default(true)

    const assertBool: A.Contains<(typeof bool)['props'], { putDefault: unknown }> = 1
    assertBool

    expect(bool.props.putDefault).toBe(true)
  })

  test('returns boolean with KEY default value if it is key (default shorthand)', () => {
    const bool = boolean().key().default(true)

    const assertBool: A.Contains<(typeof bool)['props'], { keyDefault: unknown }> = 1
    assertBool

    expect(bool.props.keyDefault).toBe(true)
  })

  test('default with enum values', () => {
    const invalidBool = boolean().enum(true).default(
      // @ts-expect-error
      false
    )

    const invalidCall = () => invalidBool.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitive.invalidDefaultValueRange',
        path
      })
    )

    const boolA = boolean().enum(true).default(true)
    const returnTrue = (): true => true
    const boolB = boolean().enum(true).default(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['props'], { putDefault: unknown; enum: [true] }> =
      1
    assertBoolA

    expect(boolA.props.putDefault).toBe(true)
    expect(boolA.props.enum).toStrictEqual([true])

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putDefault: unknown; enum: [true] }> =
      1
    assertBoolB

    expect(boolB.props.putDefault).toBe(returnTrue)
    expect(boolB.props.enum).toStrictEqual([true])
  })

  test('returns boolean with constant value (method)', () => {
    const invalidBool = boolean().const(
      // @ts-expect-error
      'foo'
    )

    const invalidCall = () => invalidBool.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidEnumValueType', path })
    )

    const nonKeyNum = boolean().const(true)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)['props'],
      { enum: [true]; putDefault: unknown }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum.props.enum).toStrictEqual([true])
    expect(nonKeyNum.props.putDefault).toBe(true)

    const keyNum = boolean().key().const(true)

    const assertKeyNum: A.Contains<
      (typeof keyNum)['props'],
      { enum: [true]; keyDefault: unknown }
    > = 1
    assertKeyNum

    expect(keyNum.props.enum).toStrictEqual([true])
    expect(keyNum.props.keyDefault).toBe(true)
  })

  test('returns linked boolean (method)', () => {
    const returnTrue = () => true
    const boolA = boolean().keyLink(returnTrue)
    const boolB = boolean().putLink(returnTrue)
    const boolC = boolean().updateLink(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['props'], { keyLink: unknown }> = 1
    assertBoolA

    expect(boolA.props.keyLink).toBe(returnTrue)

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putLink: unknown }> = 1
    assertBoolB

    expect(boolB.props.putLink).toBe(returnTrue)

    const assertBoolC: A.Contains<(typeof boolC)['props'], { updateLink: unknown }> = 1
    assertBoolC

    expect(boolC.props.updateLink).toBe(returnTrue)
  })

  test('returns boolean with PUT linked value if it is not key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().link(returnTrue)

    const assertBool: A.Contains<(typeof bool)['props'], { putLink: unknown }> = 1
    assertBool

    expect(bool.props.putLink).toBe(returnTrue)
  })

  test('returns boolean with KEY linked value if it is key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().key().link(returnTrue)

    const assertBool: A.Contains<(typeof bool)['props'], { keyLink: unknown }> = 1
    assertBool

    expect(bool.props.keyLink).toBe(returnTrue)
  })

  test('returns boolean with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const boolA = boolean({ keyValidator: pass })
    const boolB = boolean({ putValidator: pass })
    const boolC = boolean({ updateValidator: pass })

    const assertBoolA: A.Contains<(typeof boolA)['props'], { keyValidator: Validator }> = 1
    assertBoolA

    expect(boolA.props.keyValidator).toBe(pass)

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putValidator: Validator }> = 1
    assertBoolB

    expect(boolB.props.putValidator).toBe(pass)

    const assertBoolC: A.Contains<(typeof boolC)['props'], { updateValidator: Validator }> = 1
    assertBoolC

    expect(boolC.props.updateValidator).toBe(pass)
  })

  test('returns boolean with validator (method)', () => {
    const pass = () => true

    const boolA = boolean().keyValidate(pass)
    const boolB = boolean().putValidate(pass)
    const boolC = boolean().updateValidate(pass)

    const assertBoolA: A.Contains<(typeof boolA)['props'], { keyValidator: Validator }> = 1
    assertBoolA

    expect(boolA.props.keyValidator).toBe(pass)

    const assertBoolB: A.Contains<(typeof boolB)['props'], { putValidator: Validator }> = 1
    assertBoolB

    expect(boolB.props.putValidator).toBe(pass)

    const assertBoolC: A.Contains<(typeof boolC)['props'], { updateValidator: Validator }> = 1
    assertBoolC

    expect(boolC.props.updateValidator).toBe(pass)

    const prevNum = boolean()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [boolean, typeof prevNum]> = 1
      assertArgs

      return true
    })

    const prevOptNum = boolean().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [boolean, typeof prevOptNum]> = 1
      assertArgs

      return true
    })
  })

  test('returns boolean with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const bool = boolean().validate(pass)

    const assertBool: A.Contains<(typeof bool)['props'], { putValidator: Validator }> = 1
    assertBool

    expect(bool.props.putValidator).toBe(pass)
  })

  test('returns boolean with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const bool = boolean().key().validate(pass)

    const assertBool: A.Contains<(typeof bool)['props'], { keyValidator: Validator }> = 1
    assertBool

    expect(bool.props.keyValidator).toBe(pass)
  })
})
