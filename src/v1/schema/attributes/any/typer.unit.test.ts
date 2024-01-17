import type { A } from 'ts-toolbelt'

import { Never, AtLeastOnce, Always } from '../constants'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links,
  $castAs
} from '../constants/attributeOptions'

import type { $AnyAttributeState, AnyAttribute } from './interface'

import { any } from './typer'

describe('anyAttribute', () => {
  it('returns default string', () => {
    const anyInstance = any()

    const assertAny: A.Contains<
      typeof anyInstance,
      {
        [$type]: 'any'
        [$required]: AtLeastOnce
        [$hidden]: false
        [$savedAs]: undefined
        [$key]: false
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
        [$castAs]: unknown
      }
    > = 1
    assertAny

    const assertExtends: A.Extends<typeof anyInstance, $AnyAttributeState> = 1
    assertExtends

    const frozenAny = anyInstance.freeze('some.path')
    const assertFrozenExtends: A.Extends<typeof frozenAny, AnyAttribute> = 1
    assertFrozenExtends

    expect(anyInstance[$type]).toBe('any')
    expect(anyInstance[$required]).toBe('atLeastOnce')
    expect(anyInstance[$hidden]).toBe(false)
    expect(anyInstance[$savedAs]).toBe(undefined)
    expect(anyInstance[$key]).toBe(false)
    expect(anyInstance[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: undefined
    })
    expect(anyInstance[$links]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: undefined
    })
  })

  it('returns required any (option)', () => {
    const anyAtLeastOnce = any({ required: 'atLeastOnce' })
    const anyAlways = any({ required: 'always' })
    const anyNever = any({ required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { [$required]: Never }> = 1
    assertNever

    expect(anyAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(anyAlways[$required]).toBe('always')
    expect(anyNever[$required]).toBe('never')
  })

  it('returns required any (method)', () => {
    const anyAtLeastOnce = any().required()
    const anyAlways = any().required('always')
    const anyNever = any().required('never')
    const anyOpt = any().optional()

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof anyAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof anyOpt, { [$required]: Never }> = 1
    assertOpt

    expect(anyAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(anyAlways[$required]).toBe('always')
    expect(anyNever[$required]).toBe('never')
    expect(anyOpt[$required]).toBe('never')
  })

  it('returns hidden any (option)', () => {
    const anyInstance = any({ hidden: true })

    const assertAny: A.Contains<typeof anyInstance, { [$hidden]: true }> = 1
    assertAny

    expect(anyInstance[$hidden]).toBe(true)
  })

  it('returns hidden any (method)', () => {
    const anyInstance = any().hidden()

    const assertAny: A.Contains<typeof anyInstance, { [$hidden]: true }> = 1
    assertAny

    expect(anyInstance[$hidden]).toBe(true)
  })

  it('returns key any (option)', () => {
    const anyInstance = any({ key: true })

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertAny

    expect(anyInstance[$key]).toBe(true)
    expect(anyInstance[$required]).toBe('atLeastOnce')
  })

  it('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true; [$required]: Always }> = 1
    assertAny

    expect(anyInstance[$key]).toBe(true)
    expect(anyInstance[$required]).toBe('always')
  })

  it('returns savedAs any (option)', () => {
    const anyInstance = any({ savedAs: 'foo' })

    const assertAny: A.Contains<typeof anyInstance, { [$savedAs]: 'foo' }> = 1
    assertAny

    expect(anyInstance[$savedAs]).toBe('foo')
  })

  it('returns savedAs any (method)', () => {
    const anyInstance = any().savedAs('foo')

    const assertAny: A.Contains<typeof anyInstance, { [$savedAs]: 'foo' }> = 1
    assertAny

    expect(anyInstance[$savedAs]).toBe('foo')
  })

  it('returns castAs any (method)', () => {
    const anyInstance = any().castAs<'foo' | 'bar'>()

    const assertAny: A.Contains<typeof anyInstance, { [$castAs]: 'foo' | 'bar' }> = 1
    assertAny

    // Keeps cast type at type level only
    expect(anyInstance[$castAs]).toBeUndefined()
  })

  it('returns any with default value (option)', () => {
    // TOIMPROVE: Add type constraints here
    const strA = any({ defaults: { key: 'hello', put: undefined, update: undefined } })
    const strB = any({ defaults: { key: undefined, put: 'world', update: undefined } })
    const sayHello = () => 'hello'
    const strC = any({ defaults: { key: undefined, put: undefined, update: sayHello } })

    const assertAnyA: A.Contains<
      typeof strA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$defaults]).toStrictEqual({ key: 'hello', put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$defaults]).toStrictEqual({ key: undefined, put: 'world', update: undefined })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  it('returns any with default value (method)', () => {
    const strA = any().keyDefault('hello')
    const strB = any().putDefault('world')
    const sayHello = () => 'hello'
    const strC = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<
      typeof strA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$defaults]).toStrictEqual({ key: 'hello', put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$defaults]).toStrictEqual({ key: undefined, put: 'world', update: undefined })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  it('returns any with PUT default value if it is not key (default shorthand)', () => {
    const str = any().default('hello')

    const assertAny: A.Contains<
      typeof str,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAny

    expect(str[$defaults]).toStrictEqual({ key: undefined, put: 'hello', update: undefined })
  })

  it('returns any with KEY default value if it is key (default shorthand)', () => {
    const str = any().key().default('hello')

    const assertAny: A.Contains<
      typeof str,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAny

    expect(str[$defaults]).toStrictEqual({ key: 'hello', put: undefined, update: undefined })
  })

  it('returns any with linked value (option)', () => {
    // TOIMPROVE: Add type constraints here
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true
    const strA = any({ links: { key: sayHello, put: undefined, update: undefined } })
    const strB = any({ links: { key: undefined, put: say42, update: undefined } })
    const strC = any({ links: { key: undefined, put: undefined, update: sayTrue } })

    const assertAnyA: A.Contains<
      typeof strA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$links]).toStrictEqual({ key: undefined, put: say42, update: undefined })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayTrue })
  })

  it('returns any with linked value (method)', () => {
    const sayHello = () => 'hello'
    const say42 = () => 42
    const sayTrue = () => true

    const strA = any().keyLink(sayHello)
    const strB = any().putLink(say42)
    const strC = any().updateLink(sayTrue)

    const assertAnyA: A.Contains<
      typeof strA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAnyB

    expect(strB[$links]).toStrictEqual({ key: undefined, put: say42, update: undefined })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertAnyC

    expect(strC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayTrue })
  })

  it('returns any with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = any().link(sayHello)

    const assertAny: A.Contains<
      typeof str,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertAny

    expect(str[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  it('returns any with KEY link value if it is key (link shorthand)', () => {
    const sayHello = () => 'hello'
    const str = any().key().link(sayHello)

    const assertAny: A.Contains<
      typeof str,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertAny

    expect(str[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
  })
})
