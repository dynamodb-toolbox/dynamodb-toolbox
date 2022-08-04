import { A } from 'ts-toolbelt'

import { item } from './item'
import { string, number, boolean, binary } from './leaf'
import { map, Mapped } from './map'
import { list, List } from './list'
import { ComputedDefault } from './utility'

describe('item', () => {
  it('leafs', () => {
    const itm = item({
      reqStr: string().required(),
      hidBool: boolean().hidden(),
      defNum: number().default(42),
      bin: binary()
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _properties: {
          reqStr: {
            _type: 'string'
            _resolved?: string
            _required: true
            _hidden: false
            _default: undefined
          }
          hidBool: {
            _type: 'boolean'
            _resolved?: boolean
            _required: false
            _hidden: true
            _default: undefined
          }
          defNum: {
            _type: 'number'
            _resolved?: number
            _required: false
            _hidden: false
            _default: 42
          }
          bin: {
            _type: 'binary'
            _resolved?: unknown
            _required: false
            _hidden: false
            _default: undefined
          }
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
          _default: undefined
        },
        hidBool: {
          _type: 'boolean',
          _required: false,
          _hidden: true,
          _default: undefined
        },
        defNum: {
          _type: 'number',
          _required: false,
          _hidden: false,
          _default: 42
        },
        bin: {
          _type: 'binary',
          _required: false,
          _hidden: false,
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
          map: Mapped<{ str: typeof str }, false, false>
          nestedMap: Mapped<
            {
              nested: Mapped<{ str: typeof str }, false, false>
            },
            false,
            false
          >
          reqMap: Mapped<{ str: typeof str }, true, false>
          hiddenMap: Mapped<{ str: typeof str }, false, true>
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
          _hidden: false
        },
        nestedMap: {
          _type: 'map',
          _properties: {
            nested: {
              _type: 'map',
              _properties: { str },
              _required: false,
              _hidden: false
            }
          },
          _required: false,
          _hidden: false
        },
        reqMap: {
          _type: 'map',
          _properties: { str },
          _required: true,
          _hidden: false
        },
        hiddenMap: {
          _type: 'map',
          _properties: { str },
          _required: false,
          _hidden: true
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
          list: List<typeof str, false, false>
          nestedList: List<List<typeof str, true, false>, false, false>
          reqList: List<typeof str, true, false>
          hiddenList: List<typeof str, false, true>
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
          _hidden: false
        },
        nestedList: {
          _type: 'list',
          _elements: {
            _type: 'list',
            _elements: str,
            _required: true,
            _hidden: false
          },
          _required: false,
          _hidden: false
        },
        reqList: {
          _type: 'list',
          _elements: str,
          _required: true,
          _hidden: false
        },
        hiddenList: {
          _type: 'list',
          _elements: str,
          _required: false,
          _hidden: true
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
})
