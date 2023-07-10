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
          key: undefined
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
        key: undefined,
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
    const strA = any({ defaults: { key: 'hello', put: undefined, update: undefined } })
    const strB = any({ defaults: { key: undefined, put: 'world', update: undefined } })
    const sayHello = () => 'hello'
    const strC = any({ defaults: { key: undefined, put: undefined, update: sayHello } })

    const assertAnyA: A.Contains<
      typeof strA,
      // NOTE: We could narrow more and have 'hello' instead of string here, but not high prio right now
      { [$defaults]: { key: string; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA).toMatchObject({ [$defaults]: { key: 'hello', put: undefined, update: undefined } })

    const assertAnyB: A.Contains<
      typeof strB,
      // NOTE: We could narrow more and have 'world' instead of string here, but not high prio right now
      { [$defaults]: { key: undefined; put: string; update: undefined } }
    > = 1
    assertAnyB

    expect(strB).toMatchObject({ [$defaults]: { key: undefined, put: 'world', update: undefined } })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$defaults]: { key: undefined; put: undefined; update: () => string } }
    > = 1
    assertAnyC

    expect(strC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: sayHello }
    })
  })

  it('returns any with default value (method)', () => {
    const strA = any().keyDefault('hello')
    const strB = any().putDefault('world')
    const sayHello = () => 'hello'
    const strC = any().updateDefault(sayHello)

    const assertAnyA: A.Contains<
      typeof strA,
      { [$defaults]: { key: 'hello'; put: undefined; update: undefined } }
    > = 1
    assertAnyA

    expect(strA).toMatchObject({ [$defaults]: { key: 'hello', put: undefined, update: undefined } })

    const assertAnyB: A.Contains<
      typeof strB,
      { [$defaults]: { key: undefined; put: 'world'; update: undefined } }
    > = 1
    assertAnyB

    expect(strB).toMatchObject({ [$defaults]: { put: 'world', update: undefined } })

    const assertAnyC: A.Contains<
      typeof strC,
      { [$defaults]: { key: undefined; put: undefined; update: () => string } }
    > = 1
    assertAnyC

    expect(strC).toMatchObject({ [$defaults]: { put: undefined, update: sayHello } })
  })

  it('returns any with PUT default value if it is not key (default shorthand)', () => {
    const str = any().default('hello')

    const assertAny: A.Contains<
      typeof str,
      { [$defaults]: { key: undefined; put: 'hello'; update: undefined } }
    > = 1
    assertAny

    expect(str).toMatchObject({
      [$defaults]: { key: undefined, put: 'hello', update: undefined }
    })
  })

  it('returns any with KEY default value if it is key (default shorthand)', () => {
    const str = any().key().default('hello')

    const assertAny: A.Contains<
      typeof str,
      { [$defaults]: { key: 'hello'; put: undefined; update: undefined } }
    > = 1
    assertAny

    expect(str).toMatchObject({
      [$defaults]: { key: 'hello', put: undefined, update: undefined }
    })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const anyInstance = any({
      defaults: { key: undefined, put: ComputedDefault, update: undefined }
    })

    const assertAny: A.Contains<
      typeof anyInstance,
      { [$defaults]: { key: undefined; put: ComputedDefault; update: undefined } }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({
      [$defaults]: { key: undefined, put: ComputedDefault, update: undefined }
    })
  })

  it('accepts ComputedDefault as default value (method)', () => {
    const anyInstance = any().updateDefault(ComputedDefault)

    const assertAny: A.Contains<
      typeof anyInstance,
      { [$defaults]: { key: undefined; put: undefined; update: ComputedDefault } }
    > = 1
    assertAny

    expect(anyInstance).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: ComputedDefault }
    })
  })
})
