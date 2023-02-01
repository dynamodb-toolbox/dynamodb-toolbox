import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { $type, $required, $hidden, $key, $savedAs, $default } from '../constants/attributeOptions'

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
        [$default]: undefined
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
      [$default]: undefined
    })
  })

  it('returns required any (option)', () => {
    const anyAtLeastOnce = any({ required: 'atLeastOnce' })
    const anyOnlyOnce = any({ required: 'onlyOnce' })
    const anyAlways = any({ required: 'always' })
    const anyNever = any({ required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof anyOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof anyAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { [$required]: Never }> = 1
    assertNever

    expect(anyAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(anyAlways).toMatchObject({ [$required]: 'always' })
    expect(anyNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required any (method)', () => {
    const anyAtLeastOnce = any().required()
    const anyOnlyOnce = any().required('onlyOnce')
    const anyAlways = any().required('always')
    const anyNever = any().required('never')
    const anyOpt = any().optional()

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof anyOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof anyAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof anyOpt, { [$required]: Never }> = 1
    assertOpt

    expect(anyAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(anyOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
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

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$key]: true })
  })

  it('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<typeof anyInstance, { [$key]: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$key]: true })
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
    const strA = any({ default: 'hello' })
    const sayHello = () => 'hello'
    const strB = any({ default: sayHello })

    const assertAnyA: A.Contains<typeof strA, { [$default]: 'hello' }> = 1
    assertAnyA

    expect(strA).toMatchObject({ [$default]: 'hello' })

    const assertAnyB: A.Contains<typeof strB, { [$default]: () => string }> = 1
    assertAnyB

    expect(strB).toMatchObject({ [$default]: sayHello })
  })

  it('returns any with default value (method)', () => {
    const strA = any().default('hello')
    const sayHello = () => 'hello'
    const strB = any().default(sayHello)

    const assertAnyA: A.Contains<typeof strA, { [$default]: 'hello' }> = 1
    assertAnyA

    expect(strA).toMatchObject({ [$default]: 'hello' })

    const assertAnyB: A.Contains<typeof strB, { [$default]: () => string }> = 1
    assertAnyB

    expect(strB).toMatchObject({ [$default]: sayHello })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any({ default: ComputedDefault })

    const assertAny: A.Contains<typeof anyInstance, { [$default]: ComputedDefault }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$default]: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any().default(ComputedDefault)

    const assertAny: A.Contains<typeof anyInstance, { [$default]: ComputedDefault }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ [$default]: ComputedDefault })
  })
})
