import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, Always } from '../constants'
import { $type, $required, $hidden, $key, $savedAs, $defaults } from '../constants/attributeOptions'

import { freezeAnyAttribute } from './freeze'
import type { $AnyAttribute, AnyAttribute } from './interface'

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
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertAny

    const assertExtends: A.Extends<typeof anyInstance, $AnyAttribute> = 1
    assertExtends

    const frozenAny = freezeAnyAttribute(anyInstance, 'some.path')
    const assertFrozenExtends: A.Extends<typeof frozenAny, AnyAttribute> = 1
    assertFrozenExtends

    expect(anyInstance).toMatchObject({
      [$type]: 'any',
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$savedAs]: undefined,
      [$key]: false,
      [$defaults]: {
        put: undefined,
        update: undefined
      }
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

    expect(anyAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyAlways).toMatchObject({ [$required]: 'always' })
    expect(anyNever).toMatchObject({ [$required]: 'never' })
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

    expect(anyAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyAlways).toMatchObject({ [$required]: 'always' })
    expect(anyNever).toMatchObject({ [$required]: 'never' })
    expect(anyOpt).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden any (option)', () => {
    const anyInstance = any({ hidden: true })

    const assertAny: A.Contains<typeof anyInstance, { [$hidden]: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden any (method)', () => {
    const anyInstance = any().hidden()

    const assertAny: A.Contains<typeof anyInstance, { [$hidden]: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$hidden]: true })
  })

  it('returns key any (option)', () => {
    const anyInstance = any({ key: true })

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true; [$required]: Always }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$key]: true, [$required]: 'always' })
  })

  it('returns savedAs any (option)', () => {
    const anyInstance = any({ savedAs: 'foo' })

    const assertAny: A.Contains<typeof anyInstance, { [$savedAs]: 'foo' }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs any (method)', () => {
    const anyInstance = any().savedAs('foo')

    const assertAny: A.Contains<typeof anyInstance, { [$savedAs]: 'foo' }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns any with default value (option)', () => {
    const strA = any({ defaults: { put: 'hello', update: undefined } })
    const sayHello = () => 'hello'
    const strB = any({ defaults: { put: undefined, update: sayHello } })

    const assertAnyA: A.Contains<
      typeof strA,
      // NOTE: We could narrow more and have 'hello' instead of string here, but not high prio right now
      { [$defaults]: { put: string; update: undefined } }
    > = 1
    assertAnyA

    expect(strA).toMatchObject({ [$defaults]: { put: 'hello', update: undefined } })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$defaults]: { put: undefined; update: () => string } }
    > = 1
    assertAnyB

    expect(strB).toMatchObject({ [$defaults]: { put: undefined, update: sayHello } })
  })

  it('returns any with default value (method)', () => {
    const strA = any().putDefault('hello')
    const sayHello = () => 'hello'
    const strB = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<
      typeof strA,
      { [$defaults]: { put: 'hello'; update: undefined } }
    > = 1
    assertAnyA

    expect(strA).toMatchObject({ [$defaults]: { put: 'hello', update: undefined } })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$defaults]: { put: undefined; update: () => string } }
    > = 1
    assertAnyB

    expect(strB).toMatchObject({ [$defaults]: { put: undefined, update: sayHello } })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any({ defaults: { put: ComputedDefault, update: undefined } })

    const assertAny: A.Contains<
      typeof anyInstance,
      { [$defaults]: { put: ComputedDefault; update: undefined } }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$defaults]: { put: ComputedDefault, update: undefined } })
  })

  it('accepts ComputedDefault as default value (method)', () => {
    const anyInstance = any().updateDefault(ComputedDefault)

    const assertAny: A.Contains<
      typeof anyInstance,
      { [$defaults]: { put: undefined; update: ComputedDefault } }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({
      [$defaults]: { put: undefined, update: ComputedDefault }
    })
  })

  it('accepts ComputedDefault as default values (method)', () => {
    const anyInstance = any().defaults(ComputedDefault)

    const assertAny: A.Contains<
      typeof anyInstance,
      { [$defaults]: { put: ComputedDefault; update: ComputedDefault } }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({
      [$defaults]: { put: ComputedDefault, update: ComputedDefault }
    })
  })
})
