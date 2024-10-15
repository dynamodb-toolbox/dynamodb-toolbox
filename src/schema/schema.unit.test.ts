import type { A } from 'ts-toolbelt'

import type { FreezeAttribute } from '~/attributes/freeze.js'
import { binary, boolean, list, map, number, set, string } from '~/attributes/index.js'

import { schema } from './schema.js'

describe('schema', () => {
  const reqStr = string()
  const hidBool = boolean().hidden()
  const defNum = number().putDefault(42)
  const savedAsBin = binary().savedAs('_b')
  const keyStr = string().key()
  const enumStr = string().enum('foo', 'bar')

  test('primitives', () => {
    const sch = schema({
      reqStr,
      hidBool,
      defNum,
      savedAsBin,
      keyStr,
      enumStr
    })

    const assertType: A.Equals<(typeof sch)['type'], 'schema'> = 1
    assertType
    expect(sch.type).toBe('schema')

    const assertAttr: A.Equals<
      (typeof sch)['attributes'],
      {
        reqStr: FreezeAttribute<typeof reqStr, true>
        hidBool: FreezeAttribute<typeof hidBool, true>
        defNum: FreezeAttribute<typeof defNum, true>
        savedAsBin: FreezeAttribute<typeof savedAsBin, true>
        keyStr: FreezeAttribute<typeof keyStr, true>
        enumStr: FreezeAttribute<typeof enumStr, true>
      }
    > = 1
    assertAttr
    expect(sch.attributes).toStrictEqual({
      reqStr: reqStr.freeze('reqStr'),
      hidBool: hidBool.freeze('hidBool'),
      defNum: defNum.freeze('defNum'),
      savedAsBin: savedAsBin.freeze('savedAsBin'),
      keyStr: keyStr.freeze('keyStr'),
      enumStr: enumStr.freeze('enumStr')
    })

    expect(sch.keyAttributeNames).toStrictEqual(new Set(['keyStr']))
    expect(sch.savedAttributeNames).toStrictEqual(
      new Set(['_b', 'reqStr', 'hidBool', 'defNum', 'keyStr', 'enumStr'])
    )
    expect(sch.requiredAttributeNames).toStrictEqual({
      always: new Set(['keyStr']),
      atLeastOnce: new Set(['reqStr', 'hidBool', 'defNum', 'savedAsBin', 'enumStr']),
      never: new Set([])
    })
  })

  test('sets', () => {
    const str = string()
    const optSet = set(str).optional()
    const reqSet = set(str)
    const hiddenSet = set(str).optional().hidden()

    const sch = schema({
      optSet,
      reqSet,
      hiddenSet
    })

    const assertSch: A.Equals<
      (typeof sch)['attributes'],
      {
        optSet: FreezeAttribute<typeof optSet, true>
        reqSet: FreezeAttribute<typeof reqSet, true>
        hiddenSet: FreezeAttribute<typeof hiddenSet, true>
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

  test('list', () => {
    const str = string()
    const optList = list(str).optional()
    const deepList = list(list(str))
    const reqList = list(str)
    const hiddenList = list(str).optional().hidden()

    const sch = schema({
      optList,
      deepList,
      reqList,
      hiddenList
    })

    const assertSch: A.Contains<
      (typeof sch)['attributes'],
      {
        optList: FreezeAttribute<typeof optList>
        deepList: FreezeAttribute<typeof deepList>
        reqList: FreezeAttribute<typeof reqList>
        hiddenList: FreezeAttribute<typeof hiddenList>
      }
    > = 1
    assertSch

    expect(sch).toMatchObject({
      attributes: {
        optList: optList.freeze('optList'),
        deepList: deepList.freeze('deepList'),
        reqList: reqList.freeze('reqList'),
        hiddenList: hiddenList.freeze('hiddenList')
      }
    })
  })

  test('maps', () => {
    const str = string()
    const flatMap = map({ str })
    const deepMap = map({
      deep: map({ str })
    })
    const reqMap = map({ str })
    const hiddenMap = map({ str }).hidden()

    const sch = schema({ flatMap, deepMap, reqMap, hiddenMap })

    const assertSch: A.Contains<
      (typeof sch)['attributes'],
      {
        flatMap: FreezeAttribute<typeof flatMap>
        deepMap: FreezeAttribute<typeof deepMap>
        reqMap: FreezeAttribute<typeof reqMap>
        hiddenMap: FreezeAttribute<typeof hiddenMap>
      }
    > = 1
    assertSch

    expect(sch).toMatchObject({
      attributes: {
        flatMap: flatMap.freeze('flatMap'),
        deepMap: deepMap.freeze('deepMap'),
        reqMap: reqMap.freeze('reqMap'),
        hiddenMap: hiddenMap.freeze('hiddenMap')
      }
    })
  })

  test('pick', () => {
    const sch = schema({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const pickedSch = sch.pick('hidBool', 'defNum', 'savedAsBin', 'keyStr', 'enumStr')

    const assertSch: A.Equals<
      (typeof pickedSch)['attributes'],
      {
        hidBool: FreezeAttribute<typeof hidBool, true>
        defNum: FreezeAttribute<typeof defNum, true>
        savedAsBin: FreezeAttribute<typeof savedAsBin, true>
        keyStr: FreezeAttribute<typeof keyStr, true>
        enumStr: FreezeAttribute<typeof enumStr, true>
      }
    > = 1
    assertSch
    expect(pickedSch.attributes).toMatchObject({
      hidBool: hidBool.freeze('hidBool'),
      defNum: defNum.freeze('defNum'),
      savedAsBin: savedAsBin.freeze('savedAsBin'),
      keyStr: keyStr.freeze('keyStr'),
      enumStr: enumStr.freeze('enumStr')
    })

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })

  test('omit', () => {
    const sch = schema({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const pickedSch = sch.omit('reqStr')

    const assertSch: A.Equals<
      (typeof pickedSch)['attributes'],
      {
        hidBool: FreezeAttribute<typeof hidBool, true>
        defNum: FreezeAttribute<typeof defNum, true>
        savedAsBin: FreezeAttribute<typeof savedAsBin, true>
        keyStr: FreezeAttribute<typeof keyStr, true>
        enumStr: FreezeAttribute<typeof enumStr, true>
      }
    > = 1
    assertSch
    expect(pickedSch.attributes).toMatchObject({
      hidBool: hidBool.freeze('hidBool'),
      defNum: defNum.freeze('defNum'),
      savedAsBin: savedAsBin.freeze('savedAsBin'),
      keyStr: keyStr.freeze('keyStr'),
      enumStr: enumStr.freeze('enumStr')
    })

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })
})
