import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeBooleanAttribute } from './freeze.js'
import type { BooleanAttribute, BooleanSchema } from './interface.js'
import { boolean } from './typer.js'

const path = 'some.path'

describe('boolean', () => {
  test('returns default boolean', () => {
    const bool = boolean()

    const assertType: A.Equals<(typeof bool)['type'], 'boolean'> = 1
    assertType
    expect(bool.type).toBe('boolean')

    const assertState: A.Equals<(typeof bool)['state'], {}> = 1
    assertState
    expect(bool.state).toStrictEqual({})

    const assertExtends: A.Extends<typeof bool, BooleanSchema> = 1
    assertExtends

    const frozenBool = bool.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenBool, BooleanAttribute> = 1
    assertFrozenExtends
  })

  test('returns required boolean (option)', () => {
    const boolAtLeastOnce = boolean({ required: 'atLeastOnce' })
    const boolAlways = boolean({ required: 'always' })
    const boolNever = boolean({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof boolAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)['state'], { required: Never }> = 1
    assertNever

    expect(boolAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(boolAlways.state.required).toBe('always')
    expect(boolNever.state.required).toBe('never')
  })

  test('returns required boolean (method)', () => {
    const boolAtLeastOnce = boolean().required()
    const boolAlways = boolean().required('always')
    const boolNever = boolean().required('never')
    const numOpt = boolean().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof boolAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(boolAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(boolAlways.state.required).toBe('always')
    expect(boolNever.state.required).toBe('never')
    expect(numOpt.state.required).toBe('never')
  })

  test('returns hidden boolean (option)', () => {
    const bool = boolean({ hidden: true })

    const assertBool: A.Contains<(typeof bool)['state'], { hidden: true }> = 1
    assertBool

    expect(bool.state.hidden).toBe(true)
  })

  test('returns hidden boolean (method)', () => {
    const bool = boolean().hidden()

    const assertBool: A.Contains<(typeof bool)['state'], { hidden: true }> = 1
    assertBool

    expect(bool.state.hidden).toBe(true)
  })

  test('returns key boolean (option)', () => {
    const bool = boolean({ key: true })

    const assertBool: A.Contains<(typeof bool)['state'], { key: true }> = 1
    assertBool

    expect(bool.state.key).toBe(true)
  })

  test('returns key boolean (method)', () => {
    const bool = boolean().key()

    const assertBool: A.Contains<(typeof bool)['state'], { key: true; required: Always }> = 1
    assertBool

    expect(bool.state.key).toBe(true)
    expect(bool.state.required).toBe('always')
  })

  test('returns savedAs boolean (option)', () => {
    const bool = boolean({ savedAs: 'foo' })

    const assertBool: A.Contains<(typeof bool)['state'], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool.state.savedAs).toBe('foo')
  })

  test('returns savedAs boolean (method)', () => {
    const bool = boolean().savedAs('foo')

    const assertBool: A.Contains<(typeof bool)['state'], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool.state.savedAs).toBe('foo')
  })

  test('returns boolean with enum values (method)', () => {
    const invalidBool = boolean().enum(
      // @ts-expect-error
      'foo',
      true
    )

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const superInvalidCall = () => invalidBool.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const bool = boolean().enum(true)

    const assertBool: A.Contains<(typeof bool)['state'], { enum: [true] }> = 1
    assertBool

    expect(bool.state.enum).toStrictEqual([true])
  })

  test('returns defaulted boolean (option)', () => {
    const invalidBool = boolean({
      // TOIMPROVE: add type constraints here
      putDefault: 42
    })

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    const superInvalidCall = () => invalidBool.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    boolean({
      // TOIMPROVE: add type constraints here
      updateDefault: () => 42
    })

    const boolA = boolean({ keyDefault: true })
    const boolB = boolean({ putDefault: true })
    const returnTrue = () => true
    const boolC = boolean({ updateDefault: returnTrue })

    const assertBoolA: A.Contains<(typeof boolA)['state'], { keyDefault: boolean }> = 1
    assertBoolA

    expect(boolA.state.keyDefault).toBe(true)

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putDefault: boolean }> = 1
    assertBoolB

    expect(boolB.state.putDefault).toBe(true)

    const assertBoolC: A.Contains<(typeof boolC)['state'], { updateDefault: () => boolean }> = 1
    assertBoolC

    expect(boolC.state.updateDefault).toBe(returnTrue)
  })

  test('returns transformed boolean (option)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean({ transform: negate })

    const assertBool: A.Contains<(typeof bool)['state'], { transform: typeof negate }> = 1
    assertBool

    expect(bool.state.transform).toBe(negate)
  })

  test('returns transformed boolean (method)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean().transform(negate)

    const assertBool: A.Contains<(typeof bool)['state'], { transform: typeof negate }> = 1
    assertBool

    expect(bool.state.transform).toBe(negate)
  })

  test('returns defaulted boolean (method)', () => {
    const invalidBool = boolean()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    const superInvalidCall = () => invalidBool.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    boolean()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const boolA = boolean().keyDefault(true)
    const boolB = boolean().putDefault(true)
    const returnTrue = () => true
    const boolC = boolean().updateDefault(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['state'], { keyDefault: unknown }> = 1
    assertBoolA

    expect(boolA.state.keyDefault).toBe(true)

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putDefault: unknown }> = 1
    assertBoolB

    expect(boolB.state.putDefault).toBe(true)

    const assertBoolC: A.Contains<(typeof boolC)['state'], { updateDefault: unknown }> = 1
    assertBoolC

    expect(boolC.state.updateDefault).toBe(returnTrue)
  })

  test('returns boolean with PUT default value if it is not key (default shorthand)', () => {
    const bool = boolean().default(true)

    const assertBool: A.Contains<(typeof bool)['state'], { putDefault: unknown }> = 1
    assertBool

    expect(bool.state.putDefault).toBe(true)
  })

  test('returns boolean with KEY default value if it is key (default shorthand)', () => {
    const bool = boolean().key().default(true)

    const assertBool: A.Contains<(typeof bool)['state'], { keyDefault: unknown }> = 1
    assertBool

    expect(bool.state.keyDefault).toBe(true)
  })

  test('default with enum values', () => {
    const invalidBool = boolean().enum(true).default(
      // @ts-expect-error
      false
    )

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const superInvalidCall = () => invalidBool.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const boolA = boolean().enum(true).default(true)
    const returnTrue = (): true => true
    const boolB = boolean().enum(true).default(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['state'], { putDefault: unknown; enum: [true] }> =
      1
    assertBoolA

    expect(boolA.state.putDefault).toBe(true)
    expect(boolA.state.enum).toStrictEqual([true])

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putDefault: unknown; enum: [true] }> =
      1
    assertBoolB

    expect(boolB.state.putDefault).toBe(returnTrue)
    expect(boolB.state.enum).toStrictEqual([true])
  })

  test('returns boolean with constant value (method)', () => {
    const invalidBool = boolean().const(
      // @ts-expect-error
      'foo'
    )

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const superInvalidCall = () => invalidBool.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyNum = boolean().const(true)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)['state'],
      { enum: [true]; putDefault: unknown }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum.state.enum).toStrictEqual([true])
    expect(nonKeyNum.state.putDefault).toBe(true)

    const keyNum = boolean().key().const(true)

    const assertKeyNum: A.Contains<
      (typeof keyNum)['state'],
      { enum: [true]; keyDefault: unknown }
    > = 1
    assertKeyNum

    expect(keyNum.state.enum).toStrictEqual([true])
    expect(keyNum.state.keyDefault).toBe(true)
  })

  test('returns linked boolean (method)', () => {
    const returnTrue = () => true
    const boolA = boolean().keyLink(returnTrue)
    const boolB = boolean().putLink(returnTrue)
    const boolC = boolean().updateLink(returnTrue)

    const assertBoolA: A.Contains<(typeof boolA)['state'], { keyLink: unknown }> = 1
    assertBoolA

    expect(boolA.state.keyLink).toBe(returnTrue)

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putLink: unknown }> = 1
    assertBoolB

    expect(boolB.state.putLink).toBe(returnTrue)

    const assertBoolC: A.Contains<(typeof boolC)['state'], { updateLink: unknown }> = 1
    assertBoolC

    expect(boolC.state.updateLink).toBe(returnTrue)
  })

  test('returns boolean with PUT linked value if it is not key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().link(returnTrue)

    const assertBool: A.Contains<(typeof bool)['state'], { putLink: unknown }> = 1
    assertBool

    expect(bool.state.putLink).toBe(returnTrue)
  })

  test('returns boolean with KEY linked value if it is key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().key().link(returnTrue)

    const assertBool: A.Contains<(typeof bool)['state'], { keyLink: unknown }> = 1
    assertBool

    expect(bool.state.keyLink).toBe(returnTrue)
  })

  test('returns boolean with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const boolA = boolean({ keyValidator: pass })
    const boolB = boolean({ putValidator: pass })
    const boolC = boolean({ updateValidator: pass })

    const assertBoolA: A.Contains<(typeof boolA)['state'], { keyValidator: Validator }> = 1
    assertBoolA

    expect(boolA.state.keyValidator).toBe(pass)

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putValidator: Validator }> = 1
    assertBoolB

    expect(boolB.state.putValidator).toBe(pass)

    const assertBoolC: A.Contains<(typeof boolC)['state'], { updateValidator: Validator }> = 1
    assertBoolC

    expect(boolC.state.updateValidator).toBe(pass)
  })

  test('returns boolean with validator (method)', () => {
    const pass = () => true

    const boolA = boolean().keyValidate(pass)
    const boolB = boolean().putValidate(pass)
    const boolC = boolean().updateValidate(pass)

    const assertBoolA: A.Contains<(typeof boolA)['state'], { keyValidator: Validator }> = 1
    assertBoolA

    expect(boolA.state.keyValidator).toBe(pass)

    const assertBoolB: A.Contains<(typeof boolB)['state'], { putValidator: Validator }> = 1
    assertBoolB

    expect(boolB.state.putValidator).toBe(pass)

    const assertBoolC: A.Contains<(typeof boolC)['state'], { updateValidator: Validator }> = 1
    assertBoolC

    expect(boolC.state.updateValidator).toBe(pass)

    const prevNum = boolean()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [boolean, FreezeBooleanAttribute<typeof prevNum>]> = 1
      assertArgs

      return true
    })

    const prevOptNum = boolean().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [boolean, FreezeBooleanAttribute<typeof prevOptNum>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns boolean with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const bool = boolean().validate(pass)

    const assertBool: A.Contains<(typeof bool)['state'], { putValidator: Validator }> = 1
    assertBool

    expect(bool.state.putValidator).toBe(pass)
  })

  test('returns boolean with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const bool = boolean().key().validate(pass)

    const assertBool: A.Contains<(typeof bool)['state'], { keyValidator: Validator }> = 1
    assertBool

    expect(bool.state.keyValidator).toBe(pass)
  })
})
