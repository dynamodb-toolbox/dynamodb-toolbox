import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { Never, AtLeastOnce, Always } from '../constants'
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

import { list } from './typer'
import { freezeListAttribute } from './freeze'
import type { ListAttribute, $ListAttributeState } from './interface'

describe('list', () => {
  const path = 'some.path'
  const strElement = string()

  it('rejects non-required elements', () => {
    const invalidList = list(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => freezeListAttribute(invalidList, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.optionalElements', path })
    )
  })

  it('rejects hidden elements', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => freezeListAttribute(invalidList, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.hiddenElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => freezeListAttribute(invalidList, path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.savedAsElements', path })
    )
  })

  it('rejects elements with default values', () => {
    const invalidListA = list(
      // @ts-expect-error
      strElement.putDefault('foo')
    )

    const invalidCallA = () => freezeListAttribute(invalidListA, path)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.defaultedElements', path })
    )

    const invalidListB = list(
      // @ts-expect-error
      strElement.putDefault(ComputedDefault)
    )

    const invalidCallB = () => freezeListAttribute(invalidListB, path)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.defaultedElements', path })
    )
  })

  it('returns default list', () => {
    const lst = list(strElement)

    const assertList: A.Contains<
      typeof lst,
      {
        [$type]: 'list'
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
    assertList

    const assertExtends: A.Extends<typeof lst, $ListAttributeState> = 1
    assertExtends

    const frozenList = freezeListAttribute(lst, path)
    const assertFrozen: A.Extends<typeof frozenList, ListAttribute> = 1
    assertFrozen

    expect(lst).toMatchObject({
      [$type]: 'list',
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

  it('returns required list (option)', () => {
    const lstAtLeastOnce = list(strElement, { required: 'atLeastOnce' })
    const lstAlways = list(strElement, { required: 'always' })
    const lstNever = list(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof lstAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { [$required]: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(lstAlways).toMatchObject({ [$required]: 'always' })
    expect(lstNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required list (method)', () => {
    const lstAtLeastOnce = list(strElement).required()
    const lstAlways = list(strElement).required('always')
    const lstNever = list(strElement).required('never')
    const lstOpt = list(strElement).optional()

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof lstAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof lstOpt, { [$required]: Never }> = 1
    assertOpt

    expect(lstAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(lstAlways).toMatchObject({ [$required]: 'always' })
    expect(lstNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden list (option)', () => {
    const lst = list(strElement, { hidden: true })

    const assertList: A.Contains<typeof lst, { [$hidden]: true }> = 1
    assertList

    expect(lst).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden list (method)', () => {
    const lst = list(strElement).hidden()

    const assertList: A.Contains<typeof lst, { [$hidden]: true }> = 1
    assertList

    expect(lst).toMatchObject({ [$hidden]: true })
  })

  it('returns key list (option)', () => {
    const lst = list(strElement, { key: true })

    const assertList: A.Contains<typeof lst, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertList

    expect(lst).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key list (method)', () => {
    const lst = list(strElement).key()

    const assertList: A.Contains<typeof lst, { [$key]: true; [$required]: Always }> = 1
    assertList

    expect(lst).toMatchObject({ [$key]: true, [$required]: 'always' })
  })

  it('returns savedAs list (option)', () => {
    const lst = list(strElement, { savedAs: 'foo' })

    const assertList: A.Contains<typeof lst, { [$savedAs]: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs list (method)', () => {
    const lst = list(strElement).savedAs('foo')

    const assertList: A.Contains<typeof lst, { [$savedAs]: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns defaulted list (option)', () => {
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: ['foo'], put: undefined, update: undefined }
    })

    const assertListA: A.Contains<
      typeof lstA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA).toMatchObject({
      [$defaults]: { key: ['foo'], put: undefined, update: undefined }
    })

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: undefined, put: ['bar'], update: undefined }
    })

    const assertListB: A.Contains<
      typeof lstB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB).toMatchObject({
      [$defaults]: { key: undefined, put: ['bar'], update: undefined }
    })

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: undefined, put: undefined, update: ['baz'] }
    })

    const assertListC: A.Contains<
      typeof lstC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ['baz'] }
    })
  })

  it('returns defaulted list (method)', () => {
    const lstA = list(strElement).keyDefault(['foo'])

    const assertListA: A.Contains<
      typeof lstA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA).toMatchObject({
      [$defaults]: { key: ['foo'], put: undefined, update: undefined }
    })

    const lstB = list(strElement).putDefault(['bar'])

    const assertListB: A.Contains<
      typeof lstB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB).toMatchObject({
      [$defaults]: { key: undefined, put: ['bar'], update: undefined }
    })

    const lstC = list(strElement).updateDefault(['baz'])

    const assertListC: A.Contains<
      typeof lstC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ['baz'] }
    })
  })

  it('returns list with PUT default value if it is not key (default shorthand)', () => {
    const listAttr = list(strElement).default(['foo'])

    const assertList: A.Contains<
      typeof listAttr,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertList

    expect(listAttr).toMatchObject({
      [$defaults]: { key: undefined, put: ['foo'], update: undefined }
    })
  })

  it('returns list with KEY default value if it is key (default shorthand)', () => {
    const listAttr = list(strElement).key().default(['bar'])

    const assertList: A.Contains<
      typeof listAttr,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertList

    expect(listAttr).toMatchObject({
      [$defaults]: { key: ['bar'], put: undefined, update: undefined }
    })
  })

  it('list of lists', () => {
    const lst = list(list(strElement))

    const assertList: A.Contains<
      typeof lst,
      {
        [$type]: 'list'
        [$elements]: {
          [$type]: 'list'
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
    assertList

    expect(lst).toMatchObject({
      [$type]: 'list',
      [$elements]: {
        [$type]: 'list',
        [$elements]: strElement,
        [$required]: 'atLeastOnce',
        [$hidden]: false,
        [$key]: false,
        [$savedAs]: undefined,
        [$defaults]: {
          key: undefined,
          put: undefined,
          update: undefined
        }
      },
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
