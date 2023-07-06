import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { string } from '../primitive'
import { ComputedDefault, Never, AtLeastOnce, Always } from '../constants'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import { anyOf } from './typer'
import { freezeAnyOfAttribute } from './freeze'
import type { AnyOfAttribute, $AnyOfAttribute } from './interface'

describe('anyOf', () => {
  const path = 'some.path'
  const str = string()

  it('rejects missing elements', () => {
    const invalidCall = () => freezeAnyOfAttribute(anyOf([]), path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.missingElements', path })
    )
  })

  it('rejects non-required elements', () => {
    anyOf([
      str,
      // @ts-expect-error
      str.optional()
    ])

    const invalidCall = () =>
      freezeAnyOfAttribute(
        anyOf([
          str,
          // @ts-expect-error
          str.optional()
        ]),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.optionalElements', path })
    )
  })

  it('rejects hidden elements', () => {
    anyOf([
      str,
      // @ts-expect-error
      str.hidden()
    ])

    const invalidCall = () =>
      freezeAnyOfAttribute(
        anyOf([
          str,
          // @ts-expect-error
          str.hidden()
        ]),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.hiddenElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    anyOf([
      str,
      // @ts-expect-error
      str.savedAs('foo')
    ])

    const invalidCall = () =>
      freezeAnyOfAttribute(
        anyOf([
          str,
          // @ts-expect-error
          str.savedAs('foo')
        ]),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.savedAsElements', path })
    )
  })

  it('rejects elements with default values', () => {
    const invalidAnyOfA = anyOf([
      str,
      // @ts-expect-error
      str.putDefault('foo')
    ])

    const invalidCallA = () => freezeAnyOfAttribute(invalidAnyOfA, path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
    )

    const invalidAnyOfB = anyOf([
      str,
      // @ts-expect-error
      str.updateDefault(ComputedDefault)
    ])

    const invalidCallB = () => freezeAnyOfAttribute(invalidAnyOfB, path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.anyOfAttribute.defaultedElements', path })
    )
  })

  it('returns default anyOf', () => {
    const anyOfAttr = anyOf([str])

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      {
        [$type]: 'anyOf'
        [$elements]: typeof str[]
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

    const assertExtends: A.Extends<typeof anyOfAttr, $AnyOfAttribute> = 1
    assertExtends

    const frozenList = freezeAnyOfAttribute(anyOfAttr, path)
    const assertFrozen: A.Extends<typeof frozenList, AnyOfAttribute> = 1
    assertFrozen

    expect(anyOfAttr).toMatchObject({
      [$type]: 'anyOf',
      [$elements]: [str],
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$savedAs]: undefined,
      [$hidden]: false,
      [$defaults]: {
        key: undefined,
        put: undefined,
        update: undefined
      }
    })
  })

  it('returns required anyOf (option)', () => {
    const anyOfAtLeastOnce = anyOf([str], { required: 'atLeastOnce' })
    const anyOfAlways = anyOf([str], { required: 'always' })
    const anyOfNever = anyOf([str], { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof anyOfAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyOfAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyOfNever, { [$required]: Never }> = 1
    assertNever

    expect(anyOfAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyOfAlways).toMatchObject({ [$required]: 'always' })
    expect(anyOfNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required anyOf (method)', () => {
    const anyOfAtLeastOnce = anyOf([str]).required()
    const anyOfAlways = anyOf([str]).required('always')
    const anyOfNever = anyOf([str]).required('never')
    const anyOfOpt = anyOf([str]).optional()

    const assertAtLeastOnce: A.Contains<typeof anyOfAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyOfAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyOfNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof anyOfOpt, { [$required]: Never }> = 1
    assertOpt

    expect(anyOfAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyOfAlways).toMatchObject({ [$required]: 'always' })
    expect(anyOfNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden anyOf (option)', () => {
    const anyOfAttr = anyOf([str], { hidden: true })

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$hidden]: true }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden anyOf (method)', () => {
    const anyOfAttr = anyOf([str]).hidden()

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$hidden]: true }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$hidden]: true })
  })

  it('returns key anyOf (option)', () => {
    const anyOfAttr = anyOf([str], { key: true })

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key anyOf (method)', () => {
    const anyOfAttr = anyOf([str]).key()

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$key]: true; [$required]: Always }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$key]: true, [$required]: 'always' })
  })

  it('returns savedAs anyOf (option)', () => {
    const anyOfAttr = anyOf([str], { savedAs: 'foo' })

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$savedAs]: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs anyOf (method)', () => {
    const anyOfAttr = anyOf([str]).savedAs('foo')

    const assertAnyOf: A.Contains<typeof anyOfAttr, { [$savedAs]: 'foo' }> = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const anyOfAttr = anyOf([str], {
      defaults: { key: undefined, put: ComputedDefault, update: undefined }
    })

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })
  })

  it('accepts ComputedDefault as default value (method)', () => {
    const anyOfAttr = anyOf([str]).updateDefault(ComputedDefault)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: undefined; put: undefined; update: ComputedDefault } }
    > = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ComputedDefault }
    })
  })

  it('returns anyOf with PUT default value if it is not key (default shorthand)', () => {
    const anyOfAttr = anyOf([str]).default(ComputedDefault)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })
  })

  it('returns anyOf with KEY default value if it is key (default shorthand)', () => {
    const anyOfAttr = anyOf([str]).key().default(ComputedDefault)

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      { [$defaults]: { key: ComputedDefault; put: undefined; update: undefined } }
    > = 1
    assertAnyOf

    expect(anyOfAttr).toMatchObject({
      [$defaults]: { key: ComputedDefault, put: undefined, update: undefined }
    })
  })

  it('anyOf of anyOfs', () => {
    const nestedAnyOff = anyOf([str])
    const anyOfAttr = anyOf([nestedAnyOff])

    const assertAnyOf: A.Contains<
      typeof anyOfAttr,
      {
        [$type]: 'anyOf'
        [$elements]: typeof nestedAnyOff[]
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

    expect(anyOfAttr).toMatchObject({
      [$type]: 'anyOf',
      [$elements]: nestedAnyOff,
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$defaults]: {
        key: undefined,
        put: undefined,
        update: undefined
      }
    })
  })
})
