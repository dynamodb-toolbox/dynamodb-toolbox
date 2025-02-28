import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { string } from '../string/index.js'
import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { Light } from '../utils/light.js'
import type { ListSchema } from './schema.js'
import { list } from './schema_.js'

describe('list', () => {
  const path = 'some.path'
  const strElement = string()

  test('rejects non-required elements', () => {
    const invalidList = list(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => invalidList.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.list.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => invalidList.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.list.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => invalidList.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.list.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.putDefault('foo')
    )

    const invalidCall = () => invalidList.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.list.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidList = list(
      // @ts-expect-error
      strElement.putLink(() => 'foo')
    )

    const invalidCall = () => invalidList.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.list.defaultedElements', path })
    )
  })

  test('returns default list', () => {
    const lst = list(strElement)

    const assertType: A.Equals<(typeof lst)['type'], 'list'> = 1
    assertType
    expect(lst.type).toBe('list')

    const assertProps: A.Equals<(typeof lst)['props'], {}> = 1
    assertProps
    expect(lst.props).toStrictEqual({})

    const assertElmts: A.Equals<(typeof lst)['elements'], Light<typeof strElement>> = 1
    assertElmts
    expect(lst.elements).toBe(strElement)

    const assertExtends: A.Extends<typeof lst, ListSchema> = 1
    assertExtends
  })

  test('returns required list (prop)', () => {
    const lstAtLeastOnce = list(strElement, { required: 'atLeastOnce' })
    const lstAlways = list(strElement, { required: 'always' })
    const lstNever = list(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof lstAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof lstAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof lstNever)['props'], { required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(lstAlways.props.required).toBe('always')
    expect(lstNever.props.required).toBe('never')
  })

  test('returns required list (method)', () => {
    const lstAtLeastOnce = list(strElement).required()
    const lstAlways = list(strElement).required('always')
    const lstNever = list(strElement).required('never')
    const lstOpt = list(strElement).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof lstAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof lstAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof lstNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof lstOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(lstAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(lstAlways.props.required).toBe('always')
    expect(lstNever.props.required).toBe('never')
  })

  test('returns hidden list (prop)', () => {
    const lst = list(strElement, { hidden: true })

    const assertList: A.Contains<(typeof lst)['props'], { hidden: true }> = 1
    assertList

    expect(lst.props.hidden).toBe(true)
  })

  test('returns hidden list (method)', () => {
    const lst = list(strElement).hidden()

    const assertList: A.Contains<(typeof lst)['props'], { hidden: true }> = 1
    assertList

    expect(lst.props.hidden).toBe(true)
  })

  test('returns key list (prop)', () => {
    const lst = list(strElement, { key: true })

    const assertList: A.Contains<(typeof lst)['props'], { key: true }> = 1
    assertList

    expect(lst.props.key).toBe(true)
  })

  test('returns key list (method)', () => {
    const lst = list(strElement).key()

    const assertList: A.Contains<(typeof lst)['props'], { key: true; required: Always }> = 1
    assertList

    expect(lst.props.key).toBe(true)
    expect(lst.props.required).toBe('always')
  })

  test('returns savedAs list (prop)', () => {
    const lst = list(strElement, { savedAs: 'foo' })

    const assertList: A.Contains<(typeof lst)['props'], { savedAs: 'foo' }> = 1
    assertList

    expect(lst.props.savedAs).toBe('foo')
  })

  test('returns savedAs list (method)', () => {
    const lst = list(strElement).savedAs('foo')

    const assertList: A.Contains<(typeof lst)['props'], { savedAs: 'foo' }> = 1
    assertList

    expect(lst.props.savedAs).toBe('foo')
  })

  test('returns defaulted list (prop)', () => {
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      keyDefault: ['foo']
    })

    const assertListA: A.Contains<(typeof lstA)['props'], { keyDefault: unknown }> = 1
    assertListA

    expect(lstA.props.keyDefault).toStrictEqual(['foo'])

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      putDefault: ['bar']
    })

    const assertListB: A.Contains<(typeof lstB)['props'], { putDefault: unknown }> = 1
    assertListB

    expect(lstB.props.putDefault).toStrictEqual(['bar'])

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      updateDefault: ['baz']
    })

    const assertListC: A.Contains<(typeof lstC)['props'], { updateDefault: unknown }> = 1
    assertListC

    expect(lstC.props.updateDefault).toStrictEqual(['baz'])
  })

  test('returns defaulted list (method)', () => {
    const lstA = list(strElement).keyDefault(['foo'])

    const assertListA: A.Contains<(typeof lstA)['props'], { keyDefault: unknown }> = 1
    assertListA

    expect(lstA.props.keyDefault).toStrictEqual(['foo'])

    const lstB = list(strElement).putDefault(['bar'])

    const assertListB: A.Contains<(typeof lstB)['props'], { putDefault: unknown }> = 1
    assertListB

    expect(lstB.props.putDefault).toStrictEqual(['bar'])

    const lstC = list(strElement).updateDefault(['baz'])

    const assertListC: A.Contains<(typeof lstC)['props'], { updateDefault: unknown }> = 1
    assertListC

    expect(lstC.props.updateDefault).toStrictEqual(['baz'])
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const listSchema = list(strElement).default(['foo'])

    const assertList: A.Contains<(typeof listSchema)['props'], { putDefault: unknown }> = 1
    assertList

    expect(listSchema.props.putDefault).toStrictEqual(['foo'])
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const listSchema = list(strElement).key().default(['bar'])

    const assertList: A.Contains<(typeof listSchema)['props'], { keyDefault: unknown }> = 1
    assertList

    expect(listSchema.props.keyDefault).toStrictEqual(['bar'])
  })

  test('returns linked list (prop)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement, {
      // TOIMPROVE: Add type constraints here
      keyLink: sayHello
    })

    const assertListA: A.Contains<(typeof lstA)['props'], { keyLink: unknown }> = 1
    assertListA

    expect(lstA.props.keyLink).toBe(sayHello)

    const lstB = list(strElement, {
      // TOIMPROVE: Add type constraints here
      putLink: sayHello
    })

    const assertListB: A.Contains<(typeof lstB)['props'], { putLink: unknown }> = 1
    assertListB

    expect(lstB.props.putLink).toBe(sayHello)

    const lstC = list(strElement, {
      // TOIMPROVE: Add type constraints here
      updateLink: sayHello
    })

    const assertListC: A.Contains<(typeof lstC)['props'], { updateLink: unknown }> = 1
    assertListC

    expect(lstC.props.updateLink).toBe(sayHello)
  })

  test('returns linked list (method)', () => {
    const sayHello = () => ['hello']
    const lstA = list(strElement).keyLink(sayHello)

    const assertListA: A.Contains<(typeof lstA)['props'], { keyLink: unknown }> = 1
    assertListA

    expect(lstA.props.keyLink).toBe(sayHello)

    const lstB = list(strElement).putLink(sayHello)

    const assertListB: A.Contains<(typeof lstB)['props'], { putLink: unknown }> = 1
    assertListB

    expect(lstB.props.putLink).toBe(sayHello)

    const lstC = list(strElement).updateLink(sayHello)

    const assertListC: A.Contains<(typeof lstC)['props'], { updateLink: unknown }> = 1
    assertListC

    expect(lstC.props.updateLink).toBe(sayHello)
  })

  test('returns list with PUT default value if it is not key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listSchema = list(strElement).link(sayHello)

    const assertList: A.Contains<(typeof listSchema)['props'], { putLink: unknown }> = 1
    assertList

    expect(listSchema.props.putLink).toBe(sayHello)
  })

  test('returns list with KEY default value if it is key (default shorthand)', () => {
    const sayHello = () => ['hello']
    const listSchema = list(strElement).key().link(sayHello)

    const assertList: A.Contains<(typeof listSchema)['props'], { keyLink: unknown }> = 1
    assertList

    expect(listSchema.props.keyLink).toBe(sayHello)
  })

  test('returns list with validator (prop)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const listA = list(string(), { keyValidator: pass })
    const listB = list(string(), { putValidator: pass })
    const listC = list(string(), { updateValidator: pass })

    const assertListA: A.Contains<(typeof listA)['props'], { keyValidator: Validator }> = 1
    assertListA

    expect(listA.props.keyValidator).toBe(pass)

    const assertListB: A.Contains<(typeof listB)['props'], { putValidator: Validator }> = 1
    assertListB

    expect(listB.props.putValidator).toBe(pass)

    const assertListC: A.Contains<(typeof listC)['props'], { updateValidator: Validator }> = 1
    assertListC

    expect(listC.props.updateValidator).toBe(pass)
  })

  test('returns list with validator (method)', () => {
    const pass = () => true

    const listA = list(string()).keyValidate(pass)
    const listB = list(string()).putValidate(pass)
    const listC = list(string()).updateValidate(pass)

    const assertListA: A.Contains<(typeof listA)['props'], { keyValidator: Validator }> = 1
    assertListA

    expect(listA.props.keyValidator).toBe(pass)

    const assertListB: A.Contains<(typeof listB)['props'], { putValidator: Validator }> = 1
    assertListB

    expect(listB.props.putValidator).toBe(pass)

    const assertListC: A.Contains<(typeof listC)['props'], { updateValidator: Validator }> = 1
    assertListC

    expect(listC.props.updateValidator).toBe(pass)

    const prevList = list(string())
    prevList.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string[], typeof prevList]> = 1
      assertArgs

      return true
    })

    const prevOptList = list(string()).optional()
    prevOptList.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [string[], typeof prevOptList]> = 1
      assertArgs

      return true
    })
  })

  test('returns list with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _list = list(string()).validate(pass)

    const assertList: A.Contains<(typeof _list)['props'], { putValidator: Validator }> = 1
    assertList

    expect(_list.props.putValidator).toBe(pass)
  })

  test('returns list with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _list = list(string()).key().validate(pass)

    const assertList: A.Contains<(typeof _list)['props'], { keyValidator: Validator }> = 1
    assertList

    expect(_list.props.keyValidator).toBe(pass)
  })

  test('list of lists', () => {
    const lst = list(list(strElement))

    const assertList: A.Contains<
      typeof lst,
      {
        type: 'list'
        elements: {
          type: 'list'
          elements: Light<typeof strElement>
          props: {}
        }
        props: {}
      }
    > = 1
    assertList
  })
})
