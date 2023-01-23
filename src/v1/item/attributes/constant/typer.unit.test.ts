import type { A } from 'ts-toolbelt'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { $type, $value, $required, $hidden, $key, $savedAs, $default } from '../constants/symbols'

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
          [$type]: 'constant'
          [$value]: 'foobar'
          [$required]: AtLeastOnce
          [$hidden]: false
          [$key]: false
          [$savedAs]: undefined
          [$default]: undefined
        }
      > = 1
      assertFoobar

      expect(foobar).toMatchObject({
        [$type]: 'constant',
        [$value]: 'foobar',
        [$required]: 'atLeastOnce',
        [$hidden]: false,
        [$key]: false,
        [$savedAs]: undefined,
        [$default]: undefined
      })
    })

    it('returns required constant (option)', () => {
      const foobarAtLeastOnce = constant('foobar', { required: 'atLeastOnce' })
      const foobarOnlyOnce = constant('foobar', { required: 'onlyOnce' })
      const foobarAlways = constant('foobar', { required: 'always' })
      const foobarNever = constant('foobar', { required: 'never' })

      const assertAtLeastOnce: A.Contains<
        typeof foobarAtLeastOnce,
        { [$required]: AtLeastOnce }
      > = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof foobarOnlyOnce, { [$required]: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof foobarAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof foobarNever, { [$required]: Never }> = 1
      assertNever

      expect(foobarAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(foobarOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
      expect(foobarAlways).toMatchObject({ [$required]: 'always' })
      expect(foobarNever).toMatchObject({ [$required]: 'never' })
    })

    it('returns required constant (method)', () => {
      const foobarAtLeastOnce = constant('foobar').required()
      const foobarOnlyOnce = constant('foobar').required('onlyOnce')
      const foobarAlways = constant('foobar').required('always')
      const foobarNever = constant('foobar').required('never')
      const foobarOpt = constant('foobar').optional()

      const assertAtLeastOnce: A.Contains<
        typeof foobarAtLeastOnce,
        { [$required]: AtLeastOnce }
      > = 1
      assertAtLeastOnce
      const assertOnlyOnce: A.Contains<typeof foobarOnlyOnce, { [$required]: OnlyOnce }> = 1
      assertOnlyOnce
      const assertAlways: A.Contains<typeof foobarAlways, { [$required]: Always }> = 1
      assertAlways
      const assertNever: A.Contains<typeof foobarNever, { [$required]: Never }> = 1
      assertNever
      const assertOpt: A.Contains<typeof foobarOpt, { [$required]: Never }> = 1
      assertOpt

      expect(foobarAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
      expect(foobarOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
      expect(foobarAlways).toMatchObject({ [$required]: 'always' })
      expect(foobarNever).toMatchObject({ [$required]: 'never' })
      expect(foobarOpt).toMatchObject({ [$required]: 'never' })
    })

    it('returns hidden constant (option)', () => {
      const foobar = constant('foobar', { hidden: true })

      const assertFoobar: A.Contains<typeof foobar, { [$hidden]: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$hidden]: true })
    })

    it('returns hidden constant (method)', () => {
      const foobar = constant('foobar').hidden()

      const assertFoobar: A.Contains<typeof foobar, { [$hidden]: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$hidden]: true })
    })

    it('returns key constant (option)', () => {
      const foobar = constant('foobar', { key: true })

      const assertFoobar: A.Contains<typeof foobar, { [$key]: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$key]: true })
    })

    it('returns key constant (method)', () => {
      const foobar = constant('foobar').key()

      const assertFoobar: A.Contains<typeof foobar, { [$key]: true }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$key]: true })
    })

    it('returns savedAs constant (option)', () => {
      const foobar = constant('foobar', { savedAs: 'foo' })

      const assertFoobar: A.Contains<typeof foobar, { [$savedAs]: 'foo' }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$savedAs]: 'foo' })
    })

    it('returns savedAs constant (method)', () => {
      const foobar = constant('foobar').savedAs('foo')

      const assertFoobar: A.Contains<typeof foobar, { [$savedAs]: 'foo' }> = 1
      assertFoobar

      expect(foobar).toMatchObject({ [$savedAs]: 'foo' })
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

      const assertFoobarA: A.Contains<typeof foobarA, { [$default]: 'foobar' }> = 1
      assertFoobarA

      expect(foobarA).toMatchObject({ [$default]: 'foobar' })

      const assertFoobarB: A.Contains<typeof foobarB, { [$default]: () => string }> = 1
      assertFoobarB

      expect(foobarB).toMatchObject({ [$default]: sayFoobar })
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

      const assertFoobarA: A.Contains<typeof foobarA, { [$default]: 'foobar' }> = 1
      assertFoobarA

      expect(foobarA).toMatchObject({ [$default]: 'foobar' })

      const assertFoobarB: A.Contains<typeof foobarB, { [$default]: () => string }> = 1
      assertFoobarB

      expect(foobarB).toMatchObject({ [$default]: sayFoobar })
    })
  })
})

describe('number', () => {
  it('returns constant number', () => {
    const num = constant(42)

    const assertNum: A.Contains<typeof num, { [$type]: 'constant'; [$value]: 42 }> = 1
    assertNum

    expect(num).toMatchObject({ [$type]: 'constant', [$value]: 42 })
  })
})

describe('boolean', () => {
  it('returns constant boolean', () => {
    const bool = constant(true)

    const assertBool: A.Contains<typeof bool, { [$type]: 'constant'; [$value]: true }> = 1
    assertBool

    expect(bool).toMatchObject({ [$type]: 'constant', [$value]: true })
  })
})

describe('binary', () => {
  it('returns constant binary', () => {
    const bin = constant(Buffer.from([0, 1]))

    const assertBin: A.Contains<typeof bin, { [$type]: 'constant'; [$value]: Buffer }> = 1
    assertBin

    expect(bin).toMatchObject({ [$type]: 'constant', [$value]: expect.any(Buffer) })
  })
})

describe('set', () => {
  it('returns constant set', () => {
    const set = constant(new Set(['foo', 'bar']))

    /**
     * @debt type "Sets are not narrowed"
     */
    const assertSet: A.Contains<typeof set, { [$type]: 'constant'; [$value]: Set<string> }> = 1
    assertSet

    expect(set).toMatchObject({ [$type]: 'constant', [$value]: new Set(['foo', 'bar']) })
  })
})

describe('list', () => {
  it('returns constant list', () => {
    const list = constant(['foo', { bar: 'baz' }, 42])

    const assertList: A.Contains<
      typeof list,
      { [$type]: 'constant'; [$value]: ['foo', { bar: 'baz' }, 42] }
    > = 1
    assertList

    expect(list).toMatchObject({ [$type]: 'constant', [$value]: ['foo', { bar: 'baz' }, 42] })
  })
})

describe('map', () => {
  it('returns constant map', () => {
    const map = constant({ foo: { bar: ['baz', 42] } })

    const assertMap: A.Contains<
      typeof map,
      { [$type]: 'constant'; [$value]: { foo: { bar: ['baz', 42] } } }
    > = 1
    assertMap

    expect(map).toMatchObject({ [$type]: 'constant', [$value]: { foo: { bar: ['baz', 42] } } })
  })
})

describe('ComputedDefault', () => {
  it('accepts ComputedDefault as default value (option)', () => {
    const foobar = constant('foobar', { default: ComputedDefault })

    const assertFoobar: A.Contains<typeof foobar, { [$default]: ComputedDefault }> = 1
    assertFoobar

    expect(foobar).toMatchObject({ [$default]: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const foobar = constant('foobar').default(ComputedDefault)

    const assertFoobar: A.Contains<typeof foobar, { [$default]: ComputedDefault }> = 1
    assertFoobar

    expect(foobar).toMatchObject({ [$default]: ComputedDefault })
  })
})
