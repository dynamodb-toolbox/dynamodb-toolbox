import { A } from 'ts-toolbelt'

import { string } from './leaf'
import { list } from './list'
import { ComputedDefault } from './utility'

describe('list', () => {
  const str = string().required()

  it('rejects non-required elements', () => {
    // @ts-expect-error
    expect(() => list(string())).toThrowError('List elements must be required')
  })

  it('rejects hidden elements', () => {
    // @ts-expect-error
    expect(() => list(string().required().hidden())).toThrowError('List elements cannot be hidden')
  })

  it('rejects elements with savedAs values', () => {
    // @ts-expect-error
    expect(() => list(string().required().savedAs('foo'))).toThrowError(
      'List elements cannot be renamed (have savedAs option)'
    )
  })

  it('rejects elements with default values', () => {
    // @ts-expect-error
    expect(() => list(string().required().default('foo'))).toThrowError(
      'List elements cannot have default values'
    )

    // @ts-expect-error
    expect(() => list(string().required().default(ComputedDefault))).toThrowError(
      'List elements cannot have default values'
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
        _savedAs: undefined
        _default: undefined
      }
    > = 1
    assertList

    expect(lst).toMatchObject({
      _type: 'list',
      _elements: str,
      _required: false,
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
          _savedAs: undefined
          _default: undefined
        }
        _required: false
        _hidden: false
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
        _savedAs: undefined,
        _default: undefined
      },
      _required: false,
      _hidden: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
