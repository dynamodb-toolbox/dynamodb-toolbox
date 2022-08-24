import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../leaf'

import { list } from './typer'
import {
  DefaultedListElementsError,
  HiddenListElementsError,
  KeyListElementsError,
  OptionalListElementsError,
  SavedAsListElementsError,
  validateList
} from './validate'

describe('list', () => {
  const str = string().required()

  it('rejects non-required elements', () => {
    // @ts-expect-error
    list(string())

    // @ts-expect-error
    expect(() => validateList(list(string()))).toThrow(
      // forces line break
      new OptionalListElementsError({})
    )
  })

  it('rejects hidden elements', () => {
    // @ts-expect-error
    list(string().required().hidden())

    // @ts-expect-error
    expect(() => validateList(list(string().required().hidden()))).toThrow(
      new HiddenListElementsError({})
    )
  })

  it('rejects key elements', () => {
    // @ts-expect-error
    list(string().required().key())

    // @ts-expect-error
    expect(() => validateList(list(string().required().key()))).toThrow(
      new KeyListElementsError({})
    )
  })

  it('rejects elements with savedAs values', () => {
    // @ts-expect-error
    list(string().required().savedAs('foo'))

    // @ts-expect-error
    expect(() => validateList(list(string().required().savedAs('foo')))).toThrow(
      new SavedAsListElementsError({})
    )
  })

  it('rejects elements with default values', () => {
    // @ts-expect-error
    list(string().required().default('foo'))

    // @ts-expect-error
    expect(() => validateList(list(string().required().default('foo')))).toThrow(
      new DefaultedListElementsError({})
    )

    // @ts-expect-error
    list(string().required().default(ComputedDefault))

    // @ts-expect-error
    expect(() => validateList(list(string().required().default(ComputedDefault)))).toThrow(
      new DefaultedListElementsError({})
    )
  })

  it('returns default list', () => {
    const lst = list(str)

    const assertList: A.Contains<
      typeof lst,
      {
        _type: 'list'
        _elements: typeof str
        _required: Never
        _hidden: false
        _key: false
        _savedAs: undefined
        _default: undefined
      }
    > = 1
    assertList

    expect(lst).toMatchObject({
      _type: 'list',
      _elements: str,
      _required: Never,
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required list (option)', () => {
    const lstAtLeastOnce = list(str, { required: AtLeastOnce })
    const lstOnlyOnce = list(str, { required: OnlyOnce })
    const lstAlways = list(str, { required: Always })
    const lstNever = list(str, { required: Never })

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { _required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ _required: AtLeastOnce })
    expect(lstOnlyOnce).toMatchObject({ _required: OnlyOnce })
    expect(lstAlways).toMatchObject({ _required: Always })
    expect(lstNever).toMatchObject({ _required: Never })
  })

  it('returns required list (method)', () => {
    const lstAtLeastOnce = list(str).required()
    const lstOnlyOnce = list(str).required(OnlyOnce)
    const lstAlways = list(str).required(Always)
    const lstNever = list(str).required(Never)

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { _required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ _required: AtLeastOnce })
    expect(lstOnlyOnce).toMatchObject({ _required: OnlyOnce })
    expect(lstAlways).toMatchObject({ _required: Always })
    expect(lstNever).toMatchObject({ _required: Never })
  })

  it('returns hidden list (option)', () => {
    const lst = list(str, { hidden: true })

    const assertList: A.Contains<typeof lst, { _hidden: true }> = 1
    assertList

    expect(lst).toMatchObject({ _hidden: true })
  })

  it('returns hidden list (method)', () => {
    const lst = list(str).hidden()

    const assertList: A.Contains<typeof lst, { _hidden: true }> = 1
    assertList

    expect(lst).toMatchObject({ _hidden: true })
  })

  it('returns key list (option)', () => {
    const lst = list(str, { key: true })

    const assertList: A.Contains<typeof lst, { _key: true }> = 1
    assertList

    expect(lst).toMatchObject({ _key: true })
  })

  it('returns key list (method)', () => {
    const lst = list(str).key()

    const assertList: A.Contains<typeof lst, { _key: true }> = 1
    assertList

    expect(lst).toMatchObject({ _key: true })
  })

  it('returns savedAs list (option)', () => {
    const lst = list(str, { savedAs: 'foo' })

    const assertList: A.Contains<typeof lst, { _savedAs: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs list (method)', () => {
    const lst = list(str).savedAs('foo')

    const assertList: A.Contains<typeof lst, { _savedAs: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ _savedAs: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(str, { default: ComputedDefault })

    const assertList: A.Contains<typeof lst, { _default: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(str).default(ComputedDefault)

    const assertList: A.Contains<typeof lst, { _default: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ _default: ComputedDefault })
  })

  it('list of lists', () => {
    const lst = list(list(str).required())

    const assertList: A.Contains<
      typeof lst,
      {
        _type: 'list'
        _elements: {
          _type: 'list'
          _elements: typeof str
          _required: AtLeastOnce
          _hidden: false
          _key: false
          _savedAs: undefined
          _default: undefined
        }
        _required: Never
        _hidden: false
        _key: false
        _savedAs: undefined
        _default: undefined
      }
    > = 1
    assertList

    expect(lst).toMatchObject({
      _type: 'list',
      _elements: {
        _type: 'list',
        _elements: str,
        _required: AtLeastOnce,
        _hidden: false,
        _key: false,
        _savedAs: undefined,
        _default: undefined
      },
      _required: Never,
      _hidden: false,
      _key: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
