import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { prefix } from '~/transformers/prefix.js'

import { map } from '../map/index.js'
import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { Light } from '../utils/light.js'
import { $computed, $discriminators } from './constants.js'
import type { AnyOfSchema } from './schema.js'
import { anyOf } from './schema_.js'

describe('anyOf', () => {
  const path = 'some.path'
  const str = string()

  test('rejects missing elements', () => {
    const invalidAnyOf = anyOf()

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.missingElements', path })
    )
  })

  test('rejects non-required elements', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.optional()
    )

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.putDefault('foo')
    )

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidAnyOf = anyOf(
      str,
      // @ts-expect-error
      str.putLink(() => 'foo')
    )

    const invalidCall = () => invalidAnyOf.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.defaultedElements', path })
    )
  })

  test('returns default anyOf', () => {
    const anyOfSchema = anyOf(str)

    const assertType: A.Equals<(typeof anyOfSchema)['type'], 'anyOf'> = 1
    assertType
    expect(anyOfSchema.type).toBe('anyOf')

    const assertElements: A.Equals<(typeof anyOfSchema)['elements'], [Light<typeof str>]> = 1
    assertElements
    expect(anyOfSchema.elements).toStrictEqual([str])

    const assertProps: A.Equals<(typeof anyOfSchema)['props'], {}> = 1
    assertProps
    expect(anyOfSchema.props).toStrictEqual({})

    const assertExtends: A.Extends<typeof anyOfSchema, AnyOfSchema> = 1
    assertExtends
  })

  // TODO: Reimplement props as potential first argument
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

  // TODO: Reimplement props as potential first argument
  test('returns hidden anyOf (method)', () => {
    const anyOfSchema = anyOf(str).hidden()

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { hidden: true }> = 1
    assertAnyOf

    expect(anyOfSchema.props.hidden).toBe(true)
  })

  // TODO: Reimplement props as potential first argument
  test('returns key anyOf (method)', () => {
    const anyOfSchema = anyOf(str).key()

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { key: true; required: Always }> =
      1
    assertAnyOf

    expect(anyOfSchema.props.key).toBe(true)
    expect(anyOfSchema.props.required).toBe('always')
  })

  // TODO: Reimplement props as potential first argument
  test('returns savedAs anyOf (method)', () => {
    const anyOfSchema = anyOf(str).savedAs('foo')

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { savedAs: 'foo' }> = 1
    assertAnyOf

    expect(anyOfSchema.props.savedAs).toBe('foo')
  })

  // TODO: Reimplement props as potential first argument
  test('returns discriminated anyOf (method)', () => {
    const dogSchema = map({ kind: string().enum('dog').savedAs('k').required('always') })
    const catSchema = map({ kind: string().enum('cat').savedAs('k') })
    const petSchema = anyOf(dogSchema, catSchema)
    const horseSchema = map({ kind: string().enum('horse').savedAs('k') })

    const anyOfSchema = anyOf(petSchema, horseSchema).discriminate('kind')
    expect(anyOfSchema[$discriminators]).toStrictEqual({ kind: 'k', [$computed]: true })

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { discriminator: 'kind' }> = 1
    assertAnyOf

    expect(anyOfSchema.props.discriminator).toBe('kind')
    anyOfSchema.check()

    expect(anyOfSchema.match('cat')).toBe(catSchema)
    expect(anyOfSchema.match('dog')).toBe(dogSchema)
    expect(anyOfSchema.match('horse')).toBe(horseSchema)
    expect(anyOfSchema.match('unknown')).toBeUndefined()

    // Rejects non-enum str
    const invalidCallA = () =>
      anyOf(map({ kind: string() }))
        // @ts-expect-error
        .discriminate('kind')
        .check(path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.invalidDiscriminator', path })
    )

    // Rejects non-matching savedAs
    const invalidCallB = () =>
      anyOf(
        map({ kind: string().enum('dog').savedAs('k') }),
        map({ kind: string().enum('cat').savedAs('_k') })
      )
        // @ts-expect-error
        .discriminate('kind')
        .check(path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.invalidDiscriminator', path })
    )

    // Rejects non-required
    const invalidCallC = () =>
      anyOf(map({ kind: string().enum('dog').optional() }))
        // @ts-expect-error
        .discriminate('kind')
        .check(path)

    expect(invalidCallC).toThrow(DynamoDBToolboxError)
    expect(invalidCallC).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.invalidDiscriminator', path })
    )

    // Rejects transformed
    const invalidCallD = () =>
      anyOf(map({ kind: string().enum('dog').transform(prefix('_')) }))
        // @ts-expect-error
        .discriminate('kind')
        .check(path)

    expect(invalidCallD).toThrow(DynamoDBToolboxError)
    expect(invalidCallD).toThrow(
      expect.objectContaining({ code: 'schema.anyOf.invalidDiscriminator', path })
    )
  })

  // TODO: Reimplement props as potential first argument
  test('returns defaulted anyOf (method)', () => {
    const anyOfSchema = anyOf(str).updateDefault('bar')

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { updateDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.updateDefault).toBe('bar')
  })

  test('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfSchema = anyOf(str).default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { putDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.putDefault).toBe('foo')
  })

  test('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfSchema = anyOf(str).key().default('foo')

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { keyDefault: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.keyDefault).toBe('foo')
  })

  // TODO: Reimplement props as potential first argument
  test('returns linked anyOf (method)', () => {
    const sayHello = () => 'hello'
    const anyOfSchema = anyOf(str).updateLink(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { updateLink: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.updateLink).toBe(sayHello)
  })

  test('returns anyOf with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfSchema = anyOf(str).link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { putLink: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.putLink).toBe(sayHello)
  })

  test('returns anyOf with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfSchema = anyOf(str).key().link(sayHello)

    const assertAnyOf: A.Contains<(typeof anyOfSchema)['props'], { keyLink: unknown }> = 1
    assertAnyOf

    expect(anyOfSchema.props.keyLink).toBe(sayHello)
  })

  // TODO: Reimplement props as potential first argument
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
    const anyOfSchema = anyOf(deepAnyOff)

    const assertAnyOf: A.Equals<(typeof anyOfSchema)['elements'], [Light<typeof deepAnyOff>]> = 1
    assertAnyOf
  })
})
