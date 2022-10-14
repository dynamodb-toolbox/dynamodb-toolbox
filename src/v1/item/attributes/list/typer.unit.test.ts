import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { string } from '../leaf'

import { list } from './typer'
import {
  DefaultedListAttributeElementsError,
  HiddenListAttributeElementsError,
  OptionalListAttributeElementsError,
  SavedAsListAttributeElementsError,
  validateListAttribute
} from './validate'

describe('list', () => {
  const strElement = string().required()

  it('rejects non-required elements', () => {
    // @ts-expect-error
    list(string())

    // @ts-expect-error
    expect(() => validateListAttribute(list(string()))).toThrow(
      // @prettier-ignore - force a line break
      new OptionalListAttributeElementsError({})
    )
  })

  it('rejects hidden elements', () => {
    // @ts-expect-error
    list(strElement.hidden())

    // @ts-expect-error
    expect(() => validateListAttribute(list(strElement.hidden()))).toThrow(
      // @prettier-ignore - force a line break
      new HiddenListAttributeElementsError({})
    )
  })

  it('rejects elements with savedAs values', () => {
    // @ts-expect-error
    list(strElement.savedAs('foo'))

    // @ts-expect-error
    expect(() => validateListAttribute(list(strElement.savedAs('foo')))).toThrow(
      // @prettier-ignore - force a line break
      new SavedAsListAttributeElementsError({})
    )
  })

  it('rejects elements with default values', () => {
    // @ts-expect-error
    list(strElement.default('foo'))

    // @ts-expect-error
    expect(() => validateListAttribute(list(strElement.default('foo')))).toThrow(
      // @prettier-ignore - force a line break
      new DefaultedListAttributeElementsError({})
    )

    // @ts-expect-error
    list(strElement.default(ComputedDefault))

    // @ts-expect-error
    expect(() => validateListAttribute(list(strElement.default(ComputedDefault)))).toThrow(
      // @prettier-ignore - force a line break
      new DefaultedListAttributeElementsError({})
    )
  })

  it('returns default list', () => {
    const lst = list(strElement)

    const assertList: A.Contains<
      typeof lst,
      {
        _type: 'list'
        _elements: typeof strElement
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
      _elements: strElement,
      _required: 'never',
      _key: false,
      _savedAs: undefined,
      _hidden: false
    })
  })

  it('returns required list (option)', () => {
    const lstAtLeastOnce = list(strElement, { required: 'atLeastOnce' })
    const lstOnlyOnce = list(strElement, { required: 'onlyOnce' })
    const lstAlways = list(strElement, { required: 'always' })
    const lstNever = list(strElement, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { _required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(lstOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(lstAlways).toMatchObject({ _required: 'always' })
    expect(lstNever).toMatchObject({ _required: 'never' })
  })

  it('returns required list (method)', () => {
    const lstAtLeastOnce = list(strElement).required()
    const lstOnlyOnce = list(strElement).required('onlyOnce')
    const lstAlways = list(strElement).required('always')
    const lstNever = list(strElement).required('never')

    const assertAtLeastOnce: A.Contains<typeof lstAtLeastOnce, { _required: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof lstOnlyOnce, { _required: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof lstAlways, { _required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof lstNever, { _required: Never }> = 1
    assertNever

    expect(lstAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
    expect(lstOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
    expect(lstAlways).toMatchObject({ _required: 'always' })
    expect(lstNever).toMatchObject({ _required: 'never' })
  })

  it('returns hidden list (option)', () => {
    const lst = list(strElement, { hidden: true })

    const assertList: A.Contains<typeof lst, { _hidden: true }> = 1
    assertList

    expect(lst).toMatchObject({ _hidden: true })
  })

  it('returns hidden list (method)', () => {
    const lst = list(strElement).hidden()

    const assertList: A.Contains<typeof lst, { _hidden: true }> = 1
    assertList

    expect(lst).toMatchObject({ _hidden: true })
  })

  it('returns key list (option)', () => {
    const lst = list(strElement, { key: true })

    const assertList: A.Contains<typeof lst, { _key: true }> = 1
    assertList

    expect(lst).toMatchObject({ _key: true })
  })

  it('returns key list (method)', () => {
    const lst = list(strElement).key()

    const assertList: A.Contains<typeof lst, { _key: true }> = 1
    assertList

    expect(lst).toMatchObject({ _key: true })
  })

  it('returns savedAs list (option)', () => {
    const lst = list(strElement, { savedAs: 'foo' })

    const assertList: A.Contains<typeof lst, { _savedAs: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ _savedAs: 'foo' })
  })

  it('returns savedAs list (method)', () => {
    const lst = list(strElement).savedAs('foo')

    const assertList: A.Contains<typeof lst, { _savedAs: 'foo' }> = 1
    assertList

    expect(lst).toMatchObject({ _savedAs: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(strElement, { default: ComputedDefault })

    const assertList: A.Contains<typeof lst, { _default: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const lst = list(strElement).default(ComputedDefault)

    const assertList: A.Contains<typeof lst, { _default: ComputedDefault }> = 1
    assertList

    expect(lst).toMatchObject({ _default: ComputedDefault })
  })

  it('list of lists', () => {
    const lst = list(list(strElement).required())

    const assertList: A.Contains<
      typeof lst,
      {
        _type: 'list'
        _elements: {
          _type: 'list'
          _elements: typeof strElement
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
        _elements: strElement,
        _required: 'atLeastOnce',
        _hidden: false,
        _key: false,
        _savedAs: undefined,
        _default: undefined
      },
      _required: 'never',
      _hidden: false,
      _key: false,
      _savedAs: undefined,
      _default: undefined
    })
  })
})
