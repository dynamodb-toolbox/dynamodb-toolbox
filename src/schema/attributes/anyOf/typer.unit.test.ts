import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state, $type } from '../constants/attributeOptions.js'
import { $elements, Always, AtLeastOnce, Never } from '../constants/index.js'
import { string } from '../primitive/index.js'
import type { $AnyOfAttributeState, AnyOfAttribute } from './interface.js'
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
  })

  test('returns default anyOf', () => {
    const anyOfAttr = anyOf(str)

    const assertType: A.Equals<typeof anyOfAttr[$type], 'anyOf'> = 1
    assertType
    expect(anyOfAttr[$type]).toBe('anyOf')

    const assertElements: A.Equals<typeof anyOfAttr[$elements], [typeof str]> = 1
    assertElements
    expect(anyOfAttr[$elements]).toStrictEqual([str])

    const assertState: A.Equals<
      typeof anyOfAttr[$state],
      {
        required: AtLeastOnce
        hidden: false
        key: false
        savedAs: undefined
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
      }
    > = 1
    assertState
    expect(anyOfAttr[$state]).toStrictEqual({
      required: 'atLeastOnce',
      key: false,
      savedAs: undefined,
      hidden: false,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined }
    })

    const assertExtends: A.Extends<typeof anyOfAttr, $AnyOfAttributeState> = 1
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
      typeof anyOfAtLeastOnce[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyOfAlways[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyOfNever[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof anyOfOpt[$state], { required: Never }> = 1
    assertOpt

    expect(anyOfAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(anyOfAlways[$state].required).toBe('always')
    expect(anyOfNever[$state].required).toBe('never')
  })

  // TODO: Reimplement options as potential first argument
  test('returns hidden anyOf (method)', () => {
    const anyOfAttr = anyOf(str).hidden()

    const assertAnyOf: A.Contains<typeof anyOfAttr[$state], { hidden: true }> = 1
    assertAnyOf

    expect(anyOfAttr[$state].hidden).toBe(true)
  })

  // TODO: Reimplement options as potential first argument
  test('returns key anyOf (method)', () => {
    const anyOfAttr = anyOf(str).key()

    const assertAnyOf: A.Contains<typeof anyOfAttr[$state], { key: true; required: Always }> = 1
    assertAnyOf

    expect(anyOfAttr[$state].key).toBe(true)
    expect(anyOfAttr[$state].required).toBe('always')
  })

  // TODO: Reimplement options as potential first argument
  test('returns savedAs anyOf (method)', () => {
    const anyOfAttr = anyOf(str).savedAs('foo')

    const assertAnyOf: A.Contains<typeof anyOfAttr[$state], { savedAs: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr[$state].savedAs).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  test('returns defaulted anyOf (method)', () => {
    const anyOfAttr = anyOf(str).updateDefault('bar')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: 'bar'
    })
  })

  test('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).default('foo')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].defaults).toStrictEqual({
      key: undefined,
      put: 'foo',
      update: undefined
    })
  })

  test('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).key().default('foo')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].defaults).toStrictEqual({
      key: 'foo',
      put: undefined,
      update: undefined
    })
  })

  // TODO: Reimplement options as potential first argument
  test('returns linked anyOf (method)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).updateLink(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].links).toStrictEqual({
      key: undefined,
      put: undefined,
      update: sayHello
    })
  })

  test('returns anyOf with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).link(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].links).toStrictEqual({
      key: undefined,
      put: sayHello,
      update: undefined
    })
  })

  test('returns anyOf with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).key().link(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$state].links).toStrictEqual({
      key: sayHello,
      put: undefined,
      update: undefined
    })
  })

  test('anyOf of anyOfs', () => {
    const nestedAnyOff = anyOf(str)
    const anyOfAttr = anyOf(nestedAnyOff)

    const assertAnyOf: A.Equals<typeof anyOfAttr[$elements], [typeof nestedAnyOff]> = 1
    assertAnyOf
  })
})
