import type { A } from 'ts-toolbelt'

import { item } from './typer'
import { boolean, binary, number, string, set, list, map } from './attributes'
import { $type, $attributes, $open } from './attributes/constants/attributeOptions'

describe('item', () => {
  it('primitives', () => {
    const reqStr = string()
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
        [$type]: 'item'
        [$attributes]: {
          reqStr: typeof reqStr
          hidBool: typeof hidBool
          defNum: typeof defNum
          savedAsBin: typeof savedAsBin
          keyStr: typeof keyStr
          enumStr: typeof enumStr
        }
        [$open]: boolean
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      [$attributes]: {
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
    const str = string()
    const flatMap = map({ str })
    const nestedMap = map({
      nested: map({ str })
    })
    const reqMap = map({ str })
    const hiddenMap = map({ str }).hidden()

    const itm = item({ flatMap, nestedMap, reqMap, hiddenMap })

    const assertItm: A.Contains<
      typeof itm,
      {
        [$attributes]: {
          flatMap: typeof flatMap
          nestedMap: typeof nestedMap
          reqMap: typeof reqMap
          hiddenMap: typeof hiddenMap
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      [$attributes]: {
        flatMap,
        nestedMap,
        reqMap,
        hiddenMap
      }
    })
  })

  it('list', () => {
    const str = string()
    const optList = list(str).optional()
    const nestedList = list(list(str))
    const reqList = list(str)
    const hiddenList = list(str).optional().hidden()

    const itm = item({
      optList,
      nestedList,
      reqList,
      hiddenList
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        [$attributes]: {
          optList: typeof optList
          nestedList: typeof nestedList
          reqList: typeof reqList
          hiddenList: typeof hiddenList
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      [$attributes]: {
        optList,
        nestedList,
        reqList,
        hiddenList
      }
    })
  })

  it('sets', () => {
    const str = string()
    const optSet = set(str).optional()
    const reqSet = set(str)
    const hiddenSet = set(str).optional().hidden()

    const itm = item({
      optSet,
      reqSet,
      hiddenSet
    })

    const assertItm: A.Contains<
      typeof itm,
      {
        [$attributes]: {
          optSet: typeof optSet
          reqSet: typeof reqSet
          hiddenSet: typeof hiddenSet
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      [$attributes]: {
        optSet,
        reqSet,
        hiddenSet
      }
    })
  })
})
