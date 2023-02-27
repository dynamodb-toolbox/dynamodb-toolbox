import type { A } from 'ts-toolbelt'

import { item } from './typer'
import { boolean, binary, number, string, set, list, map } from './attributes'
import { freezeAttribute, FreezeAttribute } from './attributes/freeze'

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
        type: 'item'
        attributes: {
          reqStr: FreezeAttribute<typeof reqStr>
          hidBool: FreezeAttribute<typeof hidBool>
          defNum: FreezeAttribute<typeof defNum>
          savedAsBin: FreezeAttribute<typeof savedAsBin>
          keyStr: FreezeAttribute<typeof keyStr>
          enumStr: FreezeAttribute<typeof enumStr>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      attributes: {
        reqStr: freezeAttribute(reqStr, 'reqStr'),
        hidBool: freezeAttribute(hidBool, 'hidBool'),
        defNum: freezeAttribute(defNum, 'defNum'),
        savedAsBin: freezeAttribute(savedAsBin, 'savedAsBin'),
        keyStr: freezeAttribute(keyStr, 'keyStr'),
        enumStr: freezeAttribute(enumStr, 'enumStr')
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
        attributes: {
          flatMap: FreezeAttribute<typeof flatMap>
          nestedMap: FreezeAttribute<typeof nestedMap>
          reqMap: FreezeAttribute<typeof reqMap>
          hiddenMap: FreezeAttribute<typeof hiddenMap>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      attributes: {
        flatMap: freezeAttribute(flatMap, 'flatMap'),
        nestedMap: freezeAttribute(nestedMap, 'nestedMap'),
        reqMap: freezeAttribute(reqMap, 'reqMap'),
        hiddenMap: freezeAttribute(hiddenMap, 'hiddenMap')
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
        attributes: {
          optList: FreezeAttribute<typeof optList>
          nestedList: FreezeAttribute<typeof nestedList>
          reqList: FreezeAttribute<typeof reqList>
          hiddenList: FreezeAttribute<typeof hiddenList>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      attributes: {
        optList: freezeAttribute(optList, 'optList'),
        nestedList: freezeAttribute(nestedList, 'nestedList'),
        reqList: freezeAttribute(reqList, 'reqList'),
        hiddenList: freezeAttribute(hiddenList, 'hiddenList')
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
        attributes: {
          optSet: FreezeAttribute<typeof optSet>
          reqSet: FreezeAttribute<typeof reqSet>
          hiddenSet: FreezeAttribute<typeof hiddenSet>
        }
      }
    > = 1
    assertItm

    expect(itm).toMatchObject({
      attributes: {
        optSet: freezeAttribute(optSet, 'optSet'),
        reqSet: freezeAttribute(reqSet, 'reqSet'),
        hiddenSet: freezeAttribute(hiddenSet, 'hiddenSet')
      }
    })
  })
})
