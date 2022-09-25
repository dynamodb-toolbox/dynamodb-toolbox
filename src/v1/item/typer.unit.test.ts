import type { A } from 'ts-toolbelt'

import { item } from './typer'
import { string, number, boolean, binary, map, list } from './typers'

describe('item', () => {
  it('leafs', () => {
    const reqStr = string().required()
    const hidBool = boolean().hidden()
    const defNum = number().default(42)
    const savedAsBin = binary().savedAs('_b')
    const keyStr = string().key()
    const enumStr = string().enum('foo', 'bar')

    const itm = item({
      reqStr,
      hidBool,
      defNum,
      savedAsBin,
      keyStr,
      enumStr
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _attributes: {
          reqStr: typeof reqStr
          hidBool: typeof hidBool
          defNum: typeof defNum
          savedAsBin: typeof savedAsBin
          keyStr: typeof keyStr
          enumStr: typeof enumStr
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _attributes: {
        reqStr,
        hidBool,
        defNum,
        savedAsBin,
        keyStr,
        enumStr
      }
    })
  })

  it('maps', () => {
    const str = string().required()
    const flatMap = map({ str })
    const nestedMap = map({
      nested: map({ str })
    })
    const reqMap = map({ str }).required()
    const hiddenMap = map({ str }).hidden()

    const itm = item({ flatMap, nestedMap, reqMap, hiddenMap })

    const assertItm: A.Contains<
      typeof itm,
      {
        _attributes: {
          flatMap: typeof flatMap
          nestedMap: typeof nestedMap
          reqMap: typeof reqMap
          hiddenMap: typeof hiddenMap
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _attributes: {
        flatMap,
        nestedMap,
        reqMap,
        hiddenMap
      }
    })
  })

  it('list', () => {
    const str = string().required()
    const optList = list(str)
    const nestedList = list(list(str).required())
    const reqList = list(str).required()
    const hiddenList = list(str).hidden()

    const itm = item({
      optList,
      nestedList,
      reqList,
      hiddenList
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        _attributes: {
          optList: typeof optList
          nestedList: typeof nestedList
          reqList: typeof reqList
          hiddenList: typeof hiddenList
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      _attributes: {
        optList,
        nestedList,
        reqList,
        hiddenList
      }
    })
  })

  it('applies validation', () => {
    expect(() =>
      item({
        // @ts-ignore
        invalidStr: string().enum('foo', 'bar').default('baz')
      })
    ).toThrow()
  })
})
