import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../leaf'

import { set } from './typer'
import {
  DefaultedSetElementsError,
  HiddenSetElementsError,
  OptionalSetElementsError,
  SavedAsSetElementsError,
  validateSet
} from './validate'

describe('set', () => {
  const strElement = string().required()

  it('rejects non-required elements', () => {
    // @ts-expect-error
    set(string())

    // @ts-expect-error
    expect(() => validateSet(set(string()))).toThrow(
      // @prettier-ignore - force a line break
      new OptionalSetElementsError({})
    )
  })

  it('rejects hidden elements', () => {
    // @ts-expect-error
    set(strElement.hidden())

    // @ts-expect-error
    expect(() => validateSet(set(strElement.hidden()))).toThrow(
      // @prettier-ignore - force a line break
      new HiddenSetElementsError({})
    )
  })

  it('rejects elements with savedAs values', () => {
    // @ts-expect-error
    set(strElement.savedAs('foo'))

    // @ts-expect-error
    expect(() => validateSet(set(strElement.savedAs('foo')))).toThrow(
      // @prettier-ignore - force a line break
      new SavedAsSetElementsError({})
    )
  })

  it('rejects elements with default values', () => {
    // @ts-expect-error
    set(strElement.default('foo'))

    // @ts-expect-error
    expect(() => validateSet(set(strElement.default('foo')))).toThrow(
      // @prettier-ignore - force a line break
      new DefaultedSetElementsError({})
    )

    // @ts-expect-error
    set(strElement.default(ComputedDefault))

    // @ts-expect-error
    expect(() => validateSet(set(strElement.default(ComputedDefault)))).toThrow(
      // @prettier-ignore - force a line break
      new DefaultedSetElementsError({})
    )
  })

  it('returns default set', () => {
    const st = set(strElement)

    const assertSet: A.Contains<
      typeof st,
      {
        _type: 'set'
        _elements: typeof strElement
        _required: Never
        _hidden: false
        _key: false
        _savedAs: undefined
        _default: undefined
      }
    > = 1
    assertSet

    expect(st).toMatchObject({
      _type: 'set',
      _elements: strElement,
      _required: 'never',
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required set (option)', () => {
    const stAtLeastOnce = set(strElement, { required: 'atLeastOnce' })
    const stOnlyOnce = set(strElement, { required: 'onlyOnce' })
    const stAlways = set(strElement, { required: 'always' })
    const stNever = set(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof stOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof stAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { _required: Never }> = 1
    assertNever

    expect(stAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(stOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(stAlways).toMatchObject({ _required: 'always' })
    expect(stNever).toMatchObject({ _required: 'never' })
  })

  it('returns required set (method)', () => {
    const stAtLeastOnce = set(strElement).required()
    const stOnlyOnce = set(strElement).required('onlyOnce')
    const stAlways = set(strElement).required('always')
    const stNever = set(strElement).required('never')

    const assertAtLeastOnce: A.Contains<typeof stAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof stOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof stAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof stNever, { _required: Never }> = 1
    assertNever

    expect(stAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(stOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(stAlways).toMatchObject({ _required: 'always' })
    expect(stNever).toMatchObject({ _required: 'never' })
  })

  it('returns hidden set (option)', () => {
    const st = set(strElement, { hidden: true })

    const assertSet: A.Contains<typeof st, { _hidden: true }> = 1
    assertSet

    expect(st).toMatchObject({ _hidden: true })
  })

  it('returns hidden set (method)', () => {
    const st = set(strElement).hidden()

    const assertSet: A.Contains<typeof st, { _hidden: true }> = 1
    assertSet

    expect(st).toMatchObject({ _hidden: true })
  })

  it('returns key set (option)', () => {
    const st = set(strElement, { key: true })

    const assertSet: A.Contains<typeof st, { _key: true }> = 1
    assertSet

    expect(st).toMatchObject({ _key: true })
  })

  it('returns key set (method)', () => {
    const st = set(strElement).key()

    const assertSet: A.Contains<typeof st, { _key: true }> = 1
    assertSet

    expect(st).toMatchObject({ _key: true })
  })

  it('returns savedAs set (option)', () => {
    const st = set(strElement, { savedAs: 'foo' })

    const assertSet: A.Contains<typeof st, { _savedAs: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs set (method)', () => {
    const st = set(strElement).savedAs('foo')

    const assertSet: A.Contains<typeof st, { _savedAs: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ _savedAs: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(strElement, { default: ComputedDefault })

    const assertSet: A.Contains<typeof st, { _default: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(strElement).default(ComputedDefault)

    const assertSet: A.Contains<typeof st, { _default: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ _default: ComputedDefault })
  })
})
