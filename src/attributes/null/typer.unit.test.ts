import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeNullAttribute } from './freeze.js'
import type { NullAttribute, NullSchema } from './interface.js'
import { nul } from './typer.js'

const path = 'some.path'

describe('null', () => {
  test('returns default null', () => {
    const nil = nul()

    const assertType: A.Equals<(typeof nil)['type'], 'null'> = 1
    assertType
    expect(nil.type).toBe('null')

    const assertState: A.Equals<(typeof nil)['state'], {}> = 1
    assertState
    expect(nil.state).toStrictEqual({})

    const assertExtends: A.Extends<typeof nil, NullSchema> = 1
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
      (typeof nullAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)['state'], { required: Never }> = 1
    assertNever

    expect(nullAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(nullAlways.state.required).toBe('always')
    expect(nullNever.state.required).toBe('never')
  })

  test('returns required null (method)', () => {
    const nullAtLeastOnce = nul().required()
    const nullAlways = nul().required('always')
    const nullNever = nul().required('never')
    const numOpt = nul().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof nullAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(nullAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(nullAlways.state.required).toBe('always')
    expect(nullNever.state.required).toBe('never')
    expect(numOpt.state.required).toBe('never')
  })

  test('returns hidden null (option)', () => {
    const nil = nul({ hidden: true })

    const assertNull: A.Contains<(typeof nil)['state'], { hidden: true }> = 1
    assertNull

    expect(nil.state.hidden).toBe(true)
  })

  test('returns hidden null (method)', () => {
    const nil = nul().hidden()

    const assertNull: A.Contains<(typeof nil)['state'], { hidden: true }> = 1
    assertNull

    expect(nil.state.hidden).toBe(true)
  })

  test('returns key null (option)', () => {
    const nil = nul({ key: true })

    const assertNull: A.Contains<(typeof nil)['state'], { key: true }> = 1
    assertNull

    expect(nil.state.key).toBe(true)
  })

  test('returns key null (method)', () => {
    const nil = nul().key()

    const assertNull: A.Contains<(typeof nil)['state'], { key: true; required: Always }> = 1
    assertNull

    expect(nil.state.key).toBe(true)
    expect(nil.state.required).toBe('always')
  })

  test('returns savedAs null (option)', () => {
    const nil = nul({ savedAs: 'foo' })

    const assertNull: A.Contains<(typeof nil)['state'], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil.state.savedAs).toBe('foo')
  })

  test('returns savedAs null (method)', () => {
    const nil = nul().savedAs('foo')

    const assertNull: A.Contains<(typeof nil)['state'], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil.state.savedAs).toBe('foo')
  })

  test('returns defaulted null (option)', () => {
    const invalidNull = nul({
      // TOIMPROVE: add type constraints here
      putDefault: 'foo'
    })

    const invalidCall = () => invalidNull.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    const superInvalidCall = () => invalidNull.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    nul({
      // TOIMPROVE: add type constraints here
      updateDefault: () => 42
    })

    const nullA = nul({ keyDefault: null })
    const nullB = nul({ putDefault: null })
    const returnNull = () => null
    const nullC = nul({ updateDefault: returnNull })

    const assertNullA: A.Contains<(typeof nullA)['state'], { keyDefault: null }> = 1
    assertNullA

    expect(nullA.state.keyDefault).toBe(null)

    const assertNullB: A.Contains<(typeof nullB)['state'], { putDefault: null }> = 1
    assertNullB

    expect(nullB.state.putDefault).toBe(null)

    const assertNullC: A.Contains<(typeof nullC)['state'], { updateDefault: () => null }> = 1
    assertNullC

    expect(nullC.state.updateDefault).toBe(returnNull)
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

    const superInvalidCall = () => invalidNull.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitiveAttribute.invalidDefaultValueType', path })
    )

    nul()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const nullA = nul().keyDefault(null)
    const nullB = nul().putDefault(null)
    const returnNull = () => null
    const nullC = nul().updateDefault(returnNull)

    const assertNullA: A.Contains<(typeof nullA)['state'], { keyDefault: unknown }> = 1
    assertNullA

    expect(nullA.state.keyDefault).toBe(null)

    const assertNullB: A.Contains<(typeof nullB)['state'], { putDefault: unknown }> = 1
    assertNullB

    expect(nullB.state.putDefault).toBe(null)

    const assertNullC: A.Contains<(typeof nullC)['state'], { updateDefault: unknown }> = 1
    assertNullC

    expect(nullC.state.updateDefault).toBe(returnNull)
  })

  test('returns null with PUT default value if it is not key (default shorthand)', () => {
    const nil = nul().default(null)

    const assertNull: A.Contains<(typeof nil)['state'], { putDefault: unknown }> = 1
    assertNull

    expect(nil.state.putDefault).toBe(null)
  })

  test('returns null with KEY default value if it is key (default shorthand)', () => {
    const nil = nul().key().default(null)

    const assertNull: A.Contains<(typeof nil)['state'], { keyDefault: unknown }> = 1
    assertNull

    expect(nil.state.keyDefault).toBe(null)
  })

  test('returns linked null (method)', () => {
    const returnNull = () => null
    const nullA = nul().keyLink(returnNull)
    const nullB = nul().putLink(returnNull)
    const nullC = nul().updateLink(returnNull)

    const assertNullA: A.Contains<(typeof nullA)['state'], { keyLink: unknown }> = 1
    assertNullA

    expect(nullA.state.keyLink).toBe(returnNull)

    const assertNullB: A.Contains<(typeof nullB)['state'], { putLink: unknown }> = 1
    assertNullB

    expect(nullB.state.putLink).toBe(returnNull)

    const assertNullC: A.Contains<(typeof nullC)['state'], { updateLink: unknown }> = 1
    assertNullC

    expect(nullC.state.updateLink).toBe(returnNull)
  })

  test('returns null with PUT linked value if it is not key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().link(returnNull)

    const assertNull: A.Contains<(typeof nil)['state'], { putLink: unknown }> = 1
    assertNull

    expect(nil.state.putLink).toBe(returnNull)
  })

  test('returns null with KEY linked value if it is key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().key().link(returnNull)

    const assertNull: A.Contains<(typeof nil)['state'], { keyLink: unknown }> = 1
    assertNull

    expect(nil.state.keyLink).toBe(returnNull)
  })

  test('returns null with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const nullA = nul({ keyValidator: pass })
    const nullB = nul({ putValidator: pass })
    const nullC = nul({ updateValidator: pass })

    const assertNullA: A.Contains<(typeof nullA)['state'], { keyValidator: Validator }> = 1
    assertNullA

    expect(nullA.state.keyValidator).toBe(pass)

    const assertNullB: A.Contains<(typeof nullB)['state'], { putValidator: Validator }> = 1
    assertNullB

    expect(nullB.state.putValidator).toBe(pass)

    const assertNullC: A.Contains<(typeof nullC)['state'], { updateValidator: Validator }> = 1
    assertNullC

    expect(nullC.state.updateValidator).toBe(pass)
  })

  test('returns null with validator (method)', () => {
    const pass = () => true

    const nullA = nul().keyValidate(pass)
    const nullB = nul().putValidate(pass)
    const nullC = nul().updateValidate(pass)

    const assertNullA: A.Contains<(typeof nullA)['state'], { keyValidator: Validator }> = 1
    assertNullA

    expect(nullA.state.keyValidator).toBe(pass)

    const assertNullB: A.Contains<(typeof nullB)['state'], { putValidator: Validator }> = 1
    assertNullB

    expect(nullB.state.putValidator).toBe(pass)

    const assertNullC: A.Contains<(typeof nullC)['state'], { updateValidator: Validator }> = 1
    assertNullC

    expect(nullC.state.updateValidator).toBe(pass)

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

    const assertNull: A.Contains<(typeof nil)['state'], { putValidator: Validator }> = 1
    assertNull

    expect(nil.state.putValidator).toBe(pass)
  })

  test('returns null with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const nil = nul().key().validate(pass)

    const assertNull: A.Contains<(typeof nil)['state'], { keyValidator: Validator }> = 1
    assertNull

    expect(nil.state.keyValidator).toBe(pass)
  })
})
