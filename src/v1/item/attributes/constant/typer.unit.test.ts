import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'

import { constant } from './typer'
import { freezeConstantAttribute, InvalidDefaultValueError } from './freeze'

const path = 'some.path'

describe('constantAttribute', () => {
  describe('string constant', () => {
    it('returns constant "foobar" string', () => {
      const foobar = constant('foobar')

      const assertFoobar: A.Contains<
        typeof foobar,
        {
          _type: 'constant'
          _value: 'foobar'
          _required: AtLeastOnce
          _hidden: false
          _key: false
          _savedAs: undefined
          _default: undefined
        }
      > = 1
      assertFoobar

      expect(foobar).toMatchObject({
        _type: 'constant',
        _value: 'foobar',
        _required: 'atLeastOnce',
        _hidden: false,
        _key: false,
        _savedAs: undefined,
        _default: undefined
      })
    })

    it('returns required constant (option)', () => {
      const foobarAtLeastOnce = constant('foobar', { required: 'atLeastOnce' })
      const foobarOnlyOnce = constant('foobar', { required: 'onlyOnce' })
      const foobarAlways = constant('foobar', { required: 'always' })
      const foobarNever = constant('foobar', { required: 'never' })

      const assertAtLeastOnce: A.Contains<typeof foobarAtLeastOnce, { _required: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof foobarOnlyOnce, { _required: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof foobarAlways, { _required: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof foobarNever, { _required: Never }> = 1
      assertNever

      expect(foobarAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
      expect(foobarOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
      expect(foobarAlways).toMatchObject({ _required: 'always' })
      expect(foobarNever).toMatchObject({ _required: 'never' })
    })

    it('returns required constant (method)', () => {
      const foobarAtLeastOnce = constant('foobar').required()
      const foobarOnlyOnce = constant('foobar').required('onlyOnce')
      const foobarAlways = constant('foobar').required('always')
      const foobarNever = constant('foobar').required('never')
      const foobarOpt = constant('foobar').optional()

      const assertAtLeastOnce: A.Contains<typeof foobarAtLeastOnce, { _required: AtLeastOnce }> = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof foobarOnlyOnce, { _required: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof foobarAlways, { _required: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof foobarNever, { _required: Never }> = 1
      assertNever
      const assertOpt: A.Contains<typeof foobarOpt, { _required: Never }> = 1
      assertOpt

      expect(foobarAtLeastOnce).toMatchObject({ _required: 'atLeastOnce' })
      expect(foobarOnlyOnce).toMatchObject({ _required: 'onlyOnce' })
      expect(foobarAlways).toMatchObject({ _required: 'always' })
      expect(foobarNever).toMatchObject({ _required: 'never' })
      expect(foobarOpt).toMatchObject({ _required: 'never' })
    })

    it('returns hidden constant (option)', () => {
      const foobar = constant('foobar', { hidden: true })

      const assertFoobar: A.Contains<typeof foobar, { _hidden: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _hidden: true })
    })

    it('returns hidden constant (method)', () => {
      const foobar = constant('foobar').hidden()

      const assertFoobar: A.Contains<typeof foobar, { _hidden: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _hidden: true })
    })

    it('returns key constant (option)', () => {
      const foobar = constant('foobar', { key: true })

      const assertFoobar: A.Contains<typeof foobar, { _key: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _key: true })
    })

    it('returns key constant (method)', () => {
      const foobar = constant('foobar').key()

      const assertFoobar: A.Contains<typeof foobar, { _key: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _key: true })
    })

    it('returns savedAs constant (option)', () => {
      const foobar = constant('foobar', { savedAs: 'foo' })

      const assertFoobar: A.Contains<typeof foobar, { _savedAs: 'foo' }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _savedAs: 'foo' })
    })

    it('returns savedAs constant (method)', () => {
      const foobar = constant('foobar').savedAs('foo')

      const assertFoobar: A.Contains<typeof foobar, { _savedAs: 'foo' }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ _savedAs: 'foo' })
    })

    it('returns constant with default value (option)', () => {
      constant('foobar', {
        // @ts-expect-error
        default: 42
      })

      expect(() =>
        freezeConstantAttribute(
          constant('foobar', {
            // @ts-expect-error
            default: 42
          }),
          path
        )
      ).toThrow(new InvalidDefaultValueError({ constValue: 'foobar', defaultValue: 42, path }))

      constant('foobar', {
        // @ts-expect-error Unable to throw here (it would require executing the fn)
        default: () => 42
      })

      const foobarA = constant('foobar', { default: 'foobar' })
      const sayFoobar = () => 'foobar' as const
      const foobarB = constant('foobar', { default: sayFoobar })

      const assertFoobarA: A.Contains<typeof foobarA, { _default: 'foobar' }> = 1
      assertFoobarA

      expect(foobarA).toMatchObject({ _default: 'foobar' })

      const assertFoobarB: A.Contains<typeof foobarB, { _default: () => string }> = 1
      assertFoobarB

      expect(foobarB).toMatchObject({ _default: sayFoobar })
    })

    it('returns constant with default value (method)', () => {
      constant('foobar').default(
        // @ts-expect-error
        42
      )

      expect(() =>
        freezeConstantAttribute(
          constant('foobar').default(
            // @ts-expect-error
            42
          ),
          path
        )
      ).toThrow(new InvalidDefaultValueError({ constValue: 'foobar', defaultValue: 42, path }))

      constant('foobar').default(
        // @ts-expect-error Unable to throw here (it would require executing the fn)
        () => 42
      )

      const foobarA = constant('foobar').default('foobar')
      const sayFoobar = () => 'foobar' as const
      const foobarB = constant('foobar').default(sayFoobar)

      const assertFoobarA: A.Contains<typeof foobarA, { _default: 'foobar' }> = 1
      assertFoobarA

      expect(foobarA).toMatchObject({ _default: 'foobar' })

      const assertFoobarB: A.Contains<typeof foobarB, { _default: () => string }> = 1
      assertFoobarB

      expect(foobarB).toMatchObject({ _default: sayFoobar })
    })
  })
})

describe('number', () => {
  it('returns constant number', () => {
    const num = constant(42)

    const assertNum: A.Contains<typeof num, { _type: 'constant'; _value: 42 }> = 1
    assertNum

    expect(num).toMatchObject({ _type: 'constant', _value: 42 })
  })
})

describe('boolean', () => {
  it('returns constant boolean', () => {
    const bool = constant(true)

    const assertBool: A.Contains<typeof bool, { _type: 'constant'; _value: true }> = 1
    assertBool

    expect(bool).toMatchObject({ _type: 'constant', _value: true })
  })
})

describe('binary', () => {
  it('returns constant binary', () => {
    const bin = constant(Buffer.from([0, 1]))

    const assertBin: A.Contains<typeof bin, { _type: 'constant'; _value: Buffer }> = 1
    assertBin

    expect(bin).toMatchObject({ _type: 'constant', _value: expect.any(Buffer) })
  })
})

describe('set', () => {
  it('returns constant set', () => {
    const set = constant(new Set(['foo', 'bar']))

    /**
     * @debt type "Sets are not narrowed"
     */
    const assertSet: A.Contains<typeof set, { _type: 'constant'; _value: Set<string> }> = 1
    assertSet

    expect(set).toMatchObject({ _type: 'constant', _value: new Set(['foo', 'bar']) })
  })
})

describe('list', () => {
  it('returns constant list', () => {
    const list = constant(['foo', { bar: 'baz' }, 42])

    const assertList: A.Contains<
      typeof list,
      { _type: 'constant'; _value: ['foo', { bar: 'baz' }, 42] }
    > = 1
    assertList

    expect(list).toMatchObject({ _type: 'constant', _value: ['foo', { bar: 'baz' }, 42] })
  })
})

describe('map', () => {
  it('returns constant map', () => {
    const map = constant({ foo: { bar: ['baz', 42] } })

    const assertMap: A.Contains<
      typeof map,
      { _type: 'constant'; _value: { foo: { bar: ['baz', 42] } } }
    > = 1
    assertMap

    expect(map).toMatchObject({ _type: 'constant', _value: { foo: { bar: ['baz', 42] } } })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const foobar = constant('foobar', { default: ComputedDefault })

    const assertFoobar: A.Contains<typeof foobar, { _default: ComputedDefault }> = 1
    assertFoobar

    expect(foobar).toMatchObject({ _default: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const foobar = constant('foobar').default(ComputedDefault)

    const assertFoobar: A.Contains<typeof foobar, { _default: ComputedDefault }> = 1
    assertFoobar

    expect(foobar).toMatchObject({ _default: ComputedDefault })
  })
})
