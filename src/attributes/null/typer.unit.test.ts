import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNullAttribute } from './freeze.js'
import type { $NullAttributeState, NullAttribute } from './interface.js'
import { nul } from './typer.js'

const path = 'some.path'

describe('null', () => {
  test('returns default null', () => {
    const nil = nul()

    const assertType: A.Equals<(typeof nil)[$type], 'null'> = 1
    assertType
    expect(nil[$type]).toBe('null')

    const assertState: A.Equals<
      (typeof nil)[$state],
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
    expect(nil[$state]).toStrictEqual({
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

    const assertExtends: A.Extends<typeof nil, $NullAttributeState> = 1
    assertExtends

    const frozenNull = nil.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenNull, NullAttribute> = 1
    assertFrozenExtends
  })

  test('returns required null (option)', () => {
    const nullAtLeastOnce = nul({ required: 'atLeastOnce' })
    const nullAlways = nul({ required: 'always' })
    const nullNever = nul({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof nullAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)[$state], { required: Never }> = 1
    assertNever

    expect(nullAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(nullAlways[$state].required).toBe('always')
    expect(nullNever[$state].required).toBe('never')
  })

  test('returns required null (method)', () => {
    const nullAtLeastOnce = nul().required()
    const nullAlways = nul().required('always')
    const nullNever = nul().required('never')
    const numOpt = nul().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof nullAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(nullAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(nullAlways[$state].required).toBe('always')
    expect(nullNever[$state].required).toBe('never')
    expect(numOpt[$state].required).toBe('never')
  })

  test('returns hidden null (option)', () => {
    const nil = nul({ hidden: true })

    const assertNull: A.Contains<(typeof nil)[$state], { hidden: true }> = 1
    assertNull

    expect(nil[$state].hidden).toBe(true)
  })

  test('returns hidden null (method)', () => {
    const nil = nul().hidden()

    const assertNull: A.Contains<(typeof nil)[$state], { hidden: true }> = 1
    assertNull

    expect(nil[$state].hidden).toBe(true)
  })

  test('returns key null (option)', () => {
    const nil = nul({ key: true })

    const assertNull: A.Contains<(typeof nil)[$state], { key: true; required: AtLeastOnce }> = 1
    assertNull

    expect(nil[$state].key).toBe(true)
    expect(nil[$state].required).toBe('atLeastOnce')
  })

  test('returns key null (method)', () => {
    const nil = nul().key()

    const assertNull: A.Contains<(typeof nil)[$state], { key: true; required: Always }> = 1
    assertNull

    expect(nil[$state].key).toBe(true)
    expect(nil[$state].required).toBe('always')
  })

  test('returns savedAs null (option)', () => {
    const nil = nul({ savedAs: 'foo' })

    const assertNull: A.Contains<(typeof nil)[$state], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil[$state].savedAs).toBe('foo')
  })

  test('returns savedAs null (method)', () => {
    const nil = nul().savedAs('foo')

    const assertNull: A.Contains<(typeof nil)[$state], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil[$state].savedAs).toBe('foo')
  })

  test('returns defaulted null (option)', () => {
    const invalidNull = nul({
      // TOIMPROVE: add type constraints here
      defaults: { put: 'foo', update: undefined, key: undefined }
    })

    const invalidCall = () => invalidNull.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    nul({
      defaults: {
        key: undefined,
        put: undefined,
        // TOIMPROVE: add type constraints here
        update: () => 42
      }
    })

    const nullA = nul({ defaults: { key: null, put: undefined, update: undefined } })
    const nullB = nul({ defaults: { key: undefined, put: null, update: undefined } })
    const returnNull = () => null
    const nullC = nul({ defaults: { key: undefined, put: undefined, update: returnNull } })

    const assertNullA: A.Contains<
      (typeof nullA)[$state],
      { defaults: { key: null; put: undefined; update: undefined } }
    > = 1
    assertNullA

    expect(nullA[$state].defaults).toStrictEqual({
      key: null,
      put: undefined,
      update: undefined
    })

    const assertNullB: A.Contains<
      (typeof nullB)[$state],
      { defaults: { key: undefined; put: null; update: undefined } }
    > = 1
    assertNullB

    expect(nullB[$state].defaults).toStrictEqual({
      key: undefined,
      put: null,
      update: undefined
    })

    const assertNullC: A.Contains<
      (typeof nullC)[$state],
      { defaults: { key: undefined; put: undefined; update: () => null } }
    > = 1
    assertNullC

    expect(nullC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNull
    })
  })

  test('returns defaulted null (method)', () => {
    const invalidNull = nul()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCall = () => invalidNull.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    nul()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const nullA = nul().keyDefault(null)
    const nullB = nul().putDefault(null)
    const returnNull = () => null
    const nullC = nul().updateDefault(returnNull)

    const assertNullA: A.Contains<
      (typeof nullA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNullA

    expect(nullA[$state].defaults).toStrictEqual({
      key: null,
      put: undefined,
      update: undefined
    })

    const assertNullB: A.Contains<
      (typeof nullB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNullB

    expect(nullB[$state].defaults).toStrictEqual({
      key: undefined,
      put: null,
      update: undefined
    })

    const assertNullC: A.Contains<
      (typeof nullC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertNullC

    expect(nullC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNull
    })
  })

  test('returns null with PUT default value if it is not key (default shorthand)', () => {
    const nil = nul().default(null)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].defaults).toStrictEqual({
      key: undefined,
      put: null,
      update: undefined
    })
  })

  test('returns null with KEY default value if it is key (default shorthand)', () => {
    const nil = nul().key().default(null)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].defaults).toStrictEqual({
      key: null,
      put: undefined,
      update: undefined
    })
  })

  test('returns linked null (method)', () => {
    const returnNull = () => null
    const nullA = nul().keyLink(returnNull)
    const nullB = nul().putLink(returnNull)
    const nullC = nul().updateLink(returnNull)

    const assertNullA: A.Contains<
      (typeof nullA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNullA

    expect(nullA[$state].links).toStrictEqual({
      key: returnNull,
      put: undefined,
      update: undefined
    })

    const assertNullB: A.Contains<
      (typeof nullB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNullB

    expect(nullB[$state].links).toStrictEqual({
      key: undefined,
      put: returnNull,
      update: undefined
    })

    const assertNullC: A.Contains<
      (typeof nullC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertNullC

    expect(nullC[$state].links).toStrictEqual({
      key: undefined,
      put: undefined,
      update: returnNull
    })
  })

  test('returns null with PUT linked value if it is not key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().link(returnNull)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].links).toStrictEqual({
      key: undefined,
      put: returnNull,
      update: undefined
    })
  })

  test('returns null with KEY linked value if it is key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().key().link(returnNull)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].links).toStrictEqual({
      key: returnNull,
      put: undefined,
      update: undefined
    })
  })

  test('returns null with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const nullA = nul({ validators: { key: pass, put: undefined, update: undefined } })
    const nullB = nul({ validators: { key: undefined, put: pass, update: undefined } })
    const nullC = nul({ validators: { key: undefined, put: undefined, update: pass } })

    const assertNullA: A.Contains<
      (typeof nullA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNullA

    expect(nullA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertNullB: A.Contains<
      (typeof nullB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNullB

    expect(nullB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertNullC: A.Contains<
      (typeof nullC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertNullC

    expect(nullC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns null with validator (method)', () => {
    const pass = () => true

    const nullA = nul().keyValidate(pass)
    const nullB = nul().putValidate(pass)
    const nullC = nul().updateValidate(pass)

    const assertNullA: A.Contains<
      (typeof nullA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNullA

    expect(nullA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertNullB: A.Contains<
      (typeof nullB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNullB

    expect(nullB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertNullC: A.Contains<
      (typeof nullC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertNullC

    expect(nullC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

    const prevNum = nul()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [null, FreezeNullAttribute<typeof prevNum>]> = 1
      assertArgs

      return true
    })

    const prevOptNum = nul().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [null, FreezeNullAttribute<typeof prevOptNum>]> = 1
      assertArgs

      return true
    })
  })

  test('returns null with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const nil = nul().validate(pass)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns null with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const nil = nul().key().validate(pass)

    const assertNull: A.Contains<
      (typeof nil)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertNull

    expect(nil[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })
})
