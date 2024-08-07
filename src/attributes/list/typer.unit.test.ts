import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $elements, $state, $type } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeListAttribute } from './freeze.js'
import type { $ListAttributeState, ListAttribute } from './interface.js'
import { list } from './typer.js'

describe('list', () => {
  const path = 'some.path'
  const strElement = string()

  test('rejects non-required elements', () => {
    const invalidList = list(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => invalidList.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => invalidList.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => invalidList.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.putDefault('foo')
    )

    const invalidCall = () => invalidList.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.putLink(() => 'foo')
    )

    const invalidCall = () => invalidList.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.listAttribute.defaultedElements', path })
    )
  })

  test('returns default list', () => {
    const lst = list(strElement)

    const assertType: A.Equals<(typeof lst)[$type], 'list'> = 1
    assertType
    expect(lst[$type]).toBe('list')

    const assertState: A.Equals<
      (typeof lst)[$state],
      {
        required: AtLeastOnce
        hidden: false
        key: false
        savedAs: undefined
        defaults: { key: undefined; put: undefined; update: undefined }
        links: { key: undefined; put: undefined; update: undefined }
        validators: { key: undefined; put: undefined; update: undefined }
      }
    > = 1
    assertState
    expect(lst[$state]).toStrictEqual({
      required: 'atLeastOnce',
      key: false,
      hidden: false,
      savedAs: undefined,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined },
      validators: { key: undefined, put: undefined, update: undefined }
    })

    const assertElmts: A.Equals<(typeof lst)[$elements], typeof strElement> = 1
    assertElmts
    expect(lst[$elements]).toBe(strElement)

    const assertExtends: A.Extends<typeof lst, $ListAttributeState> = 1
    assertExtends

    const frozenList = lst.freeze(path)
    const assertFrozen: A.Extends<typeof frozenList, ListAttribute> = 1
    assertFrozen
  })

  test('returns required list (option)', () => {
    const lstAtLeastOnce = list(strElement, { required: 'atLeastOnce' })
    const lstAlways = list(strElement, { required: 'always' })
    const lstNever = list(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof lstAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof lstAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof lstNever)[$state], { required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(lstAlways[$state].required).toBe('always')
    expect(lstNever[$state].required).toBe('never')
  })

  test('returns required list (method)', () => {
    const lstAtLeastOnce = list(strElement).required()
    const lstAlways = list(strElement).required('always')
    const lstNever = list(strElement).required('never')
    const lstOpt = list(strElement).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof lstAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof lstAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof lstNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof lstOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(lstAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(lstAlways[$state].required).toBe('always')
    expect(lstNever[$state].required).toBe('never')
  })

  test('returns hidden list (option)', () => {
    const lst = list(strElement, { hidden: true })

    const assertList: A.Contains<(typeof lst)[$state], { hidden: true }> = 1
    assertList

    expect(lst[$state].hidden).toBe(true)
  })

  test('returns hidden list (method)', () => {
    const lst = list(strElement).hidden()

    const assertList: A.Contains<(typeof lst)[$state], { hidden: true }> = 1
    assertList

    expect(lst[$state].hidden).toBe(true)
  })

  test('returns key list (option)', () => {
    const lst = list(strElement, { key: true })

    const assertList: A.Contains<(typeof lst)[$state], { key: true; required: AtLeastOnce }> = 1
    assertList

    expect(lst[$state].key).toBe(true)
    expect(lst[$state].required).toBe('atLeastOnce')
  })

  test('returns key list (method)', () => {
    const lst = list(strElement).key()

    const assertList: A.Contains<(typeof lst)[$state], { key: true; required: Always }> = 1
    assertList

    expect(lst[$state].key).toBe(true)
    expect(lst[$state].required).toBe('always')
  })

  test('returns savedAs list (option)', () => {
    const lst = list(strElement, { savedAs: 'foo' })

    const assertList: A.Contains<(typeof lst)[$state], { savedAs: 'foo' }> = 1
    assertList

    expect(lst[$state].savedAs).toBe('foo')
  })

  test('returns savedAs list (method)', () => {
    const lst = list(strElement).savedAs('foo')

    const assertList: A.Contains<(typeof lst)[$state], { savedAs: 'foo' }> = 1
    assertList

    expect(lst[$state].savedAs).toBe('foo')
  })

  test('returns defaulted list (option)', () => {
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: ['foo'], put: undefined, update: undefined }
    })

    const assertListA: A.Contains<
      (typeof lstA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA[$state].defaults).toStrictEqual({ key: ['foo'], put: undefined, update: undefined })

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: undefined, put: ['bar'], update: undefined }
    })

    const assertListB: A.Contains<
      (typeof lstB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB[$state].defaults).toStrictEqual({ key: undefined, put: ['bar'], update: undefined })

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      defaults: { key: undefined, put: undefined, update: ['baz'] }
    })

    const assertListC: A.Contains<
      (typeof lstC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC[$state].defaults).toStrictEqual({ key: undefined, put: undefined, update: ['baz'] })
  })

  test('returns defaulted list (method)', () => {
    const lstA = list(strElement).keyDefault(['foo'])

    const assertListA: A.Contains<
      (typeof lstA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA[$state].defaults).toStrictEqual({ key: ['foo'], put: undefined, update: undefined })

    const lstB = list(strElement).putDefault(['bar'])

    const assertListB: A.Contains<
      (typeof lstB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB[$state].defaults).toStrictEqual({ key: undefined, put: ['bar'], update: undefined })

    const lstC = list(strElement).updateDefault(['baz'])

    const assertListC: A.Contains<
      (typeof lstC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC[$state].defaults).toStrictEqual({ key: undefined, put: undefined, update: ['baz'] })
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const listAttr = list(strElement).default(['foo'])

    const assertList: A.Contains<
      (typeof listAttr)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertList

    expect(listAttr[$state].defaults).toStrictEqual({
      key: undefined,
      put: ['foo'],
      update: undefined
    })
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const listAttr = list(strElement).key().default(['bar'])

    const assertList: A.Contains<
      (typeof listAttr)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertList

    expect(listAttr[$state].defaults).toStrictEqual({
      key: ['bar'],
      put: undefined,
      update: undefined
    })
  })

  test('returns linked list (option)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      links: { key: sayHello, put: undefined, update: undefined }
    })

    const assertListA: A.Contains<
      (typeof lstA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      links: { key: undefined, put: sayHello, update: undefined }
    })

    const assertListB: A.Contains<
      (typeof lstB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      links: { key: undefined, put: undefined, update: sayHello }
    })

    const assertListC: A.Contains<
      (typeof lstC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns linked list (method)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement).keyLink(sayHello)

    const assertListA: A.Contains<
      (typeof lstA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(lstA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const lstB = list(strElement).putLink(sayHello)

    const assertListB: A.Contains<
      (typeof lstB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertListB

    expect(lstB[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const lstC = list(strElement).updateLink(sayHello)

    const assertListC: A.Contains<
      (typeof lstC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertListC

    expect(lstC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listAttr = list(strElement).link(sayHello)

    const assertList: A.Contains<
      (typeof listAttr)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertList

    expect(listAttr[$state].links).toStrictEqual({
      key: undefined,
      put: sayHello,
      update: undefined
    })
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listAttr = list(strElement).key().link(sayHello)

    const assertList: A.Contains<
      (typeof listAttr)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertList

    expect(listAttr[$state].links).toStrictEqual({
      key: sayHello,
      put: undefined,
      update: undefined
    })
  })

  test('returns list with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const listA = list(string(), { validators: { key: pass, put: undefined, update: undefined } })
    const listB = list(string(), { validators: { key: undefined, put: pass, update: undefined } })
    const listC = list(string(), { validators: { key: undefined, put: undefined, update: pass } })

    const assertListA: A.Contains<
      (typeof listA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(listA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertListB: A.Contains<
      (typeof listB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertListB

    expect(listB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertListC: A.Contains<
      (typeof listC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertListC

    expect(listC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })
  })

  test('returns list with validator (method)', () => {
    const pass = () => true

    const listA = list(string()).keyValidate(pass)
    const listB = list(string()).putValidate(pass)
    const listC = list(string()).updateValidate(pass)

    const assertListA: A.Contains<
      (typeof listA)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertListA

    expect(listA[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })

    const assertListB: A.Contains<
      (typeof listB)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertListB

    expect(listB[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })

    const assertListC: A.Contains<
      (typeof listC)[$state],
      { validators: { key: undefined; put: undefined; update: Validator } }
    > = 1
    assertListC

    expect(listC[$state].validators).toStrictEqual({
      key: undefined,
      put: undefined,
      update: pass
    })

    const prevList = list(string())
    prevList.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string[], FreezeListAttribute<typeof prevList>]> = 1
      assertArgs

      return true
    })

    const prevOptList = list(string()).optional()
    prevOptList.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [string[] | undefined, FreezeListAttribute<typeof prevOptList>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns list with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _list = list(string()).validate(pass)

    const assertList: A.Contains<
      (typeof _list)[$state],
      { validators: { key: undefined; put: Validator; update: undefined } }
    > = 1
    assertList

    expect(_list[$state].validators).toStrictEqual({
      key: undefined,
      put: pass,
      update: undefined
    })
  })

  test('returns list with KEY validator if it is key (link shorthand)', () => {
    const pass = () => true
    const _list = list(string()).key().validate(pass)

    const assertList: A.Contains<
      (typeof _list)[$state],
      { validators: { key: Validator; put: undefined; update: undefined } }
    > = 1
    assertList

    expect(_list[$state].validators).toStrictEqual({
      key: pass,
      put: undefined,
      update: undefined
    })
  })

  test('list of lists', () => {
    const lst = list(list(strElement))

    const assertList: A.Contains<
      typeof lst,
      {
        [$type]: 'list'
        [$elements]: {
          [$type]: 'list'
          [$elements]: typeof strElement
          [$state]: {
            required: AtLeastOnce
            hidden: false
            key: false
            savedAs: undefined
            defaults: {
              key: undefined
              put: undefined
              update: undefined
            }
          }
        }
        [$state]: {
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: undefined
          defaults: {
            key: undefined
            put: undefined
            update: undefined
          }
        }
      }
    > = 1
    assertList
  })
})
