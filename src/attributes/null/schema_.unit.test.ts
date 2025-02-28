import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Validator } from '../types/validator.js'
import type { NullSchema } from './schema.js'
import { nul } from './schema_.js'

const path = 'some.path'

describe('null', () => {
  test('returns default null', () => {
    const nil = nul()

    const assertType: A.Equals<(typeof nil)['type'], 'null'> = 1
    assertType
    expect(nil.type).toBe('null')

    const assertProps: A.Equals<(typeof nil)['props'], {}> = 1
    assertProps
    expect(nil.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof nil, NullSchema> = 1
    assertExtends
  })

  test('returns required null (option)', () => {
    const nullAtLeastOnce = nul({ required: 'atLeastOnce' })
    const nullAlways = nul({ required: 'always' })
    const nullNever = nul({ required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof nullAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)['props'], { required: Never }> = 1
    assertNever

    expect(nullAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(nullAlways.props.required).toBe('always')
    expect(nullNever.props.required).toBe('never')
  })

  test('returns required null (method)', () => {
    const nullAtLeastOnce = nul().required()
    const nullAlways = nul().required('always')
    const nullNever = nul().required('never')
    const numOpt = nul().optional()

    const assertAtLeastOnce: A.Contains<
      (typeof nullAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof nullAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof nullNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof numOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(nullAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(nullAlways.props.required).toBe('always')
    expect(nullNever.props.required).toBe('never')
    expect(numOpt.props.required).toBe('never')
  })

  test('returns hidden null (option)', () => {
    const nil = nul({ hidden: true })

    const assertNull: A.Contains<(typeof nil)['props'], { hidden: true }> = 1
    assertNull

    expect(nil.props.hidden).toBe(true)
  })

  test('returns hidden null (method)', () => {
    const nil = nul().hidden()

    const assertNull: A.Contains<(typeof nil)['props'], { hidden: true }> = 1
    assertNull

    expect(nil.props.hidden).toBe(true)
  })

  test('returns key null (option)', () => {
    const nil = nul({ key: true })

    const assertNull: A.Contains<(typeof nil)['props'], { key: true }> = 1
    assertNull

    expect(nil.props.key).toBe(true)
  })

  test('returns key null (method)', () => {
    const nil = nul().key()

    const assertNull: A.Contains<(typeof nil)['props'], { key: true; required: Always }> = 1
    assertNull

    expect(nil.props.key).toBe(true)
    expect(nil.props.required).toBe('always')
  })

  test('returns savedAs null (option)', () => {
    const nil = nul({ savedAs: 'foo' })

    const assertNull: A.Contains<(typeof nil)['props'], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil.props.savedAs).toBe('foo')
  })

  test('returns savedAs null (method)', () => {
    const nil = nul().savedAs('foo')

    const assertNull: A.Contains<(typeof nil)['props'], { savedAs: 'foo' }> = 1
    assertNull

    expect(nil.props.savedAs).toBe('foo')
  })

  test('returns defaulted null (option)', () => {
    const invalidNull = nul({
      // TOIMPROVE: add type constraints here
      putDefault: 'foo'
    })

    const invalidCall = () => invalidNull.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    nul({
      // TOIMPROVE: add type constraints here
      updateDefault: () => 42
    })

    const nullA = nul({ keyDefault: null })
    const nullB = nul({ putDefault: null })
    const returnNull = () => null
    const nullC = nul({ updateDefault: returnNull })

    const assertNullA: A.Contains<(typeof nullA)['props'], { keyDefault: null }> = 1
    assertNullA

    expect(nullA.props.keyDefault).toBe(null)

    const assertNullB: A.Contains<(typeof nullB)['props'], { putDefault: null }> = 1
    assertNullB

    expect(nullB.props.putDefault).toBe(null)

    const assertNullC: A.Contains<(typeof nullC)['props'], { updateDefault: () => null }> = 1
    assertNullC

    expect(nullC.props.updateDefault).toBe(returnNull)
  })

  test('returns defaulted null (method)', () => {
    const invalidNull = nul()
      // @ts-expect-error
      .putDefault('foo')

    const invalidCall = () => invalidNull.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.primitive.invalidDefaultValueType', path })
    )

    nul()
      // @ts-expect-error Unable to throw here (it would require executing the fn)
      .updateDefault(() => 'foo')

    const nullA = nul().keyDefault(null)
    const nullB = nul().putDefault(null)
    const returnNull = () => null
    const nullC = nul().updateDefault(returnNull)

    const assertNullA: A.Contains<(typeof nullA)['props'], { keyDefault: unknown }> = 1
    assertNullA

    expect(nullA.props.keyDefault).toBe(null)

    const assertNullB: A.Contains<(typeof nullB)['props'], { putDefault: unknown }> = 1
    assertNullB

    expect(nullB.props.putDefault).toBe(null)

    const assertNullC: A.Contains<(typeof nullC)['props'], { updateDefault: unknown }> = 1
    assertNullC

    expect(nullC.props.updateDefault).toBe(returnNull)
  })

  test('returns null with PUT default value if it is not key (default shorthand)', () => {
    const nil = nul().default(null)

    const assertNull: A.Contains<(typeof nil)['props'], { putDefault: unknown }> = 1
    assertNull

    expect(nil.props.putDefault).toBe(null)
  })

  test('returns null with KEY default value if it is key (default shorthand)', () => {
    const nil = nul().key().default(null)

    const assertNull: A.Contains<(typeof nil)['props'], { keyDefault: unknown }> = 1
    assertNull

    expect(nil.props.keyDefault).toBe(null)
  })

  test('returns linked null (method)', () => {
    const returnNull = () => null
    const nullA = nul().keyLink(returnNull)
    const nullB = nul().putLink(returnNull)
    const nullC = nul().updateLink(returnNull)

    const assertNullA: A.Contains<(typeof nullA)['props'], { keyLink: unknown }> = 1
    assertNullA

    expect(nullA.props.keyLink).toBe(returnNull)

    const assertNullB: A.Contains<(typeof nullB)['props'], { putLink: unknown }> = 1
    assertNullB

    expect(nullB.props.putLink).toBe(returnNull)

    const assertNullC: A.Contains<(typeof nullC)['props'], { updateLink: unknown }> = 1
    assertNullC

    expect(nullC.props.updateLink).toBe(returnNull)
  })

  test('returns null with PUT linked value if it is not key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().link(returnNull)

    const assertNull: A.Contains<(typeof nil)['props'], { putLink: unknown }> = 1
    assertNull

    expect(nil.props.putLink).toBe(returnNull)
  })

  test('returns null with KEY linked value if it is key (link shorthand)', () => {
    const returnNull = () => null
    const nil = nul().key().link(returnNull)

    const assertNull: A.Contains<(typeof nil)['props'], { keyLink: unknown }> = 1
    assertNull

    expect(nil.props.keyLink).toBe(returnNull)
  })

  test('returns null with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const nullA = nul({ keyValidator: pass })
    const nullB = nul({ putValidator: pass })
    const nullC = nul({ updateValidator: pass })

    const assertNullA: A.Contains<(typeof nullA)['props'], { keyValidator: Validator }> = 1
    assertNullA

    expect(nullA.props.keyValidator).toBe(pass)

    const assertNullB: A.Contains<(typeof nullB)['props'], { putValidator: Validator }> = 1
    assertNullB

    expect(nullB.props.putValidator).toBe(pass)

    const assertNullC: A.Contains<(typeof nullC)['props'], { updateValidator: Validator }> = 1
    assertNullC

    expect(nullC.props.updateValidator).toBe(pass)
  })

  test('returns null with validator (method)', () => {
    const pass = () => true

    const nullA = nul().keyValidate(pass)
    const nullB = nul().putValidate(pass)
    const nullC = nul().updateValidate(pass)

    const assertNullA: A.Contains<(typeof nullA)['props'], { keyValidator: Validator }> = 1
    assertNullA

    expect(nullA.props.keyValidator).toBe(pass)

    const assertNullB: A.Contains<(typeof nullB)['props'], { putValidator: Validator }> = 1
    assertNullB

    expect(nullB.props.putValidator).toBe(pass)

    const assertNullC: A.Contains<(typeof nullC)['props'], { updateValidator: Validator }> = 1
    assertNullC

    expect(nullC.props.updateValidator).toBe(pass)

    const prevNum = nul()
    prevNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [null, typeof prevNum]> = 1
      assertArgs

      return true
    })

    const prevOptNum = nul().optional()
    prevOptNum.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [null, typeof prevOptNum]> = 1
      assertArgs

      return true
    })
  })

  test('returns null with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const nil = nul().validate(pass)

    const assertNull: A.Contains<(typeof nil)['props'], { putValidator: Validator }> = 1
    assertNull

    expect(nil.props.putValidator).toBe(pass)
  })

  test('returns null with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const nil = nul().key().validate(pass)

    const assertNull: A.Contains<(typeof nil)['props'], { keyValidator: Validator }> = 1
    assertNull

    expect(nil.props.keyValidator).toBe(pass)
  })
})
