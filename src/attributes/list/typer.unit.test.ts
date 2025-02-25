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

    const assertState: A.Equals<(typeof lst)[$state], {}> = 1
    assertState
    expect(lst[$state]).toStrictEqual({})

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

    const assertList: A.Contains<(typeof lst)[$state], { key: true }> = 1
    assertList

    expect(lst[$state].key).toBe(true)
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
      keyDefault: ['foo']
    })

    const assertListA: A.Contains<(typeof lstA)[$state], { keyDefault: unknown }> = 1
    assertListA

    expect(lstA[$state].keyDefault).toStrictEqual(['foo'])

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      putDefault: ['bar']
    })

    const assertListB: A.Contains<(typeof lstB)[$state], { putDefault: unknown }> = 1
    assertListB

    expect(lstB[$state].putDefault).toStrictEqual(['bar'])

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      updateDefault: ['baz']
    })

    const assertListC: A.Contains<(typeof lstC)[$state], { updateDefault: unknown }> = 1
    assertListC

    expect(lstC[$state].updateDefault).toStrictEqual(['baz'])
  })

  test('returns defaulted list (method)', () => {
    const lstA = list(strElement).keyDefault(['foo'])

    const assertListA: A.Contains<(typeof lstA)[$state], { keyDefault: unknown }> = 1
    assertListA

    expect(lstA[$state].keyDefault).toStrictEqual(['foo'])

    const lstB = list(strElement).putDefault(['bar'])

    const assertListB: A.Contains<(typeof lstB)[$state], { putDefault: unknown }> = 1
    assertListB

    expect(lstB[$state].putDefault).toStrictEqual(['bar'])

    const lstC = list(strElement).updateDefault(['baz'])

    const assertListC: A.Contains<(typeof lstC)[$state], { updateDefault: unknown }> = 1
    assertListC

    expect(lstC[$state].updateDefault).toStrictEqual(['baz'])
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const listAttr = list(strElement).default(['foo'])

    const assertList: A.Contains<(typeof listAttr)[$state], { putDefault: unknown }> = 1
    assertList

    expect(listAttr[$state].putDefault).toStrictEqual(['foo'])
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const listAttr = list(strElement).key().default(['bar'])

    const assertList: A.Contains<(typeof listAttr)[$state], { keyDefault: unknown }> = 1
    assertList

    expect(listAttr[$state].keyDefault).toStrictEqual(['bar'])
  })

  test('returns linked list (option)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      keyLink: sayHello
    })

    const assertListA: A.Contains<(typeof lstA)[$state], { keyLink: unknown }> = 1
    assertListA

    expect(lstA[$state].keyLink).toBe(sayHello)

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      putLink: sayHello
    })

    const assertListB: A.Contains<(typeof lstB)[$state], { putLink: unknown }> = 1
    assertListB

    expect(lstB[$state].putLink).toBe(sayHello)

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      updateLink: sayHello
    })

    const assertListC: A.Contains<(typeof lstC)[$state], { updateLink: unknown }> = 1
    assertListC

    expect(lstC[$state].updateLink).toBe(sayHello)
  })

  test('returns linked list (method)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement).keyLink(sayHello)

    const assertListA: A.Contains<(typeof lstA)[$state], { keyLink: unknown }> = 1
    assertListA

    expect(lstA[$state].keyLink).toBe(sayHello)

    const lstB = list(strElement).putLink(sayHello)

    const assertListB: A.Contains<(typeof lstB)[$state], { putLink: unknown }> = 1
    assertListB

    expect(lstB[$state].putLink).toBe(sayHello)

    const lstC = list(strElement).updateLink(sayHello)

    const assertListC: A.Contains<(typeof lstC)[$state], { updateLink: unknown }> = 1
    assertListC

    expect(lstC[$state].updateLink).toBe(sayHello)
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listAttr = list(strElement).link(sayHello)

    const assertList: A.Contains<(typeof listAttr)[$state], { putLink: unknown }> = 1
    assertList

    expect(listAttr[$state].putLink).toBe(sayHello)
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listAttr = list(strElement).key().link(sayHello)

    const assertList: A.Contains<(typeof listAttr)[$state], { keyLink: unknown }> = 1
    assertList

    expect(listAttr[$state].keyLink).toBe(sayHello)
  })

  test('returns list with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const listA = list(string(), { keyValidator: pass })
    const listB = list(string(), { putValidator: pass })
    const listC = list(string(), { updateValidator: pass })

    const assertListA: A.Contains<(typeof listA)[$state], { keyValidator: Validator }> = 1
    assertListA

    expect(listA[$state].keyValidator).toBe(pass)

    const assertListB: A.Contains<(typeof listB)[$state], { putValidator: Validator }> = 1
    assertListB

    expect(listB[$state].putValidator).toBe(pass)

    const assertListC: A.Contains<(typeof listC)[$state], { updateValidator: Validator }> = 1
    assertListC

    expect(listC[$state].updateValidator).toBe(pass)
  })

  test('returns list with validator (method)', () => {
    const pass = () => true

    const listA = list(string()).keyValidate(pass)
    const listB = list(string()).putValidate(pass)
    const listC = list(string()).updateValidate(pass)

    const assertListA: A.Contains<(typeof listA)[$state], { keyValidator: Validator }> = 1
    assertListA

    expect(listA[$state].keyValidator).toBe(pass)

    const assertListB: A.Contains<(typeof listB)[$state], { putValidator: Validator }> = 1
    assertListB

    expect(listB[$state].putValidator).toBe(pass)

    const assertListC: A.Contains<(typeof listC)[$state], { updateValidator: Validator }> = 1
    assertListC

    expect(listC[$state].updateValidator).toBe(pass)

    const prevList = list(string())
    prevList.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string[], FreezeListAttribute<typeof prevList>]> = 1
      assertArgs

      return true
    })

    const prevOptList = list(string()).optional()
    prevOptList.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string[], FreezeListAttribute<typeof prevOptList>]> =
        1
      assertArgs

      return true
    })
  })

  test('returns list with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _list = list(string()).validate(pass)

    const assertList: A.Contains<(typeof _list)[$state], { putValidator: Validator }> = 1
    assertList

    expect(_list[$state].putValidator).toBe(pass)
  })

  test('returns list with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _list = list(string()).key().validate(pass)

    const assertList: A.Contains<(typeof _list)[$state], { keyValidator: Validator }> = 1
    assertList

    expect(_list[$state].keyValidator).toBe(pass)
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
          [$state]: {}
        }
        [$state]: {}
      }
    > = 1
    assertList
  })
})
