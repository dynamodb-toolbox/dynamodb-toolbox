import type { A } from 'ts-toolbelt'

import { schema } from './schema.js'
import { boolean, binary, number, string, set, list, map } from './attributes/index.js'
import type { FreezeAttribute } from './attributes/freeze.js'

describe('schema', () => {
  it('primitives', () => {
    const reqStr = string()
    const hidBool = boolean().hidden()
    const defNum = number().putDefault(42)
    const savedAsBin = binary().savedAs('_b')
    const keyStr = string().key()
    const enumStr = string().enum('foo', 'bar')

    const sch = schema({
      reqStr,
      hidBool,
      defNum,
      savedAsBin,
      keyStr,
      enumStr
    })

    const assertSch: A.Contains<
      typeof sch,
      {
        type: 'schema'
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
    assertSch

    expect(sch.attributes).toMatchObject({
      reqStr: reqStr.freeze('reqStr'),
      hidBool: hidBool.freeze('hidBool'),
      defNum: defNum.freeze('defNum'),
      savedAsBin: savedAsBin.freeze('savedAsBin'),
      keyStr: keyStr.freeze('keyStr'),
      enumStr: enumStr.freeze('enumStr')
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

    const sch = schema({ flatMap, nestedMap, reqMap, hiddenMap })

    const assertSch: A.Contains<
      typeof sch,
      {
        attributes: {
          flatMap: FreezeAttribute<typeof flatMap>
          nestedMap: FreezeAttribute<typeof nestedMap>
          reqMap: FreezeAttribute<typeof reqMap>
          hiddenMap: FreezeAttribute<typeof hiddenMap>
        }
      }
    > = 1
    assertSch

    expect(sch).toMatchObject({
      attributes: {
        flatMap: flatMap.freeze('flatMap'),
        nestedMap: nestedMap.freeze('nestedMap'),
        reqMap: reqMap.freeze('reqMap'),
        hiddenMap: hiddenMap.freeze('hiddenMap')
      }
    })
  })

  it('list', () => {
    const str = string()
    const optList = list(str).optional()
    const nestedList = list(list(str))
    const reqList = list(str)
    const hiddenList = list(str).optional().hidden()

    const sch = schema({
      optList,
      nestedList,
      reqList,
      hiddenList
    })

    const assertSch: A.Contains<
      typeof sch,
      {
        attributes: {
          optList: FreezeAttribute<typeof optList>
          nestedList: FreezeAttribute<typeof nestedList>
          reqList: FreezeAttribute<typeof reqList>
          hiddenList: FreezeAttribute<typeof hiddenList>
        }
      }
    > = 1
    assertSch

    expect(sch).toMatchObject({
      attributes: {
        optList: optList.freeze('optList'),
        nestedList: nestedList.freeze('nestedList'),
        reqList: reqList.freeze('reqList'),
        hiddenList: hiddenList.freeze('hiddenList')
      }
    })
  })

  it('sets', () => {
    const str = string()
    const optSet = set(str).optional()
    const reqSet = set(str)
    const hiddenSet = set(str).optional().hidden()

    const sch = schema({
      optSet,
      reqSet,
      hiddenSet
    })

    const assertSch: A.Contains<
      typeof sch,
      {
        attributes: {
          optSet: FreezeAttribute<typeof optSet>
          reqSet: FreezeAttribute<typeof reqSet>
          hiddenSet: FreezeAttribute<typeof hiddenSet>
        }
      }
    > = 1
    assertSch

    expect(sch).toMatchObject({
      attributes: {
        optSet: optSet.freeze('optSet'),
        reqSet: reqSet.freeze('reqSet'),
        hiddenSet: hiddenSet.freeze('hiddenSet')
      }
    })
  })
})
