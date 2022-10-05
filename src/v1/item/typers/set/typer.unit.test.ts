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
  const str = string().required()

  it('rejects non-required elements', () => {
    // @ts-expect-error
    set(string())

    // @ts-expect-error
    expect(() => validateSet(set(string()))).toThrow(
      // forces line break
      new OptionalSetElementsError({})
    )
  })

  it('rejects hidden elements', () => {
    // @ts-expect-error
    set(str.hidden())

    // @ts-expect-error
    expect(() => validateSet(set(str.hidden()))).toThrow(
      // forces line break
      new HiddenSetElementsError({})
    )
  })

  it('rejects elements with savedAs values', () => {
    // @ts-expect-error
    set(str.savedAs('foo'))

    // @ts-expect-error
    expect(() => validateSet(set(str.savedAs('foo')))).toThrow(
      // forces line break
      new SavedAsSetElementsError({})
    )
  })

  it('rejects elements with default values', () => {
    // @ts-expect-error
    set(str.default('foo'))

    // @ts-expect-error
    expect(() => validateSet(set(str.default('foo')))).toThrow(
      // forces line break
      new DefaultedSetElementsError({})
    )

    // @ts-expect-error
    set(str.default(ComputedDefault))

    // @ts-expect-error
    expect(() => validateSet(set(str.default(ComputedDefault)))).toThrow(
      // forces line break
      new DefaultedSetElementsError({})
    )
  })

  it('returns default set', () => {
    const st = set(str)

    const assertSet: A.Contains<
      typeof st,
      {
        _type: 'set'
        _elements: typeof str
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
      _elements: str,
      _required: 'never',
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required set (option)', () => {
    const stAtLeastOnce = set(str, { required: 'atLeastOnce' })
    const stOnlyOnce = set(str, { required: 'onlyOnce' })
    const stAlways = set(str, { required: 'always' })
    const stNever = set(str, { required: 'never' })

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
    const stAtLeastOnce = set(str).required()
    const stOnlyOnce = set(str).required('onlyOnce')
    const stAlways = set(str).required('always')
    const stNever = set(str).required('never')

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
    const st = set(str, { hidden: true })

    const assertSet: A.Contains<typeof st, { _hidden: true }> = 1
    assertSet

    expect(st).toMatchObject({ _hidden: true })
  })

  it('returns hidden set (method)', () => {
    const st = set(str).hidden()

    const assertSet: A.Contains<typeof st, { _hidden: true }> = 1
    assertSet

    expect(st).toMatchObject({ _hidden: true })
  })

  it('returns key set (option)', () => {
    const st = set(str, { key: true })

    const assertSet: A.Contains<typeof st, { _key: true }> = 1
    assertSet

    expect(st).toMatchObject({ _key: true })
  })

  it('returns key set (method)', () => {
    const st = set(str).key()

    const assertSet: A.Contains<typeof st, { _key: true }> = 1
    assertSet

    expect(st).toMatchObject({ _key: true })
  })

  it('returns savedAs set (option)', () => {
    const st = set(str, { savedAs: 'foo' })

    const assertSet: A.Contains<typeof st, { _savedAs: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs set (method)', () => {
    const st = set(str).savedAs('foo')

    const assertSet: A.Contains<typeof st, { _savedAs: 'foo' }> = 1
    assertSet

    expect(st).toMatchObject({ _savedAs: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(str, { default: ComputedDefault })

    const assertSet: A.Contains<typeof st, { _default: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const st = set(str).default(ComputedDefault)

    const assertSet: A.Contains<typeof st, { _default: ComputedDefault }> = 1
    assertSet

    expect(st).toMatchObject({ _default: ComputedDefault })
  })
})
