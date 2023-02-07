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

import { list } from './typer'
import { freezeListAttribute } from './freeze'
import type { ListAttribute, $ListAttribute } from './interface'

describe('list', () => {
  const path = 'some.path'
  const strElement = string()

  it('rejects non-required elements', () => {
    list(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () =>
      freezeListAttribute(
        list(
          // @ts-expect-error
          string().optional()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'optionalListAttributeElements', path })
    )
  })

  it('rejects hidden elements', () => {
    list(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () =>
      freezeListAttribute(
        list(
          // @ts-expect-error
          strElement.hidden()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'hiddenListAttributeElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    list(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () =>
      freezeListAttribute(
        list(
          // @ts-expect-error
          strElement.savedAs('foo')
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'savedAsListAttributeElements', path })
    )
  })

  it('rejects elements with default values', () => {
    list(
      // @ts-expect-error
      strElement.default('foo')
    )

    const invalidCallA = () =>
      freezeListAttribute(
        list(
          // @ts-expect-error
          strElement.default('foo')
        ),
        path
      )

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedListAttributeElements', path })
    )

    list(
      // @ts-expect-error
      strElement.default(ComputedDefault)
    )

    const invalidCallB = () =>
      freezeListAttribute(
        list(
          // @ts-expect-error
          strElement.default(ComputedDefault)
        ),
        path
      )

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedListAttributeElements', path })
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
        [$default]: undefined
      }
    > = 1
    assertList

    const assertExtends: A.Extends<typeof lst, $ListAttribute> = 1
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
      [$hidden]: false
    })
  })

  it('returns required list (option)', () => {
    const lstAtLeastOnce = list(strElement, { required: 'atLeastOnce' })
    const lstOnlyOnce = list(strElement, { required: 'onlyOnce' })
    const lstAlways = list(strElement, { required: 'always' })
    const lstNever = list(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { [$required]: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(lstOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(lstAlways).toMatchObject({ [$required]: 'always' })
    expect(lstNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required list (method)', () => {
    const lstAtLeastOnce = list(strElement).required()
    const lstOnlyOnce = list(strElement).required('onlyOnce')
    const lstAlways = list(strElement).required('always')
    const lstNever = list(strElement).required('never')
    const lstOpt = list(strElement).optional()

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof lstOpt, { [$required]: Never }> = 1
    assertOpt

    expect(lstAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(lstOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
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

    const assertList: A.Contains<typeof lst, { [$key]: true }> = 1
    assertList

    expect(lst).toMatchObject({ [$key]: true })
  })

  it('returns key list (method)', () => {
    const lst = list(strElement).key()

    const assertList: A.Contains<typeof lst, { [$key]: true }> = 1
    assertList

    expect(lst).toMatchObject({ [$key]: true })
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

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(strElement, { default: ComputedDefault })

    const assertList: A.Contains<typeof lst, { [$default]: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ [$default]: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(strElement).default(ComputedDefault)

    const assertList: A.Contains<typeof lst, { [$default]: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ [$default]: ComputedDefault })
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
          [$default]: undefined
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$default]: undefined
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
        [$default]: undefined
      },
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$default]: undefined
    })
  })
})
