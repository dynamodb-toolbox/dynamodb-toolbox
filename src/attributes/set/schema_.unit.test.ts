import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import type { Light } from '../shared/light.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { SetSchema } from './schema.js'
import { set } from './schema_.js'

describe('set', () => {
  const path = 'some.path'
  const strElement = string()

  test('rejects non-required elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      string().optional()
    )

    const invalidCall = () => invalidSet.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.set.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.hidden()
    )

    const invalidCall = () => invalidSet.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.set.hiddenElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.savedAs('foo')
    )

    const invalidCall = () => invalidSet.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.set.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.default('foo')
    )

    const invalidCall = () => invalidSet.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.set.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidSet = set(
      // @ts-expect-error
      strElement.link(() => 'foo')
    )

    const invalidCall = () => invalidSet.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.set.defaultedElements', path })
    )
  })

  test('returns default set', () => {
    const st = set(strElement)

    const assertType: A.Equals<(typeof st)['type'], 'set'> = 1
    assertType
    expect(st.type).toBe('set')

    const assertProps: A.Equals<(typeof st)['props'], {}> = 1
    assertProps
    expect(st.props).toStrictEqual({})

    const assertElmt: A.Equals<(typeof st)['elements'], Light<typeof strElement>> = 1
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
      (typeof stAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof stAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof stNever)['props'], { required: Never }> = 1
    assertNever

    expect(stAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(stAlways.props.required).toBe('always')
    expect(stNever.props.required).toBe('never')
  })

  test('returns required set (method)', () => {
    const stAtLeastOnce = set(strElement).required()
    const stAlways = set(strElement).required('always')
    const stNever = set(strElement).required('never')
    const stOpt = set(strElement).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof stAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof stAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof stNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof stOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(stAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(stAlways.props.required).toBe('always')
    expect(stNever.props.required).toBe('never')
    expect(stOpt.props.required).toBe('never')
  })

  test('returns hidden set (option)', () => {
    const st = set(strElement, { hidden: true })

    const assertSet: A.Contains<(typeof st)['props'], { hidden: true }> = 1
    assertSet

    expect(st.props.hidden).toBe(true)
  })

  test('returns hidden set (method)', () => {
    const st = set(strElement).hidden()

    const assertSet: A.Contains<(typeof st)['props'], { hidden: true }> = 1
    assertSet

    expect(st.props.hidden).toBe(true)
  })

  test('returns key set (option)', () => {
    const st = set(strElement, { key: true })

    const assertSet: A.Contains<(typeof st)['props'], { key: true }> = 1
    assertSet

    expect(st.props.key).toBe(true)
  })

  test('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<(typeof st)['props'], { key: true; required: Always }> = 1
    assertSet

    expect(st.props.key).toBe(true)
    expect(st.props.required).toBe('always')
  })

  test('returns savedAs set (option)', () => {
    const st = set(strElement, { savedAs: 'foo' })

    const assertSet: A.Contains<(typeof st)['props'], { savedAs: 'foo' }> = 1
    assertSet

    expect(st.props.savedAs).toBe('foo')
  })

  test('returns savedAs set (method)', () => {
    const st = set(strElement).savedAs('foo')

    const assertSet: A.Contains<(typeof st)['props'], { savedAs: 'foo' }> = 1
    assertSet

    expect(st.props.savedAs).toBe('foo')
  })

  test('returns defaulted set (option)', () => {
    const stA = set(strElement, { keyDefault: new Set(['foo']) })

    const assertSetA: A.Contains<(typeof stA)['props'], { keyDefault: unknown }> = 1
    assertSetA

    expect(stA.props.keyDefault).toStrictEqual(new Set(['foo']))

    const stB = set(strElement, { putDefault: new Set(['bar']) })

    const assertSetB: A.Contains<(typeof stB)['props'], { putDefault: unknown }> = 1
    assertSetB

    expect(stB.props.putDefault).toStrictEqual(new Set(['bar']))

    const stC = set(strElement, { updateDefault: new Set(['baz']) })

    const assertSetC: A.Contains<(typeof stC)['props'], { updateDefault: unknown }> = 1
    assertSetC

    expect(stC.props.updateDefault).toStrictEqual(new Set(['baz']))
  })

  test('returns defaulted set (method)', () => {
    const stA = set(strElement).keyDefault(new Set(['foo']))

    const assertSetA: A.Contains<(typeof stA)['props'], { keyDefault: unknown }> = 1
    assertSetA

    expect(stA.props.keyDefault).toStrictEqual(new Set(['foo']))

    const stB = set(strElement).putDefault(new Set(['bar']))

    const assertSetB: A.Contains<(typeof stB)['props'], { putDefault: unknown }> = 1
    assertSetB

    expect(stB.props.putDefault).toStrictEqual(new Set(['bar']))

    const stC = set(strElement).updateDefault(new Set(['baz']))

    const assertSetC: A.Contains<(typeof stC)['props'], { updateDefault: unknown }> = 1
    assertSetC

    expect(stC.props.updateDefault).toStrictEqual(new Set(['baz']))
  })

  test('returns set with PUT default value if it is not key (default shorthand)', () => {
    const st = set(string()).default(new Set(['foo']))

    const assertSt: A.Contains<(typeof st)['props'], { putDefault: unknown }> = 1
    assertSt

    expect(st.props.putDefault).toStrictEqual(new Set(['foo']))
  })

  test('returns set with KEY default value if it is key (default shorthand)', () => {
    const st = set(string())
      .key()
      .default(new Set(['foo']))

    const assertSt: A.Contains<(typeof st)['props'], { keyDefault: unknown }> = 1
    assertSt

    expect(st.props.keyDefault).toStrictEqual(new Set(['foo']))
  })

  test('returns linked set (option)', () => {
    const sayHello = () => new Set(['hello'])

    const stA = set(strElement, { keyLink: sayHello })

    const assertSetA: A.Contains<(typeof stA)['props'], { keyLink: unknown }> = 1
    assertSetA

    expect(stA.props.keyLink).toBe(sayHello)

    const stB = set(strElement, { putLink: sayHello })

    const assertSetB: A.Contains<(typeof stB)['props'], { putLink: unknown }> = 1
    assertSetB

    expect(stB.props.putLink).toBe(sayHello)

    const stC = set(strElement, { updateLink: sayHello })

    const assertSetC: A.Contains<(typeof stC)['props'], { updateLink: unknown }> = 1
    assertSetC

    expect(stC.props.updateLink).toBe(sayHello)
  })

  test('returns linked set (method)', () => {
    const sayHello = () => new Set(['hello'])
    const stA = set(strElement).keyLink(sayHello)

    const assertSetA: A.Contains<(typeof stA)['props'], { keyLink: unknown }> = 1
    assertSetA

    expect(stA.props.keyLink).toBe(sayHello)

    const stB = set(strElement).putLink(sayHello)

    const assertSetB: A.Contains<(typeof stB)['props'], { putLink: unknown }> = 1
    assertSetB

    expect(stB.props.putLink).toBe(sayHello)

    const stC = set(strElement).updateLink(sayHello)

    const assertSetC: A.Contains<(typeof stC)['props'], { updateLink: unknown }> = 1
    assertSetC

    expect(stC.props.updateLink).toBe(sayHello)
  })

  test('returns set with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).link(sayHello)

    const assertSt: A.Contains<(typeof st)['props'], { putLink: unknown }> = 1
    assertSt

    expect(st.props.putLink).toBe(sayHello)
  })

  test('returns set with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => new Set(['hello'])
    const st = set(string()).key().link(sayHello)

    const assertSt: A.Contains<(typeof st)['props'], { keyLink: unknown }> = 1
    assertSt

    expect(st.props.keyLink).toBe(sayHello)
  })

  test('returns set with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const setA = set(string(), { keyValidator: pass })
    const setB = set(string(), { putValidator: pass })
    const setC = set(string(), { updateValidator: pass })

    const assertSetA: A.Contains<(typeof setA)['props'], { keyValidator: Validator }> = 1
    assertSetA

    expect(setA.props.keyValidator).toBe(pass)

    const assertSetB: A.Contains<(typeof setB)['props'], { putValidator: Validator }> = 1
    assertSetB

    expect(setB.props.putValidator).toBe(pass)

    const assertSetC: A.Contains<(typeof setC)['props'], { updateValidator: Validator }> = 1
    assertSetC

    expect(setC.props.updateValidator).toBe(pass)
  })

  test('returns set with validator (method)', () => {
    const pass = () => true

    const setA = set(string()).keyValidate(pass)
    const setB = set(string()).putValidate(pass)
    const setC = set(string()).updateValidate(pass)

    const assertSetA: A.Contains<(typeof setA)['props'], { keyValidator: Validator }> = 1
    assertSetA

    expect(setA.props.keyValidator).toBe(pass)

    const assertSetB: A.Contains<(typeof setB)['props'], { putValidator: Validator }> = 1
    assertSetB

    expect(setB.props.putValidator).toBe(pass)

    const assertSetC: A.Contains<(typeof setC)['props'], { updateValidator: Validator }> = 1
    assertSetC

    expect(setC.props.updateValidator).toStrictEqual(pass)

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

    const assertSet: A.Contains<(typeof _set)['props'], { putValidator: Validator }> = 1
    assertSet

    expect(_set.props.putValidator).toStrictEqual(pass)
  })

  test('returns set with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _set = set(string()).key().validate(pass)

    const assertSet: A.Contains<(typeof _set)['props'], { keyValidator: Validator }> = 1
    assertSet

    expect(_set.props.keyValidator).toStrictEqual(pass)
  })
})
