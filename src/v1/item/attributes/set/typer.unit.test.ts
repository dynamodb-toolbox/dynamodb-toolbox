import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../primitive'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'

import { set } from './typer'
import { freezeSetAttribute } from './freeze'
import { SetAttribute, $SetAttribute } from './interface'

describe('set', () => {
  const path = 'some.path'
  const strElement = string()

  it('rejects non-required elements', () => {
    set(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () =>
      freezeSetAttribute(
        set(
          // @ts-expect-error
          string().optional()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'optionalSetAttributeElements', path })
    )
  })

  it('rejects hidden elements', () => {
    set(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () =>
      freezeSetAttribute(
        set(
          // @ts-expect-error
          strElement.hidden()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'hiddenSetAttributeElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    set(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () =>
      freezeSetAttribute(
        set(
          // @ts-expect-error
          strElement.savedAs('foo')
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'savedAsSetAttributeElements', path })
    )
  })

  it('rejects elements with default values', () => {
    set(
      // @ts-expect-error
      strElement.default('foo')
    )

    const invalidCallA = () =>
      freezeSetAttribute(
        set(
          // @ts-expect-error
          strElement.default('foo')
        ),
        path
      )

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedSetAttributeElements', path })
    )

    set(
      // @ts-expect-error
      strElement.default(ComputedDefault)
    )

    const invalidCallB = () =>
      freezeSetAttribute(
        set(
          // @ts-expect-error
          strElement.default(ComputedDefault)
        ),
        path
      )

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'defaultedSetAttributeElements', path })
    )
  })

  it('returns default set', () => {
    const st = set(strElement)

    const assertSet: A.Contains<
      typeof st,
      {
        [$type]: 'set'
        [$elements]: typeof strElement
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$default]: undefined
      }
    > = 1
    assertSet

    const assertExtends: A.Extends<typeof st, $SetAttribute> = 1
    assertExtends

    const frozenSet = freezeSetAttribute(st, path)
    const assertFrozenExtends: A.Extends<typeof frozenSet, SetAttribute> = 1
    assertFrozenExtends

    expect(st).toMatchObject({
      [$type]: 'set',
      [$elements]: strElement,
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$savedAs]: undefined,
      [$hidden]: false
    })
  })

  it('returns required set (option)', () => {
    const stAtLeastOnce = set(strElement, { required: 'atLeastOnce' })
    const stOnlyOnce = set(strElement, { required: 'onlyOnce' })
    const stAlways = set(strElement, { required: 'always' })
    const stNever = set(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof stOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof stAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { [$required]: Never }> = 1
    assertNever

    expect(stAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(stOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(stAlways).toMatchObject({ [$required]: 'always' })
    expect(stNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required set (method)', () => {
    const stAtLeastOnce = set(strElement).required()
    const stOnlyOnce = set(strElement).required('onlyOnce')
    const stAlways = set(strElement).required('always')
    const stNever = set(strElement).required('never')
    const stOpt = set(strElement).optional()

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof stOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof stAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof stOpt, { [$required]: Never }> = 1
    assertOpt

    expect(stAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(stOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(stAlways).toMatchObject({ [$required]: 'always' })
    expect(stNever).toMatchObject({ [$required]: 'never' })
    expect(stOpt).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden set (option)', () => {
    const st = set(strElement, { hidden: true })

    const assertSet: A.Contains<typeof st, { [$hidden]: true }> = 1
    assertSet

    expect(st).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden set (method)', () => {
    const st = set(strElement).hidden()

    const assertSet: A.Contains<typeof st, { [$hidden]: true }> = 1
    assertSet

    expect(st).toMatchObject({ [$hidden]: true })
  })

  it('returns key set (option)', () => {
    const st = set(strElement, { key: true })

    const assertSet: A.Contains<typeof st, { [$key]: true }> = 1
    assertSet

    expect(st).toMatchObject({ [$key]: true })
  })

  it('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<typeof st, { [$key]: true }> = 1
    assertSet

    expect(st).toMatchObject({ [$key]: true })
  })

  it('returns savedAs set (option)', () => {
    const st = set(strElement, { savedAs: 'foo' })

    const assertSet: A.Contains<typeof st, { [$savedAs]: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs set (method)', () => {
    const st = set(strElement).savedAs('foo')

    const assertSet: A.Contains<typeof st, { [$savedAs]: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(strElement, { default: ComputedDefault })

    const assertSet: A.Contains<typeof st, { [$default]: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ [$default]: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(strElement).default(ComputedDefault)

    const assertSet: A.Contains<typeof st, { [$default]: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ [$default]: ComputedDefault })
  })
})
