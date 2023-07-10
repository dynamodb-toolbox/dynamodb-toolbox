import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { ComputedDefault, Never, AtLeastOnce, Always } from '../constants'
import { string } from '../primitive'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import { set } from './typer'
import { freezeSetAttribute } from './freeze'
import { SetAttribute, $SetAttribute } from './interface'

describe('set', () => {
  const path = 'some.path'
  const strElement = string()

  it('rejects non-required elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => freezeSetAttribute(invalidSet, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.optionalElements', path })
    )
  })

  it('rejects hidden elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => freezeSetAttribute(invalidSet, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.hiddenElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => freezeSetAttribute(invalidSet, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.savedAsElements', path })
    )
  })

  it('rejects elements with default values', () => {
    const invalidSetA = set(
      // @ts-expect-error
      strElement.default('foo')
    )

    const invalidCallA = () => freezeSetAttribute(invalidSetA, path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
    )

    const invalidSetB = set(
      // @ts-expect-error
      strElement.default(ComputedDefault)
    )

    const invalidCallB = () => freezeSetAttribute(invalidSetB, path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
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
        [$defaults]: {
          key: undefined
          put: undefined
          update: undefined
        }
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
      [$hidden]: false,
      [$defaults]: {
        key: undefined,
        put: undefined,
        update: undefined
      }
    })
  })

  it('returns required set (option)', () => {
    const stAtLeastOnce = set(strElement, { required: 'atLeastOnce' })
    const stAlways = set(strElement, { required: 'always' })
    const stNever = set(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof stAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { [$required]: Never }> = 1
    assertNever

    expect(stAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(stAlways).toMatchObject({ [$required]: 'always' })
    expect(stNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required set (method)', () => {
    const stAtLeastOnce = set(strElement).required()
    const stAlways = set(strElement).required('always')
    const stNever = set(strElement).required('never')
    const stOpt = set(strElement).optional()

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof stAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof stOpt, { [$required]: Never }> = 1
    assertOpt

    expect(stAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
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

    const assertSet: A.Contains<typeof st, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertSet

    expect(st).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<typeof st, { [$key]: true; [$required]: Always }> = 1
    assertSet

    expect(st).toMatchObject({ [$key]: true, [$required]: 'always' })
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
    const stA = set(strElement, {
      defaults: { key: ComputedDefault, put: undefined, update: undefined }
    })

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: ComputedDefault; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA).toMatchObject({
      [$defaults]: { key: ComputedDefault, put: undefined, update: undefined }
    })

    const stB = set(strElement, {
      defaults: { key: undefined, put: ComputedDefault, update: undefined }
    })

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertSetB

    expect(stB).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })

    const stC = set(strElement, {
      defaults: { key: undefined, put: undefined, update: ComputedDefault }
    })

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: ComputedDefault } }
    > = 1
    assertSetC

    expect(stC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ComputedDefault }
    })
  })

  it('accepts ComputedDefault as default value (method)', () => {
    const stA = set(strElement).keyDefault(ComputedDefault)

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: ComputedDefault; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA).toMatchObject({
      [$defaults]: { key: ComputedDefault, put: undefined, update: undefined }
    })

    const stB = set(strElement).putDefault(ComputedDefault)

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertSetB

    expect(stB).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })

    const stC = set(strElement).updateDefault(ComputedDefault)

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: ComputedDefault } }
    > = 1
    assertSetC

    expect(stC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ComputedDefault }
    })
  })

  it('returns string with PUT default value if it is not key (default shorthand)', () => {
    const st = set(string()).default(ComputedDefault)

    const assertSt: A.Contains<
      typeof st,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertSt

    expect(st).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })
  })

  it('returns string with KEY default value if it is key (default shorthand)', () => {
    const st = set(string()).key().default(ComputedDefault)

    const assertSt: A.Contains<
      typeof st,
      { [$defaults]: { key: ComputedDefault; put: undefined; update: undefined } }
    > = 1
    assertSt

    expect(st).toMatchObject({
      [$defaults]: { key: ComputedDefault, put: undefined, update: undefined }
    })
  })
})
