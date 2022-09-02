import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'

import { any } from './typer'

describe('any', () => {
  it('returns default string', () => {
    const anyInstance = any()

    const assertAny: A.Contains<
      typeof anyInstance,
      {
        _type: 'any'
        _required: Never
        _hidden: false
        _savedAs: undefined
        _key: false
        _default: undefined
      }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({
      _type: 'any',
      _required: 'never',
      _hidden: false,
      _savedAs: undefined,
      _key: false,
      _default: undefined
    })
  })

  it('returns required any (option)', () => {
    const anyAtLeastOnce = any({ required: 'atLeastOnce' })
    const anyOnlyOnce = any({ required: 'onlyOnce' })
    const anyAlways = any({ required: 'always' })
    const anyNever = any({ required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof anyOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof anyAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { _required: Never }> = 1
    assertNever

    expect(anyAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(anyOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(anyAlways).toMatchObject({ _required: 'always' })
    expect(anyNever).toMatchObject({ _required: 'never' })
  })

  it('returns required any (method)', () => {
    const anyAtLeastOnce = any().required()
    const anyOnlyOnce = any().required('onlyOnce')
    const anyAlways = any().required('always')
    const anyNever = any().required('never')

    const assertAtLeastOnce: A.Contains<typeof anyAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof anyOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof anyAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof anyNever, { _required: Never }> = 1
    assertNever

    expect(anyAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(anyOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(anyAlways).toMatchObject({ _required: 'always' })
    expect(anyNever).toMatchObject({ _required: 'never' })
  })

  it('returns hidden any (option)', () => {
    const anyInstance = any({ hidden: true })

    const assertAny: A.Contains<typeof anyInstance, { _hidden: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _hidden: true })
  })

  it('returns hidden any (method)', () => {
    const anyInstance = any().hidden()

    const assertAny: A.Contains<typeof anyInstance, { _hidden: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _hidden: true })
  })

  it('returns key any (option)', () => {
    const anyInstance = any({ key: true })

    const assertAny: A.Contains<typeof anyInstance, { _key: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _key: true })
  })

  it('returns key any (method)', () => {
    const anyInstance = any().key()

    const assertAny: A.Contains<typeof anyInstance, { _key: true }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _key: true })
  })

  it('returns savedAs any (option)', () => {
    const anyInstance = any({ savedAs: 'foo' })

    const assertAny: A.Contains<typeof anyInstance, { _savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs any (method)', () => {
    const anyInstance = any().savedAs('foo')

    const assertAny: A.Contains<typeof anyInstance, { _savedAs: 'foo' }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns any with default value (option)', () => {
    const strA = any({ default: 'hello' })
    const sayHello = () => 'hello'
    const strB = any({ default: sayHello })

    const assertAnyA: A.Contains<typeof strA, { _default: 'hello' }> = 1
    assertAnyA

    expect(strA).toMatchObject({ _default: 'hello' })

    const assertAnyB: A.Contains<typeof strB, { _default: () => string }> = 1
    assertAnyB

    expect(strB).toMatchObject({ _default: sayHello })
  })

  it('returns any with default value (method)', () => {
    const strA = any().default('hello')
    const sayHello = () => 'hello'
    const strB = any().default(sayHello)

    const assertAnyA: A.Contains<typeof strA, { _default: 'hello' }> = 1
    assertAnyA

    expect(strA).toMatchObject({ _default: 'hello' })

    const assertAnyB: A.Contains<typeof strB, { _default: () => string }> = 1
    assertAnyB

    expect(strB).toMatchObject({ _default: sayHello })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any({ default: ComputedDefault })

    const assertAny: A.Contains<typeof anyInstance, { _default: ComputedDefault }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any().default(ComputedDefault)

    const assertAny: A.Contains<typeof anyInstance, { _default: ComputedDefault }> = 1
    assertAny

    expect(anyInstance).toMatchObject({ _default: ComputedDefault })
  })
})
