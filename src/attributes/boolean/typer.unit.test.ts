import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeBooleanAttribute } from './freeze.js'
import type { $BooleanAttributeState, BooleanAttribute } from './interface.js'
import { boolean } from './typer.js'

const path = 'some.path'

describe('boolean', () => {
  test('returns default boolean', () => {
    const bool = boolean()

    const assertType: A.Equals<(typeof bool)[$type], 'boolean'> = 1
    assertType
    expect(bool[$type]).toBe('boolean')

    const assertState: A.Equals<
      (typeof bool)[$state],
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
    expect(bool[$state]).toStrictEqual({
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

    const assertExtends: A.Extends<typeof bool, $BooleanAttributeState> = 1
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
      (typeof boolAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)[$state], { required: Never }> = 1
    assertNever

    expect(boolAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(boolAlways[$state].required).toBe('always')
    expect(boolNever[$state].required).toBe('never')
  })

  test('returns required boolean (method)', () => {
    const boolAtLeastOnce = boolean().required()
    const boolAlways = boolean().required('always')
    const boolNever = boolean().required('never')
    const numOpt = boolean().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof boolAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof boolAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof boolNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(boolAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(boolAlways[$state].required).toBe('always')
    expect(boolNever[$state].required).toBe('never')
    expect(numOpt[$state].required).toBe('never')
  })

  test('returns hidden boolean (option)', () => {
    const bool = boolean({ hidden: true })

    const assertBool: A.Contains<(typeof bool)[$state], { hidden: true }> = 1
    assertBool

    expect(bool[$state].hidden).toBe(true)
  })

  test('returns hidden boolean (method)', () => {
    const bool = boolean().hidden()

    const assertBool: A.Contains<(typeof bool)[$state], { hidden: true }> = 1
    assertBool

    expect(bool[$state].hidden).toBe(true)
  })

  test('returns key boolean (option)', () => {
    const bool = boolean({ key: true })

    const assertBool: A.Contains<(typeof bool)[$state], { key: true; required: AtLeastOnce }> = 1
    assertBool

    expect(bool[$state].key).toBe(true)
    expect(bool[$state].required).toBe('atLeastOnce')
  })

  test('returns key boolean (method)', () => {
    const bool = boolean().key()

    const assertBool: A.Contains<(typeof bool)[$state], { key: true; required: Always }> = 1
    assertBool

    expect(bool[$state].key).toBe(true)
    expect(bool[$state].required).toBe('always')
  })

  test('returns savedAs boolean (option)', () => {
    const bool = boolean({ savedAs: 'foo' })

    const assertBool: A.Contains<(typeof bool)[$state], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool[$state].savedAs).toBe('foo')
  })

  test('returns savedAs boolean (method)', () => {
    const bool = boolean().savedAs('foo')

    const assertBool: A.Contains<(typeof bool)[$state], { savedAs: 'foo' }> = 1
    assertBool

    expect(bool[$state].savedAs).toBe('foo')
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

    const bool = boolean().enum(true)

    const assertBool: A.Contains<(typeof bool)[$state], { enum: [true] }> = 1
    assertBool

    expect(bool[$state].enum).toStrictEqual([true])
  })

  test('returns defaulted boolean (option)', () => {
    const invalidBool = boolean({
      // TOIMPROVE: add type constraints here
      defaults: { put: 42, update: undefined, key: undefined }
    })

    const invalidCall = () => invalidBool.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    boolean({
      defaults: {
        key: undefined,
        put: undefined,
        // TOIMPROVE: add type constraints here
        update: () => 42
      }
    })

    const boolA = boolean({ defaults: { key: true, put: undefined, update: undefined } })
    const boolB = boolean({ defaults: { key: undefined, put: true, update: undefined } })
    const returnTrue = () => true
    const boolC = boolean({ defaults: { key: undefined, put: undefined, update: returnTrue } })

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { defaults: { key: boolean; put: undefined; update: undefined } }
    > = 1
    assertBoolA

    expect(boolA[$state].defaults).toStrictEqual({
      key: true,
      put: undefined,
      update: undefined
    })

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { defaults: { key: undefined; put: boolean; update: undefined } }
    > = 1
    assertBoolB

    expect(boolB[$state].defaults).toStrictEqual({
      key: undefined,
      put: true,
      update: undefined
    })

    const assertBoolC: A.Contains<
      (typeof boolC)[$state],
      { defaults: { key: undefined; put: undefined; update: () => boolean } }
    > = 1
    assertBoolC

    expect(boolC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnTrue
    })
  })

  test('returns transformed boolean (option)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean({ transform: negate })

    const assertBool: A.Contains<(typeof bool)[$state], { transform: typeof negate }> = 1
    assertBool

    expect(bool[$state].transform).toBe(negate)
  })

  test('returns transformed boolean (method)', () => {
    const negate = {
      encode: (input: boolean) => !input,
      decode: (saved: boolean) => !saved
    }

    const bool = boolean().transform(negate)

    const assertBool: A.Contains<(typeof bool)[$state], { transform: typeof negate }> = 1
    assertBool

    expect(bool[$state].transform).toBe(negate)
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

    boolean()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const boolA = boolean().keyDefault(true)
    const boolB = boolean().putDefault(true)
    const returnTrue = () => true
    const boolC = boolean().updateDefault(returnTrue)

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBoolA

    expect(boolA[$state].defaults).toStrictEqual({
      key: true,
      put: undefined,
      update: undefined
    })

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBoolB

    expect(boolB[$state].defaults).toStrictEqual({
      key: undefined,
      put: true,
      update: undefined
    })

    const assertBoolC: A.Contains<
      (typeof boolC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertBoolC

    expect(boolC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnTrue
    })
  })

  test('returns boolean with PUT default value if it is not key (default shorthand)', () => {
    const bool = boolean().default(true)

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].defaults).toStrictEqual({
      key: undefined,
      put: true,
      update: undefined
    })
  })

  test('returns boolean with KEY default value if it is key (default shorthand)', () => {
    const bool = boolean().key().default(true)

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].defaults).toStrictEqual({
      key: true,
      put: undefined,
      update: undefined
    })
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

    const boolA = boolean().enum(true).default(true)
    const returnTrue = (): true => true
    const boolB = boolean().enum(true).default(returnTrue)

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { defaults: { put: unknown }; enum: [true] }
    > = 1
    assertBoolA

    expect(boolA[$state].defaults).toMatchObject({ put: true })
    expect(boolA[$state].enum).toStrictEqual([true])

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { defaults: { put: unknown }; enum: [true] }
    > = 1
    assertBoolB

    expect(boolB[$state].defaults).toMatchObject({ put: returnTrue })
    expect(boolB[$state].enum).toStrictEqual([true])
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

    const nonKeyNum = boolean().const(true)

    const assertNonKeyNum: A.Contains<
      (typeof nonKeyNum)[$state],
      { enum: [true]; defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNonKeyNum

    expect(nonKeyNum[$state].enum).toStrictEqual([true])
    expect(nonKeyNum[$state].defaults).toStrictEqual({
      key: undefined,
      put: true,
      update: undefined
    })

    const keyNum = boolean().key().const(true)

    const assertKeyNum: A.Contains<
      (typeof keyNum)[$state],
      { enum: [true]; defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertKeyNum

    expect(keyNum[$state].enum).toStrictEqual([true])
    expect(keyNum[$state].defaults).toStrictEqual({
      key: true,
      put: undefined,
      update: undefined
    })
  })

  test('returns linked boolean (method)', () => {
    const returnTrue = () => true
    const boolA = boolean().keyLink(returnTrue)
    const boolB = boolean().putLink(returnTrue)
    const boolC = boolean().updateLink(returnTrue)

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBoolA

    expect(boolA[$state].links).toStrictEqual({
      key: returnTrue,
      put: undefined,
      update: undefined
    })

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBoolB

    expect(boolB[$state].links).toStrictEqual({
      key: undefined,
      put: returnTrue,
      update: undefined
    })

    const assertBoolC: A.Contains<
      (typeof boolC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertBoolC

    expect(boolC[$state].links).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnTrue
    })
  })

  test('returns boolean with PUT linked value if it is not key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().link(returnTrue)

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].links).toStrictEqual({
      key: undefined,
      put: returnTrue,
      update: undefined
    })
  })

  test('returns boolean with KEY linked value if it is key (link shorthand)', () => {
    const returnTrue = () => true
    const bool = boolean().key().link(returnTrue)

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].links).toStrictEqual({
      key: returnTrue,
      put: undefined,
      update: undefined
    })
  })

  test('returns boolean with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const boolA = boolean({ validators: { key: pass, put: undefined, update: undefined } })
    const boolB = boolean({ validators: { key: undefined, put: pass, update: undefined } })
    const boolC = boolean({ validators: { key: undefined, put: undefined, update: pass } })

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBoolA

    expect(boolA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBoolB

    expect(boolB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertBoolC: A.Contains<
      (typeof boolC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertBoolC

    expect(boolC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns boolean with validator (method)', () => {
    const pass = () => true

    const boolA = boolean().keyValidate(pass)
    const boolB = boolean().putValidate(pass)
    const boolC = boolean().updateValidate(pass)

    const assertBoolA: A.Contains<
      (typeof boolA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBoolA

    expect(boolA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertBoolB: A.Contains<
      (typeof boolB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBoolB

    expect(boolB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertBoolC: A.Contains<
      (typeof boolC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertBoolC

    expect(boolC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

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

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns boolean with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const bool = boolean().key().validate(pass)

    const assertBool: A.Contains<
      (typeof bool)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBool

    expect(bool[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })
})
