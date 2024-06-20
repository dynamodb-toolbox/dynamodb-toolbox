import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import {
  $defaults,
  $elements,
  $hidden,
  $key,
  $links,
  $required,
  $savedAs,
  $type
} from '../constants/attributeOptions.js'
import { Always, AtLeastOnce, Never } from '../constants/index.js'
import { string } from '../primitive/index.js'
import { $SetAttributeState, SetAttribute } from './interface.js'
import { set } from './typer.js'

describe('set', () => {
  const path = 'some.path'
  const strElement = string()

  test('rejects non-required elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => invalidSet.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => invalidSet.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => invalidSet.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.default('foo')
    )

    const invalidCall = () => invalidSet.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.link(() => 'foo')
    )

    const invalidCall = () => invalidSet.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
    )
  })

  test('returns default set', () => {
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
        [$links]: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertSet

    const assertExtends: A.Extends<typeof st, $SetAttributeState> = 1
    assertExtends

    const frozenSet = st.freeze(path)
    const assertFrozenExtends: A.Extends<typeof frozenSet, SetAttribute> = 1
    assertFrozenExtends

    expect(st[$type]).toBe('set')
    expect(st[$elements]).toBe(strElement)
    expect(st[$required]).toBe('atLeastOnce')
    expect(st[$key]).toBe(false)
    expect(st[$savedAs]).toBe(undefined)
    expect(st[$hidden]).toBe(false)
    expect(st[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
    expect(st[$links]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
  })

  test('returns required set (option)', () => {
    const stAtLeastOnce = set(strElement, { required: 'atLeastOnce' })
    const stAlways = set(strElement, { required: 'always' })
    const stNever = set(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof stAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { [$required]: Never }> = 1
    assertNever

    expect(stAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(stAlways[$required]).toBe('always')
    expect(stNever[$required]).toBe('never')
  })

  test('returns required set (method)', () => {
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

    expect(stAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(stAlways[$required]).toBe('always')
    expect(stNever[$required]).toBe('never')
    expect(stOpt[$required]).toBe('never')
  })

  test('returns hidden set (option)', () => {
    const st = set(strElement, { hidden: true })

    const assertSet: A.Contains<typeof st, { [$hidden]: true }> = 1
    assertSet

    expect(st[$hidden]).toBe(true)
  })

  test('returns hidden set (method)', () => {
    const st = set(strElement).hidden()

    const assertSet: A.Contains<typeof st, { [$hidden]: true }> = 1
    assertSet

    expect(st[$hidden]).toBe(true)
  })

  test('returns key set (option)', () => {
    const st = set(strElement, { key: true })

    const assertSet: A.Contains<typeof st, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertSet

    expect(st[$key]).toBe(true)
    expect(st[$required]).toBe('atLeastOnce')
  })

  test('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<typeof st, { [$key]: true; [$required]: Always }> = 1
    assertSet

    expect(st[$key]).toBe(true)
    expect(st[$required]).toBe('always')
  })

  test('returns savedAs set (option)', () => {
    const st = set(strElement, { savedAs: 'foo' })

    const assertSet: A.Contains<typeof st, { [$savedAs]: 'foo' }> = 1
    assertSet

    expect(st[$savedAs]).toBe('foo')
  })

  test('returns savedAs set (method)', () => {
    const st = set(strElement).savedAs('foo')

    const assertSet: A.Contains<typeof st, { [$savedAs]: 'foo' }> = 1
    assertSet

    expect(st[$savedAs]).toBe('foo')
  })

  test('returns defaulted set (option)', () => {
    const stA = set(strElement, {
      defaults: { key: new Set(['foo']), put: undefined, update: undefined }
    })

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA[$defaults]).toStrictEqual({
      key: new Set(['foo']),
      put: undefined,
      update: undefined
    })

    const stB = set(strElement, {
      defaults: { key: undefined, put: new Set(['bar']), update: undefined }
    })

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB[$defaults]).toStrictEqual({
      key: undefined,
      put: new Set(['bar']),
      update: undefined
    })

    const stC = set(strElement, {
      defaults: { key: undefined, put: undefined, update: new Set(['baz']) }
    })

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: new Set(['baz'])
    })
  })

  test('returns defaulted set (method)', () => {
    const stA = set(strElement).keyDefault(new Set(['foo']))

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA[$defaults]).toStrictEqual({
      key: new Set(['foo']),
      put: undefined,
      update: undefined
    })

    const stB = set(strElement).putDefault(new Set(['bar']))

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB[$defaults]).toStrictEqual({
      key: undefined,
      put: new Set(['bar']),
      update: undefined
    })

    const stC = set(strElement).updateDefault(new Set(['baz']))

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC[$defaults]).toStrictEqual({
      key: undefined,
      put: undefined,
      update: new Set(['baz'])
    })
  })

  test('returns set with PUT default value if it is not key (default shorthand)', () => {
    const st = set(string()).default(new Set(['foo']))

    const assertSt: A.Contains<
      typeof st,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSt

    expect(st[$defaults]).toStrictEqual({
      key: undefined,
      put: new Set(['foo']),
      update: undefined
    })
  })

  test('returns set with KEY default value if it is key (default shorthand)', () => {
    const st = set(string())
      .key()
      .default(new Set(['foo']))

    const assertSt: A.Contains<
      typeof st,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSt

    expect(st[$defaults]).toStrictEqual({
      key: new Set(['foo']),
      put: undefined,
      update: undefined
    })
  })

  test('returns linked set (option)', () => {
    const sayHello = () => new Set(['hello'])

    const stA = set(strElement, {
      links: { key: sayHello, put: undefined, update: undefined }
    })

    const assertSetA: A.Contains<
      typeof stA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const stB = set(strElement, {
      links: { key: undefined, put: sayHello, update: undefined }
    })

    const assertSetB: A.Contains<
      typeof stB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const stC = set(strElement, {
      links: { key: undefined, put: undefined, update: sayHello }
    })

    const assertSetC: A.Contains<
      typeof stC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns linked set (method)', () => {
    const sayHello = () => new Set(['hello'])
    const stA = set(strElement).keyLink(sayHello)

    const assertSetA: A.Contains<
      typeof stA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const stB = set(strElement).putLink(sayHello)

    const assertSetB: A.Contains<
      typeof stB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const stC = set(strElement).updateLink(sayHello)

    const assertSetC: A.Contains<
      typeof stC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns set with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).link(sayHello)

    const assertSt: A.Contains<
      typeof st,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSt

    expect(st[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  test('returns set with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).key().link(sayHello)

    const assertSt: A.Contains<
      typeof st,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSt

    expect(st[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
  })
})
