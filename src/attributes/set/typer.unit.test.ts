import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { SetSchema } from './interface.js'
import { set } from './typer.js'

describe('set', () => {
  const path = 'some.path'
  const strElement = string()

  test('rejects non-required elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      string().optional()
    )

    const superInvalidCall = () => invalidSet.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.hidden()
    )

    const superInvalidCall = () => invalidSet.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const superInvalidCall = () => invalidSet.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.default('foo')
    )

    const superInvalidCall = () => invalidSet.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.link(() => 'foo')
    )

    const superInvalidCall = () => invalidSet.check(path)

    expect(superInvalidCall).toThrow(DynamoDBToolboxError)
    expect(superInvalidCall).toThrow(
      expect.objectContaining({ code: 'schema.setAttribute.defaultedElements', path })
    )
  })

  test('returns default set', () => {
    const st = set(strElement)

    const assertType: A.Equals<(typeof st)['type'], 'set'> = 1
    assertType
    expect(st.type).toBe('set')

    const assertState: A.Equals<(typeof st)['state'], {}> = 1
    assertState
    expect(st.state).toStrictEqual({})

    const assertElmt: A.Equals<(typeof st)['elements'], typeof strElement> = 1
    assertElmt
    expect(st.elements).toBe(strElement)

    const assertExtends: A.Extends<typeof st, SetSchema> = 1
    assertExtends
  })

  test('returns required set (option)', () => {
    const stAtLeastOnce = set(strElement, { required: 'atLeastOnce' })
    const stAlways = set(strElement, { required: 'always' })
    const stNever = set(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof stAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof stAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof stNever)['state'], { required: Never }> = 1
    assertNever

    expect(stAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(stAlways.state.required).toBe('always')
    expect(stNever.state.required).toBe('never')
  })

  test('returns required set (method)', () => {
    const stAtLeastOnce = set(strElement).required()
    const stAlways = set(strElement).required('always')
    const stNever = set(strElement).required('never')
    const stOpt = set(strElement).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof stAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof stAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof stNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof stOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(stAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(stAlways.state.required).toBe('always')
    expect(stNever.state.required).toBe('never')
    expect(stOpt.state.required).toBe('never')
  })

  test('returns hidden set (option)', () => {
    const st = set(strElement, { hidden: true })

    const assertSet: A.Contains<(typeof st)['state'], { hidden: true }> = 1
    assertSet

    expect(st.state.hidden).toBe(true)
  })

  test('returns hidden set (method)', () => {
    const st = set(strElement).hidden()

    const assertSet: A.Contains<(typeof st)['state'], { hidden: true }> = 1
    assertSet

    expect(st.state.hidden).toBe(true)
  })

  test('returns key set (option)', () => {
    const st = set(strElement, { key: true })

    const assertSet: A.Contains<(typeof st)['state'], { key: true }> = 1
    assertSet

    expect(st.state.key).toBe(true)
  })

  test('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<(typeof st)['state'], { key: true; required: Always }> = 1
    assertSet

    expect(st.state.key).toBe(true)
    expect(st.state.required).toBe('always')
  })

  test('returns savedAs set (option)', () => {
    const st = set(strElement, { savedAs: 'foo' })

    const assertSet: A.Contains<(typeof st)['state'], { savedAs: 'foo' }> = 1
    assertSet

    expect(st.state.savedAs).toBe('foo')
  })

  test('returns savedAs set (method)', () => {
    const st = set(strElement).savedAs('foo')

    const assertSet: A.Contains<(typeof st)['state'], { savedAs: 'foo' }> = 1
    assertSet

    expect(st.state.savedAs).toBe('foo')
  })

  test('returns defaulted set (option)', () => {
    const stA = set(strElement, { keyDefault: new Set(['foo']) })

    const assertSetA: A.Contains<(typeof stA)['state'], { keyDefault: unknown }> = 1
    assertSetA

    expect(stA.state.keyDefault).toStrictEqual(new Set(['foo']))

    const stB = set(strElement, { putDefault: new Set(['bar']) })

    const assertSetB: A.Contains<(typeof stB)['state'], { putDefault: unknown }> = 1
    assertSetB

    expect(stB.state.putDefault).toStrictEqual(new Set(['bar']))

    const stC = set(strElement, { updateDefault: new Set(['baz']) })

    const assertSetC: A.Contains<(typeof stC)['state'], { updateDefault: unknown }> = 1
    assertSetC

    expect(stC.state.updateDefault).toStrictEqual(new Set(['baz']))
  })

  test('returns defaulted set (method)', () => {
    const stA = set(strElement).keyDefault(new Set(['foo']))

    const assertSetA: A.Contains<(typeof stA)['state'], { keyDefault: unknown }> = 1
    assertSetA

    expect(stA.state.keyDefault).toStrictEqual(new Set(['foo']))

    const stB = set(strElement).putDefault(new Set(['bar']))

    const assertSetB: A.Contains<(typeof stB)['state'], { putDefault: unknown }> = 1
    assertSetB

    expect(stB.state.putDefault).toStrictEqual(new Set(['bar']))

    const stC = set(strElement).updateDefault(new Set(['baz']))

    const assertSetC: A.Contains<(typeof stC)['state'], { updateDefault: unknown }> = 1
    assertSetC

    expect(stC.state.updateDefault).toStrictEqual(new Set(['baz']))
  })

  test('returns set with PUT default value if it is not key (default shorthand)', () => {
    const st = set(string()).default(new Set(['foo']))

    const assertSt: A.Contains<(typeof st)['state'], { putDefault: unknown }> = 1
    assertSt

    expect(st.state.putDefault).toStrictEqual(new Set(['foo']))
  })

  test('returns set with KEY default value if it is key (default shorthand)', () => {
    const st = set(string())
      .key()
      .default(new Set(['foo']))

    const assertSt: A.Contains<(typeof st)['state'], { keyDefault: unknown }> = 1
    assertSt

    expect(st.state.keyDefault).toStrictEqual(new Set(['foo']))
  })

  test('returns linked set (option)', () => {
    const sayHello = () => new Set(['hello'])

    const stA = set(strElement, { keyLink: sayHello })

    const assertSetA: A.Contains<(typeof stA)['state'], { keyLink: unknown }> = 1
    assertSetA

    expect(stA.state.keyLink).toBe(sayHello)

    const stB = set(strElement, { putLink: sayHello })

    const assertSetB: A.Contains<(typeof stB)['state'], { putLink: unknown }> = 1
    assertSetB

    expect(stB.state.putLink).toBe(sayHello)

    const stC = set(strElement, { updateLink: sayHello })

    const assertSetC: A.Contains<(typeof stC)['state'], { updateLink: unknown }> = 1
    assertSetC

    expect(stC.state.updateLink).toBe(sayHello)
  })

  test('returns linked set (method)', () => {
    const sayHello = () => new Set(['hello'])
    const stA = set(strElement).keyLink(sayHello)

    const assertSetA: A.Contains<(typeof stA)['state'], { keyLink: unknown }> = 1
    assertSetA

    expect(stA.state.keyLink).toBe(sayHello)

    const stB = set(strElement).putLink(sayHello)

    const assertSetB: A.Contains<(typeof stB)['state'], { putLink: unknown }> = 1
    assertSetB

    expect(stB.state.putLink).toBe(sayHello)

    const stC = set(strElement).updateLink(sayHello)

    const assertSetC: A.Contains<(typeof stC)['state'], { updateLink: unknown }> = 1
    assertSetC

    expect(stC.state.updateLink).toBe(sayHello)
  })

  test('returns set with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).link(sayHello)

    const assertSt: A.Contains<(typeof st)['state'], { putLink: unknown }> = 1
    assertSt

    expect(st.state.putLink).toBe(sayHello)
  })

  test('returns set with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).key().link(sayHello)

    const assertSt: A.Contains<(typeof st)['state'], { keyLink: unknown }> = 1
    assertSt

    expect(st.state.keyLink).toBe(sayHello)
  })

  test('returns set with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const setA = set(string(), { keyValidator: pass })
    const setB = set(string(), { putValidator: pass })
    const setC = set(string(), { updateValidator: pass })

    const assertSetA: A.Contains<(typeof setA)['state'], { keyValidator: Validator }> = 1
    assertSetA

    expect(setA.state.keyValidator).toBe(pass)

    const assertSetB: A.Contains<(typeof setB)['state'], { putValidator: Validator }> = 1
    assertSetB

    expect(setB.state.putValidator).toBe(pass)

    const assertSetC: A.Contains<(typeof setC)['state'], { updateValidator: Validator }> = 1
    assertSetC

    expect(setC.state.updateValidator).toBe(pass)
  })

  test('returns set with validator (method)', () => {
    const pass = () => true

    const setA = set(string()).keyValidate(pass)
    const setB = set(string()).putValidate(pass)
    const setC = set(string()).updateValidate(pass)

    const assertSetA: A.Contains<(typeof setA)['state'], { keyValidator: Validator }> = 1
    assertSetA

    expect(setA.state.keyValidator).toBe(pass)

    const assertSetB: A.Contains<(typeof setB)['state'], { putValidator: Validator }> = 1
    assertSetB

    expect(setB.state.putValidator).toBe(pass)

    const assertSetC: A.Contains<(typeof setC)['state'], { updateValidator: Validator }> = 1
    assertSetC

    expect(setC.state.updateValidator).toStrictEqual(pass)

    const prevSet = set(string())
    prevSet.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [Set<string>, typeof prevSet]> = 1
      assertArgs

      return true
    })

    const prevOptSet = set(string()).optional()
    prevOptSet.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [Set<string>, typeof prevOptSet]> = 1
      assertArgs

      return true
    })
  })

  test('returns set with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _set = set(string()).validate(pass)

    const assertSet: A.Contains<(typeof _set)['state'], { putValidator: Validator }> = 1
    assertSet

    expect(_set.state.putValidator).toStrictEqual(pass)
  })

  test('returns set with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _set = set(string()).key().validate(pass)

    const assertSet: A.Contains<(typeof _set)['state'], { keyValidator: Validator }> = 1
    assertSet

    expect(_set.state.keyValidator).toStrictEqual(pass)
  })
})
