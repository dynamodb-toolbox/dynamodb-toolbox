import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors/index.js'

import { string } from '../primitive/index.js'
import { Never, AtLeastOnce, Always } from '../constants/index.js'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'

import type { AnyOfAttribute, $AnyOfAttributeState } from './interface.js'
import { anyOf } from './typer.js'

describe('anyOf', () => {
  const path = 'some.path'
  const str = string()

  it('rejects missing elements', () => {
    const invalidAnyOf = anyOf()

    const invalidCall = () => invalidAnyOf.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.missingElements', path })
    )
  })

  it('rejects non-required elements', () => {
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

  it('rejects hidden elements', () => {
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

  it('rejects elements with savedAs values', () => {
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

  it('rejects elements with default values', () => {
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

  it('rejects elements with linked values', () => {
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

  it('returns default anyOf', () => {
    const anyOfAttr = anyOf(str)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      {
        [$type]: 'anyOf'
        [$elements]: [typeof str]
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$defaults]: {
          key: undefined
          put: undefined
          update: undefined
        }
        [$links]: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertAnyOf

    const assertExtends: A.Extends<typeof anyOfAttr, $AnyOfAttributeState> = 1
    assertExtends

    const frozenList = anyOfAttr.freeze(path)
    const assertFrozen: A.Extends<typeof frozenList, AnyOfAttribute> = 1
    assertFrozen

    expect(anyOfAttr[$type]).toBe('anyOf')
    expect(anyOfAttr[$elements]).toStrictEqual([str])
    expect(anyOfAttr[$required]).toBe('atLeastOnce')
    expect(anyOfAttr[$key]).toBe(false)
    expect(anyOfAttr[$savedAs]).toBe(undefined)
    expect(anyOfAttr[$hidden]).toBe(false)
    expect(anyOfAttr[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: undefined
    })
    expect(anyOfAttr[$links]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: undefined
    })
  })

  // TODO: Reimplement options as potential first argument
  it('returns required anyOf (method)', () => {
    const anyOfAtLeastOnce = anyOf(str).required()
    const anyOfAlways = anyOf(str).required('always')
    const anyOfNever = anyOf(str).required('never')
    const anyOfOpt = anyOf(str).optional()

    const assertAtLeastOnce: A.Contains<typeof anyOfAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyOfAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyOfNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof anyOfOpt, { [$required]: Never }> = 1
    assertOpt

    expect(anyOfAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(anyOfAlways[$required]).toBe('always')
    expect(anyOfNever[$required]).toBe('never')
  })

  // TODO: Reimplement options as potential first argument
  it('returns hidden anyOf (method)', () => {
    const anyOfAttr = anyOf(str).hidden()

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$hidden]: true }> = 1
    assertAnyOf

    expect(anyOfAttr[$hidden]).toBe(true)
  })

  // TODO: Reimplement options as potential first argument
  it('returns key anyOf (method)', () => {
    const anyOfAttr = anyOf(str).key()

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$key]: true; [$required]: Always }> = 1
    assertAnyOf

    expect(anyOfAttr[$key]).toBe(true)
    expect(anyOfAttr[$required]).toBe('always')
  })

  // TODO: Reimplement options as potential first argument
  it('returns savedAs anyOf (method)', () => {
    const anyOfAttr = anyOf(str).savedAs('foo')

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$savedAs]: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr[$savedAs]).toBe('foo')
  })

  // TODO: Reimplement options as potential first argument
  it('returns defaulted anyOf (method)', () => {
    const anyOfAttr = anyOf(str).updateDefault('bar')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: 'bar' })
  })

  it('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).default('foo')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$defaults]).toStrictEqual({ key: undefined, put: 'foo', update: undefined })
  })

  it('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfAttr = anyOf(str).key().default('foo')

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$defaults]).toStrictEqual({ key: 'foo', put: undefined, update: undefined })
  })

  // TODO: Reimplement options as potential first argument
  it('returns linked anyOf (method)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).updateLink(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  it('returns anyOf with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).link(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  it('returns anyOf with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const anyOfAttr = anyOf(str).key().link(sayHello)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
  })

  it('anyOf of anyOfs', () => {
    const nestedAnyOff = anyOf(str)
    const anyOfAttr = anyOf(nestedAnyOff)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      {
        [$type]: 'anyOf'
        [$elements]: [typeof nestedAnyOff]
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$defaults]: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertAnyOf
  })
})
