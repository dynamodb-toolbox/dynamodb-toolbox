import { A } from 'ts-toolbelt'

import { item } from './item'
import { string, number, boolean, binary } from './leaf'
import { map, Mapped } from './map'
import { list, List } from './list'

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

  it('mapp', () => {
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
})
