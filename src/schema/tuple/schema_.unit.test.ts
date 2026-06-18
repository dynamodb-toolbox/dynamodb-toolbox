import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { Light } from '../utils/light.js'
import type { TupleSchema } from './schema.js'
import { tuple } from './schema_.js'

describe('tuple', () => {
  const path = 'some.path'
  const str = string()

  test('rejects missing elements', () => {
    const invalidTuple = tuple()

    const invalidCall = () => invalidTuple.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.tuple.missingElements', path })
    )
  })

  test('rejects non-required elements', () => {
    const invalidTuple = tuple(
      str,
      // @ts-expect-error
      str.optional()
    )

    const invalidCall = () => invalidTuple.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.tuple.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidTuple = tuple(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const invalidCall = () => invalidTuple.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.tuple.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidTuple = tuple(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const invalidCall = () => invalidTuple.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.tuple.savedAsElements', path })
    )
  })

  test('returns default tuple', () => {
    const tupleSchema = tuple(str)

    const assertType: A.Equals<(typeof tupleSchema)['type'], 'tuple'> = 1
    assertType
    expect(tupleSchema.type).toBe('tuple')

    const assertElements: A.Equals<(typeof tupleSchema)['elements'], [Light<typeof str>]> = 1
    assertElements
    expect(tupleSchema.elements).toStrictEqual([str])

    const assertProps: A.Equals<(typeof tupleSchema)['props'], {}> = 1
    assertProps
    expect(tupleSchema.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof tupleSchema, TupleSchema> = 1
    assertExtends
  })

  // TODO: Reimplement props as potential first argument
  test('returns required tuple (method)', () => {
    const tupleAtLeastOnce = tuple(str).required()
    const tupleAlways = tuple(str).required('always')
    const tupleNever = tuple(str).required('never')
    const tupleOpt = tuple(str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof tupleAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof tupleAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof tupleNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof tupleOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(tupleAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(tupleAlways.props.required).toBe('always')
    expect(tupleNever.props.required).toBe('never')
  })

  // TODO: Reimplement props as potential first argument
  test('returns hidden tuple (method)', () => {
    const tupleSchema = tuple(str).hidden()

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { hidden: true }> = 1
    assertTuple

    expect(tupleSchema.props.hidden).toBe(true)
  })

  // TODO: Reimplement props as potential first argument
  test('returns key tuple (method)', () => {
    const tupleSchema = tuple(str).key()

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { key: true; required: Always }> =
      1
    assertTuple

    expect(tupleSchema.props.key).toBe(true)
    expect(tupleSchema.props.required).toBe('always')
  })

  // TODO: Reimplement props as potential first argument
  test('returns savedAs tuple (method)', () => {
    const tupleSchema = tuple(str).savedAs('foo')

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { savedAs: 'foo' }> = 1
    assertTuple

    expect(tupleSchema.props.savedAs).toBe('foo')
  })

  // TODO: Reimplement props as potential first argument
  test('returns defaulted tuple (method)', () => {
    const tupleSchema = tuple(str).updateDefault(['bar'])

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { updateDefault: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.updateDefault).toStrictEqual(['bar'])
  })

  test('returns tuple with PUT default value if it is not key (default shorthand)', () => {
    const tupleSchema = tuple(str).default(['foo'])

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { putDefault: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.putDefault).toStrictEqual(['foo'])
  })

  test('returns tuple with KEY default value if it is key (default shorthand)', () => {
    const tupleSchema = tuple(str).key().default(['foo'])

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { keyDefault: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.keyDefault).toStrictEqual(['foo'])
  })

  // TODO: Reimplement props as potential first argument
  test('returns linked tuple (method)', () => {
    const sayHello = () => ['hello'] as [string]
    const tupleSchema = tuple(str).updateLink(sayHello)

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { updateLink: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.updateLink).toBe(sayHello)
  })

  test('returns tuple with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => ['hello'] as [string]
    const tupleSchema = tuple(str).link(sayHello)

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { putLink: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.putLink).toBe(sayHello)
  })

  test('returns tuple with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => ['hello'] as [string]
    const tupleSchema = tuple(str).key().link(sayHello)

    const assertTuple: A.Contains<(typeof tupleSchema)['props'], { keyLink: unknown }> = 1
    assertTuple

    expect(tupleSchema.props.keyLink).toBe(sayHello)
  })

  // TODO: Reimplement props as potential first argument
  test('returns tuple with validator (method)', () => {
    const pass = () => true

    const tupleA = tuple(string(), number()).keyValidate(pass)
    const tupleB = tuple(string(), number()).putValidate(pass)
    const tupleC = tuple(string(), number()).updateValidate(pass)

    const assertTupleA: A.Contains<(typeof tupleA)['props'], { keyValidator: Validator }> = 1
    assertTupleA

    expect(tupleA.props.keyValidator).toBe(pass)

    const assertTupleB: A.Contains<(typeof tupleB)['props'], { putValidator: Validator }> = 1
    assertTupleB

    expect(tupleB.props.putValidator).toBe(pass)

    const assertTupleC: A.Contains<(typeof tupleC)['props'], { updateValidator: Validator }> = 1
    assertTupleC

    expect(tupleC.props.updateValidator).toBe(pass)

    const prevTuple = tuple(string(), number())
    prevTuple.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [[string, number], typeof prevTuple]> = 1
      assertArgs

      return true
    })

    const prevOptTuple = tuple(string(), number()).optional()
    prevOptTuple.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [[string, number], typeof prevOptTuple]> = 1
      assertArgs

      return true
    })
  })

  test('returns tuple with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _tuple = tuple(string(), number()).validate(pass)

    const assertTuple: A.Contains<(typeof _tuple)['props'], { putValidator: Validator }> = 1
    assertTuple

    expect(_tuple.props.putValidator).toBe(pass)
  })

  test('returns tuple with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _tuple = tuple(string(), number()).key().validate(pass)

    const assertTuple: A.Contains<(typeof _tuple)['props'], { keyValidator: Validator }> = 1
    assertTuple

    expect(_tuple.props.keyValidator).toBe(pass)
  })

  test('tuple of tuples', () => {
    const deepTuple = tuple(str)
    const tupleSchema = tuple(deepTuple)

    const assertTuple: A.Equals<(typeof tupleSchema)['elements'], [Light<typeof deepTuple>]> = 1
    assertTuple
  })
})
