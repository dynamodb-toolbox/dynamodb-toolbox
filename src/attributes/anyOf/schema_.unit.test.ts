import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { number } from '../number/index.js'
import type { Light } from '../shared/light.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { AnyOfSchema } from './schema.js'
import { anyOf } from './schema_.js'

describe('anyOf', () => {
  const path = 'some.path'
  const str = string()

  test('rejects missing elements', () => {
    const invalidAnyOf = anyOf()

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.missingElements', path })
    )
  })

  test('rejects non-required elements', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.optional()
    )

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.putDefault('foo')
    )

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.putLink(() => 'foo')
    )

    const superInvalidCall = () => invalidAnyOf.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
    )
  })

  test('returns default anyOf', () => {
    const anyOfAttr = anyOf(str)

    const assertType: A.Equals<(typeof anyOfAttr)['type'], 'anyOf'> = 1
    assertType
    expect(anyOfAttr.type).toBe('anyOf')

    const assertElements: A.Equals<(typeof anyOfAttr)['elements'], [Light<typeof str>]> = 1
    assertElements
    expect(anyOfAttr.elements).toStrictEqual([str])

    const assertProps: A.Equals<(typeof anyOfAttr)['props'], {}> = 1
    assertProps
    expect(anyOfAttr.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof anyOfAttr, AnyOfSchema> = 1
    assertExtends
  })

  // TODO: Reimplement options as potential first argument
  test('returns required anyOf (method)', () => {
    const anyOfAtLeastOnce = anyOf(str).required()
    const anyOfAlways = anyOf(str).required('always')
    const anyOfNever = anyOf(str).required('never')
    const anyOfOpt = anyOf(str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof anyOfAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyOfAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyOfNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof anyOfOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(anyOfAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(anyOfAlways.props.required).toBe('always')
    expect(anyOfNever.props.required).toBe('never')
  })

  // TODO: Reimplement options as potential first argument
  test('returns hidden anyOf (method)', () => {
    const anyOfAttr = anyOf(str).hidden()

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { hidden: true }> = 1
    assertAnyOf

    expect(anyOfAttr.props.hidden).toBe(true)
  })

  // TODO: Reimplement options as potential first argument
  test('returns key anyOf (method)', () => {
    const anyOfAttr = anyOf(str).key()

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { key: true; required: Always }> = 1
    assertAnyOf

    expect(anyOfAttr.props.key).toBe(true)
    expect(anyOfAttr.props.required).toBe('always')
  })

  // TODO: Reimplement options as potential first argument
  test('returns savedAs anyOf (method)', () => {
    const anyOfAttr = anyOf(str).savedAs('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { savedAs: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr.props.savedAs).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  test('returns defaulted anyOf (method)', () => {
    const anyOfAttr = anyOf(str).updateDefault('bar')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { updateDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.updateDefault).toBe('bar')
  })

  test('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { putDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.putDefault).toBe('foo')
  })

  test('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).key().default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { keyDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.keyDefault).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  test('returns linked anyOf (method)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).updateLink(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { updateLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.updateLink).toBe(sayHello)
  })

  test('returns anyOf with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { putLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.putLink).toBe(sayHello)
  })

  test('returns anyOf with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).key().link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['props'], { keyLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.props.keyLink).toBe(sayHello)
  })

  // TODO: Reimplement options as potential first argument
  test('returns anyOf with validator (method)', () => {
    const pass = () => true

    const anyOfA = anyOf(string(), number()).keyValidate(pass)
    const anyOfB = anyOf(string(), number()).putValidate(pass)
    const anyOfC = anyOf(string(), number()).updateValidate(pass)

    const assertAnyOfA: A.Contains<(typeof anyOfA)['props'], { keyValidator: Validator }> = 1
    assertAnyOfA

    expect(anyOfA.props.keyValidator).toBe(pass)

    const assertAnyOfB: A.Contains<(typeof anyOfB)['props'], { putValidator: Validator }> = 1
    assertAnyOfB

    expect(anyOfB.props.putValidator).toBe(pass)

    const assertAnyOfC: A.Contains<(typeof anyOfC)['props'], { updateValidator: Validator }> = 1
    assertAnyOfC

    expect(anyOfC.props.updateValidator).toBe(pass)

    const prevAnyOf = anyOf(string(), number())
    prevAnyOf.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string | number, typeof prevAnyOf]> = 1
      assertArgs

      return true
    })

    const prevOptAnyOf = anyOf(string(), number()).optional()
    prevOptAnyOf.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string | number, typeof prevOptAnyOf]> = 1
      assertArgs

      return true
    })
  })

  test('returns anyOf with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _anyOf = anyOf(string(), number()).validate(pass)

    const assertAnyOf: A.Contains<(typeof _anyOf)['props'], { putValidator: Validator }> = 1
    assertAnyOf

    expect(_anyOf.props.putValidator).toBe(pass)
  })

  test('returns anyOf with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _anyOf = anyOf(string(), number()).key().validate(pass)

    const assertAnyOf: A.Contains<(typeof _anyOf)['props'], { keyValidator: Validator }> = 1
    assertAnyOf

    expect(_anyOf.props.keyValidator).toBe(pass)
  })

  test('anyOf of anyOfs', () => {
    const deepAnyOff = anyOf(str)
    const anyOfAttr = anyOf(deepAnyOff)

    const assertAnyOf: A.Equals<(typeof anyOfAttr)['elements'], [Light<typeof deepAnyOff>]> = 1
    assertAnyOf
  })
})
