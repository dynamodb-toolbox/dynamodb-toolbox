import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeAnyOfAttribute } from './freeze.js'
import type { AnyOfAttribute, AnyOfSchema } from './interface.js'
import { anyOf } from './typer.js'

describe('anyOf', () => {
  const path = 'some.path'
  const str = string()

  test('rejects missing elements', () => {
    const invalidAnyOf = anyOf()

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.missingElements', path })
    )

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

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.optionalElements', path })
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

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.hiddenElements', path })
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

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.savedAsElements', path })
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

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
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

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
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

    const assertElements: A.Equals<(typeof anyOfAttr)['elements'], [typeof str]> = 1
    assertElements
    expect(anyOfAttr.elements).toStrictEqual([str])

    const assertState: A.Equals<(typeof anyOfAttr)['state'], {}> = 1
    assertState
    expect(anyOfAttr.state).toStrictEqual({})

    const assertExtends: A.Extends<typeof anyOfAttr, AnyOfSchema> = 1
    assertExtends

    const frozenList = anyOfAttr.freeze(path)
    const assertFrozen: A.Extends<typeof frozenList, AnyOfAttribute> = 1
    assertFrozen
  })

  // TODO: Reimplement options as potential first argument
  test('returns required anyOf (method)', () => {
    const anyOfAtLeastOnce = anyOf(str).required()
    const anyOfAlways = anyOf(str).required('always')
    const anyOfNever = anyOf(str).required('never')
    const anyOfOpt = anyOf(str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof anyOfAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof anyOfAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof anyOfNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof anyOfOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(anyOfAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(anyOfAlways.state.required).toBe('always')
    expect(anyOfNever.state.required).toBe('never')
  })

  // TODO: Reimplement options as potential first argument
  test('returns hidden anyOf (method)', () => {
    const anyOfAttr = anyOf(str).hidden()

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { hidden: true }> = 1
    assertAnyOf

    expect(anyOfAttr.state.hidden).toBe(true)
  })

  // TODO: Reimplement options as potential first argument
  test('returns key anyOf (method)', () => {
    const anyOfAttr = anyOf(str).key()

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { key: true; required: Always }> = 1
    assertAnyOf

    expect(anyOfAttr.state.key).toBe(true)
    expect(anyOfAttr.state.required).toBe('always')
  })

  // TODO: Reimplement options as potential first argument
  test('returns savedAs anyOf (method)', () => {
    const anyOfAttr = anyOf(str).savedAs('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { savedAs: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr.state.savedAs).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  test('returns defaulted anyOf (method)', () => {
    const anyOfAttr = anyOf(str).updateDefault('bar')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { updateDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.updateDefault).toBe('bar')
  })

  test('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { putDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.putDefault).toBe('foo')
  })

  test('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).key().default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { keyDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.keyDefault).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  test('returns linked anyOf (method)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).updateLink(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { updateLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.updateLink).toBe(sayHello)
  })

  test('returns anyOf with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { putLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.putLink).toBe(sayHello)
  })

  test('returns anyOf with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).key().link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfAttr)['state'], { keyLink: unknown }> = 1
    assertAnyOf

    expect(anyOfAttr.state.keyLink).toBe(sayHello)
  })

  // TODO: Reimplement options as potential first argument
  test('returns anyOf with validator (method)', () => {
    const pass = () => true

    const anyOfA = anyOf(string(), number()).keyValidate(pass)
    const anyOfB = anyOf(string(), number()).putValidate(pass)
    const anyOfC = anyOf(string(), number()).updateValidate(pass)

    const assertAnyOfA: A.Contains<(typeof anyOfA)['state'], { keyValidator: Validator }> = 1
    assertAnyOfA

    expect(anyOfA.state.keyValidator).toBe(pass)

    const assertAnyOfB: A.Contains<(typeof anyOfB)['state'], { putValidator: Validator }> = 1
    assertAnyOfB

    expect(anyOfB.state.putValidator).toBe(pass)

    const assertAnyOfC: A.Contains<(typeof anyOfC)['state'], { updateValidator: Validator }> = 1
    assertAnyOfC

    expect(anyOfC.state.updateValidator).toBe(pass)

    const prevAnyOf = anyOf(string(), number())
    prevAnyOf.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [string | number, FreezeAnyOfAttribute<typeof prevAnyOf>]
      > = 1
      assertArgs

      return true
    })

    const prevOptAnyOf = anyOf(string(), number()).optional()
    prevOptAnyOf.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [string | number, FreezeAnyOfAttribute<typeof prevOptAnyOf>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns anyOf with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _anyOf = anyOf(string(), number()).validate(pass)

    const assertAnyOf: A.Contains<(typeof _anyOf)['state'], { putValidator: Validator }> = 1
    assertAnyOf

    expect(_anyOf.state.putValidator).toBe(pass)
  })

  test('returns anyOf with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _anyOf = anyOf(string(), number()).key().validate(pass)

    const assertAnyOf: A.Contains<(typeof _anyOf)['state'], { keyValidator: Validator }> = 1
    assertAnyOf

    expect(_anyOf.state.keyValidator).toBe(pass)
  })

  test('anyOf of anyOfs', () => {
    const deepAnyOff = anyOf(str)
    const anyOfAttr = anyOf(deepAnyOff)

    const assertAnyOf: A.Equals<(typeof anyOfAttr)['elements'], [typeof deepAnyOff]> = 1
    assertAnyOf
  })
})
