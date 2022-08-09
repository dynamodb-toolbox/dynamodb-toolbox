import { A } from 'ts-toolbelt'

import { item } from './item'
import { string, number, boolean, binary, Leaf } from './leaf'
import { map, Mapped } from './map'
import { list, List } from './list'
import { ComputedDefault } from './utility'

describe('item', () => {
  it('leafs', () => {
    const itm = item({
      reqStr: string().required(),
      hidBool: boolean().hidden(),
      defNum: number().default(42),
      savedAsBin: binary().savedAs('_b'),
      keyStr: string().key(),
      enumStr: string().enum('foo', 'bar')
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _properties: {
          reqStr: Leaf<'string', true, false, false, undefined, undefined, undefined>
          hidBool: Leaf<'boolean', false, true, false, undefined, undefined, undefined>
          defNum: Leaf<'number', false, false, false, undefined, undefined, 42>
          savedAsBin: Leaf<'binary', false, false, false, '_b', undefined, undefined>
          keyStr: Leaf<'string', false, false, true, undefined, undefined, undefined>
          enumStr: Leaf<'string', false, false, false, undefined, ['foo', 'bar'], undefined>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _properties: {
        reqStr: {
          _type: 'string',
          _required: true,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _enum: undefined,
          _default: undefined
        },
        hidBool: {
          _type: 'boolean',
          _required: false,
          _hidden: true,
          _key: false,
          _savedAs: undefined,
          _enum: undefined,
          _default: undefined
        },
        defNum: {
          _type: 'number',
          _required: false,
          _hidden: false,
          _key: false,
          _savedAs: undefined,
          _enum: undefined,
          _default: 42
        },
        savedAsBin: {
          _type: 'binary',
          _required: false,
          _hidden: false,
          _key: false,
          _savedAs: '_b',
          _enum: undefined,
          _default: undefined
        },
        keyStr: {
          _type: 'string',
          _required: false,
          _hidden: false,
          _key: true,
          _savedAs: undefined,
          _enum: undefined,
          _default: undefined
        },
        enumStr: {
          _type: 'string',
          _required: false,
          _hidden: false,
          _key: false,
          _savedAs: undefined,
          _enum: ['foo', 'bar'],
          _default: undefined
        }
      }
    })
  })

  it('maps', () => {
    const str = string().required()

    const itm = item({
      map: map({ str }),
      nestedMap: map({
        nested: map({
          str
        })
      }),
      reqMap: map({ str }).required(),
      hiddenMap: map({ str }).hidden()
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _properties: {
          map: Mapped<{ str: typeof str }, false, false, false, undefined, undefined>
          nestedMap: Mapped<
            {
              nested: Mapped<{ str: typeof str }, false, false, false, undefined, undefined>
            },
            false,
            false,
            false,
            undefined,
            undefined
          >
          reqMap: Mapped<{ str: typeof str }, true, false, false, undefined, undefined>
          hiddenMap: Mapped<{ str: typeof str }, false, true, false, undefined, undefined>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _properties: {
        map: {
          _type: 'map',
          _properties: { str },
          _required: false,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        nestedMap: {
          _type: 'map',
          _properties: {
            nested: {
              _type: 'map',
              _properties: { str },
              _required: false,
              _hidden: false,
              _savedAs: undefined,
              _key: false,
              _default: undefined
            }
          },
          _required: false,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        reqMap: {
          _type: 'map',
          _properties: { str },
          _required: true,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        hiddenMap: {
          _type: 'map',
          _properties: { str },
          _required: false,
          _hidden: true,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        }
      }
    })
  })

  it('list', () => {
    const str = string().required()

    const itm = item({
      list: list(str),
      nestedList: list(list(str).required()),
      reqList: list(str).required(),
      hiddenList: list(str).hidden()
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _properties: {
          list: List<typeof str, false, false, false, undefined, undefined>
          nestedList: List<List<typeof str, true, false, false, undefined, undefined>, false, false>
          reqList: List<typeof str, true, false, false, undefined, undefined>
          hiddenList: List<typeof str, false, true, false, undefined, undefined>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _properties: {
        list: {
          _type: 'list',
          _elements: str,
          _required: false,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        nestedList: {
          _type: 'list',
          _elements: {
            _type: 'list',
            _elements: str,
            _required: true,
            _hidden: false,
            _savedAs: undefined,
            _key: false,
            _default: undefined
          },
          _required: false,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        reqList: {
          _type: 'list',
          _elements: str,
          _required: true,
          _hidden: false,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        },
        hiddenList: {
          _type: 'list',
          _elements: str,
          _required: false,
          _hidden: true,
          _savedAs: undefined,
          _key: false,
          _default: undefined
        }
      }
    })
  })

  it('computedDefaults', () => {
    const allTypesOfProps = {
      optProp: string(),
      optPropWithInitDef: string().default('foo'),
      optPropWithCompDef: string().default(ComputedDefault),
      reqProp: string().required(),
      reqPropWithInitDef: string().required().default('baz'),
      reqPropWithCompDef: string().required().default(ComputedDefault)
    }

    type ExpectedPreCompProps = {
      optProp?: string | undefined
      optPropWithInitDef: string
      optPropWithCompDef?: string | undefined
      reqProp: string
      reqPropWithInitDef: string
      reqPropWithCompDef?: string
    }

    type ExpectedPostCompProps = {
      optProps?: string | undefined
      optPropWithInitDef: string
      optPropWithCompDef: string
      reqProp: string
      reqPropWithInitDef: string
      reqPropWithCompDef: string
    }

    const itm = item({
      ...allTypesOfProps,
      map: map(allTypesOfProps).required(),
      list: list(map(allTypesOfProps).required()).required()
    })

    itm.computeDefaults(preCompProps => {
      const assertLeafProps: A.Equals<
        Omit<typeof preCompProps, 'list' | 'map'>,
        ExpectedPreCompProps
      > = 1
      assertLeafProps

      const assertMapProps: A.Equals<typeof preCompProps.map, ExpectedPreCompProps> = 1
      assertMapProps

      const assertListProps: A.Equals<typeof preCompProps.list[number], ExpectedPreCompProps> = 1
      assertListProps

      const fillGaps = (preComp: ExpectedPreCompProps): ExpectedPostCompProps => ({
        ...preComp,
        optPropWithCompDef: preComp.optPropWithCompDef ?? 'baz',
        reqPropWithCompDef: preComp.reqPropWithCompDef ?? 'foo'
      })

      const postCompProps: ExpectedPostCompProps & {
        map: ExpectedPostCompProps
        list: ExpectedPostCompProps[]
      } = {
        ...fillGaps(preCompProps),
        map: fillGaps(preCompProps.map),
        list: preCompProps.list.map(fillGaps)
      }

      return postCompProps
    })
  })

  it('applies validation by default', () => {
    expect(() =>
      item({
        // @ts-ignore
        invalidStr: string().enum('foo', 'bar').default('baz')
      })
    ).toThrow()
  })

  it('does not apply validation if told to', () => {
    expect(() =>
      item(
        {
          // @ts-ignore
          invalidStr: string().enum('foo', 'bar').default('baz')
        },
        { _validate: false }
      )
    ).not.toThrow()
  })
})
