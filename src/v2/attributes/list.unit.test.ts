import { A } from 'ts-toolbelt'

import { string } from './leaf'
import {
  DefaultedListElementsError,
  HiddenListElementsError,
  KeyListElementsError,
  list,
  OptionalListElementsError,
  SavedAsListElementsError,
  validateList
} from './list'
import { ComputedDefault } from './utility'

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
        _required: false
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
      _required: false,
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required list (option)', () => {
    const lst = list(str, { required: true })

    const assertList: A.Contains<typeof lst, { _required: true }> = 1
    assertList

    expect(lst).toMatchObject({ _required: true })
  })

  it('returns required list (method)', () => {
    const lst = list(str).required()

    const assertList: A.Contains<typeof lst, { _required: true }> = 1
    assertList

    expect(lst).toMatchObject({ _required: true })
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
          _required: true
          _hidden: false
          _key: false
          _savedAs: undefined
          _default: undefined
        }
        _required: false
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
        _required: true,
        _hidden: false,
        _key: false,
        _savedAs: undefined,
        _default: undefined
      },
      _required: false,
      _hidden: false,
      _key: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
