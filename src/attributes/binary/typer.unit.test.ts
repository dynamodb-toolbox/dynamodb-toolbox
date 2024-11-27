import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeBinaryAttribute } from './freeze.js'
import type { $BinaryAttributeState, BinaryAttribute } from './interface.js'
import { binary } from './typer.js'

const path = 'some.path'

describe('binary', () => {
  test('returns default binary', () => {
    const bin = binary()

    const assertType: A.Equals<(typeof bin)[$type], 'binary'> = 1
    assertType
    expect(bin[$type]).toBe('binary')

    const assertState: A.Equals<
      (typeof bin)[$state],
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
    expect(bin[$state]).toStrictEqual({
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

    const assertExtends: A.Extends<typeof bin, $BinaryAttributeState> = 1
    assertExtends

    const frozenBin = bin.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenBin, BinaryAttribute> = 1
    assertFrozenExtends
  })

  test('returns required binary (option)', () => {
    const binAtLeastOnce = binary({ required: 'atLeastOnce' })
    const binAlways = binary({ required: 'always' })
    const binNever = binary({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof binAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof binAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof binNever)[$state], { required: Never }> = 1
    assertNever

    expect(binAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(binAlways[$state].required).toBe('always')
    expect(binNever[$state].required).toBe('never')
  })

  test('returns required binary (method)', () => {
    const binAtLeastOnce = binary().required()
    const binAlways = binary().required('always')
    const binNever = binary().required('never')
    const binOpt = binary().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof binAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof binAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof binNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof binOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(binAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(binAlways[$state].required).toBe('always')
    expect(binNever[$state].required).toBe('never')
    expect(binOpt[$state].required).toBe('never')
  })

  test('returns hidden binary (option)', () => {
    const bin = binary({ hidden: true })

    const assertBin: A.Contains<(typeof bin)[$state], { hidden: true }> = 1
    assertBin

    expect(bin[$state].hidden).toBe(true)
  })

  test('returns hidden binary (method)', () => {
    const bin = binary().hidden()

    const assertBin: A.Contains<(typeof bin)[$state], { hidden: true }> = 1
    assertBin

    expect(bin[$state].hidden).toBe(true)
  })

  test('returns key binary (option)', () => {
    const bin = binary({ key: true })

    const assertBin: A.Contains<(typeof bin)[$state], { key: true; required: AtLeastOnce }> = 1
    assertBin

    expect(bin[$state].key).toBe(true)
    expect(bin[$state].required).toBe('atLeastOnce')
  })

  test('returns key binary (method)', () => {
    const bin = binary().key()

    const assertBin: A.Contains<(typeof bin)[$state], { key: true; required: Always }> = 1
    assertBin

    expect(bin[$state].key).toBe(true)
    expect(bin[$state].required).toBe('always')
  })

  test('returns savedAs binary (option)', () => {
    const bin = binary({ savedAs: 'foo' })

    const assertBin: A.Contains<(typeof bin)[$state], { savedAs: 'foo' }> = 1
    assertBin

    expect(bin[$state].savedAs).toBe('foo')
  })

  test('returns savedAs binary (method)', () => {
    const bin = binary().savedAs('foo')

    const assertBin: A.Contains<(typeof bin)[$state], { savedAs: 'foo' }> = 1
    assertBin

    expect(bin[$state].savedAs).toBe('foo')
  })

  test('returns binary with enum values (method)', () => {
    const invalidBin = binary().enum(
      // @ts-expect-error
      42,
      new Uint8Array([1, 2, 3])
    )

    const invalidCall = () => invalidBin.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const bin = binary().enum(new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4]))

    const assertBin: A.Contains<(typeof bin)[$state], { enum: [Uint8Array, Uint8Array] }> = 1
    assertBin

    expect(bin[$state].enum).toStrictEqual([new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4])])
  })

  test('returns defaulted binary (option)', () => {
    const invalidBin = binary({
      // TOIMPROVE: add type constraints here
      defaults: { put: 42, update: undefined, key: undefined }
    })

    const invalidCall = () => invalidBin.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    binary({
      defaults: {
        key: undefined,
        put: undefined,
        // TOIMPROVE: add type constraints here
        update: () => 42
      }
    })

    const binA = binary({
      defaults: { key: new Uint8Array([1, 2, 3]), put: undefined, update: undefined }
    })
    const binB = binary({
      defaults: { key: undefined, put: new Uint8Array([1, 2, 3]), update: undefined }
    })
    const returnBin = () => new Uint8Array([1, 2, 3])
    const binC = binary({ defaults: { key: undefined, put: undefined, update: returnBin } })

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { defaults: { key: Uint8Array; put: undefined; update: undefined } }
    > = 1
    assertBinA

    expect(binA[$state].defaults).toStrictEqual({
      key: new Uint8Array([1, 2, 3]),
      put: undefined,
      update: undefined
    })

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { defaults: { key: undefined; put: Uint8Array; update: undefined } }
    > = 1
    assertBinB

    expect(binB[$state].defaults).toStrictEqual({
      key: undefined,
      put: new Uint8Array([1, 2, 3]),
      update: undefined
    })

    const assertBinC: A.Contains<
      (typeof binC)[$state],
      { defaults: { key: undefined; put: undefined; update: () => Uint8Array } }
    > = 1
    assertBinC

    expect(binC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnBin
    })
  })

  test('returns transformed binary (option)', () => {
    const PREFIX = new Uint8Array([1, 2, 3])

    const prefix = {
      parse: (input: Uint8Array) => {
        const concat = new Uint8Array(PREFIX.length + input.length)
        concat.set(PREFIX)
        concat.set(input, PREFIX.length)

        return concat
      },
      format: (saved: Uint8Array) => saved.slice(PREFIX.length)
    }

    const bin = binary({ transform: prefix })

    const assertBin: A.Contains<(typeof bin)[$state], { transform: typeof prefix }> = 1
    assertBin

    expect(bin[$state].transform).toBe(prefix)
  })

  test('returns transformed binary (method)', () => {
    const PREFIX = new Uint8Array([1, 2, 3])

    const prefix = {
      parse: (input: Uint8Array) => {
        const concat = new Uint8Array(PREFIX.length + input.length)
        concat.set(PREFIX)
        concat.set(input, PREFIX.length)

        return concat
      },
      format: (saved: Uint8Array) => saved.slice(PREFIX.length)
    }

    const bin = binary().transform(prefix)

    const assertBin: A.Contains<(typeof bin)[$state], { transform: typeof prefix }> = 1
    assertBin

    expect(bin[$state].transform).toBe(prefix)
  })

  test('returns defaulted binary (method)', () => {
    const invalidBin = binary()
      // @ts-expect-error
      .putDefault(42)

    const invalidCall = () => invalidBin.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    binary()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 42)

    const binA = binary().keyDefault(new Uint8Array([1, 2, 3]))
    const binB = binary().putDefault(new Uint8Array([1, 2, 3]))
    const returnBin = () => new Uint8Array([1, 2, 3])
    const binC = binary().updateDefault(returnBin)

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBinA

    expect(binA[$state].defaults).toStrictEqual({
      key: new Uint8Array([1, 2, 3]),
      put: undefined,
      update: undefined
    })

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBinB

    expect(binB[$state].defaults).toStrictEqual({
      key: undefined,
      put: new Uint8Array([1, 2, 3]),
      update: undefined
    })

    const assertBinC: A.Contains<
      (typeof binC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertBinC

    expect(binC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnBin
    })
  })

  test('returns binary with PUT default value if it is not key (default shorthand)', () => {
    const bin = binary().default(new Uint8Array([1, 2, 3]))

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].defaults).toStrictEqual({
      key: undefined,
      put: new Uint8Array([1, 2, 3]),
      update: undefined
    })
  })

  test('returns binary with KEY default value if it is key (default shorthand)', () => {
    const bin = binary()
      .key()
      .default(new Uint8Array([1, 2, 3]))

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].defaults).toStrictEqual({
      key: new Uint8Array([1, 2, 3]),
      put: undefined,
      update: undefined
    })
  })

  test('default with enum values', () => {
    const invalidBin = binary()
      .enum(new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4]))
      .default(new Uint8Array([3, 4, 5]))

    const invalidCall = () => invalidBin.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({
        code: 'schema.primitiveAttribute.invalidDefaultValueRange',
        path
      })
    )

    const bin = new Uint8Array([1, 2, 3])

    const binA = binary()
      .enum(bin, new Uint8Array([2, 3, 4]))
      .default(bin)
    const sayBin = (): typeof bin => bin
    const binB = binary()
      .enum(bin, new Uint8Array([2, 3, 4]))
      .default(sayBin)

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { defaults: { put: unknown }; enum: [Uint8Array, Uint8Array] }
    > = 1
    assertBinA

    expect(binA[$state].defaults).toMatchObject({ put: new Uint8Array([1, 2, 3]) })
    expect(binA[$state].enum).toStrictEqual([new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4])])

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { defaults: { put: unknown }; enum: [Uint8Array, Uint8Array] }
    > = 1
    assertBinB

    expect(binB[$state].defaults).toMatchObject({ put: sayBin })
    expect(binB[$state].enum).toStrictEqual([new Uint8Array([1, 2, 3]), new Uint8Array([2, 3, 4])])
  })

  test('returns binary with constant value (method)', () => {
    const invalidBin = binary().const(
      // @ts-expect-error
      42
    )

    const invalidCall = () => invalidBin.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidEnumValueType', path })
    )

    const nonKeyStr = binary().const(new Uint8Array([1, 2, 3]))

    const assertNonKeyStr: A.Contains<
      (typeof nonKeyStr)[$state],
      { enum: [Uint8Array]; defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNonKeyStr

    expect(nonKeyStr[$state].enum).toStrictEqual([new Uint8Array([1, 2, 3])])
    expect(nonKeyStr[$state].defaults).toStrictEqual({
      key: undefined,
      put: new Uint8Array([1, 2, 3]),
      update: undefined
    })

    const keyStr = binary()
      .key()
      .const(new Uint8Array([1, 2, 3]))

    const assertKeyStr: A.Contains<
      (typeof keyStr)[$state],
      { enum: [Uint8Array]; defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertKeyStr

    expect(keyStr[$state].enum).toStrictEqual([new Uint8Array([1, 2, 3])])
    expect(keyStr[$state].defaults).toStrictEqual({
      key: new Uint8Array([1, 2, 3]),
      put: undefined,
      update: undefined
    })
  })

  test('returns linked binary (method)', () => {
    const returnBin = () => new Uint8Array([1, 2, 3])
    const binA = binary().keyLink(returnBin)
    const binB = binary().putLink(returnBin)
    const binC = binary().updateLink(returnBin)

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBinA

    expect(binA[$state].links).toStrictEqual({ key: returnBin, put: undefined, update: undefined })

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBinB

    expect(binB[$state].links).toStrictEqual({ key: undefined, put: returnBin, update: undefined })

    const assertBinC: A.Contains<
      (typeof binC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertBinC

    expect(binC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: returnBin })
  })

  test('returns binary with PUT linked value if it is not key (link shorthand)', () => {
    const returnBin = () => new Uint8Array([1, 2, 3])
    const bin = binary().link(returnBin)

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].links).toStrictEqual({ key: undefined, put: returnBin, update: undefined })
  })

  test('returns binary with KEY linked value if it is key (link shorthand)', () => {
    const returnBin = () => new Uint8Array([1, 2, 3])
    const bin = binary().key().link(returnBin)

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].links).toStrictEqual({ key: returnBin, put: undefined, update: undefined })
  })

  test('returns binary with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const binA = binary({ validators: { key: pass, put: undefined, update: undefined } })
    const binB = binary({ validators: { key: undefined, put: pass, update: undefined } })
    const binC = binary({ validators: { key: undefined, put: undefined, update: pass } })

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBinA

    expect(binA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBinB

    expect(binB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertBinC: A.Contains<
      (typeof binC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertBinC

    expect(binC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns binary with validator (method)', () => {
    const pass = () => true

    const binA = binary().keyValidate(pass)
    const binB = binary().putValidate(pass)
    const binC = binary().updateValidate(pass)

    const assertBinA: A.Contains<
      (typeof binA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBinA

    expect(binA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertBinB: A.Contains<
      (typeof binB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBinB

    expect(binB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertBinC: A.Contains<
      (typeof binC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertBinC

    expect(binC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

    const prevBin = binary()
    prevBin.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [Uint8Array, FreezeBinaryAttribute<typeof prevBin>]> =
        1
      assertArgs

      return true
    })

    const prevOptBin = binary().optional()
    prevOptBin.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [Uint8Array, FreezeBinaryAttribute<typeof prevOptBin>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns binary with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const bin = binary().validate(pass)

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns binary with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const bin = binary().key().validate(pass)

    const assertBin: A.Contains<
      (typeof bin)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertBin

    expect(bin[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })
})
