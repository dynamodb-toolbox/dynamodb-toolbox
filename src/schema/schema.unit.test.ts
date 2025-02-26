import type { A } from 'ts-toolbelt'

import type { FreezeAttribute } from '~/attributes/freeze.js'
import { binary, boolean, list, map, number, set, string } from '~/attributes/index.js'

import { schema } from './schema.js'
import type { ResetLinks } from './utils/resetLinks.js'

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
        reqStr: typeof reqStr
        hidBool: typeof hidBool
        defNum: typeof defNum
        savedAsBin: typeof savedAsBin
        keyStr: typeof keyStr
        enumStr: typeof enumStr
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
        optSet: typeof optSet
        reqSet: typeof reqSet
        hiddenSet: typeof hiddenSet
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
        optList: typeof optList
        deepList: typeof deepList
        reqList: typeof reqList
        hiddenList: typeof hiddenList
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
        flatMap: typeof flatMap
        deepMap: typeof deepMap
        reqMap: typeof reqMap
        hiddenMap: typeof hiddenMap
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
    const prevSch = schema({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevSch>(({ reqStr }) => reqStr)
    const sch = prevSch.and({ linkedStr })

    const pickedSch = sch.pick('hidBool', 'defNum', 'savedAsBin', 'keyStr', 'enumStr', 'linkedStr')

    const assertSch: A.Equals<
      (typeof pickedSch)['attributes'],
      {
        hidBool: ResetLinks<FreezeAttribute<typeof hidBool, true>>
        defNum: ResetLinks<FreezeAttribute<typeof defNum, true>>
        savedAsBin: ResetLinks<FreezeAttribute<typeof savedAsBin, true>>
        keyStr: ResetLinks<FreezeAttribute<typeof keyStr, true>>
        enumStr: ResetLinks<FreezeAttribute<typeof enumStr, true>>
        linkedStr: ResetLinks<FreezeAttribute<typeof linkedStr, true>>
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
    // @ts-expect-error putLink is actually set to undefined
    expect(pickedSch.attributes.linkedStr.state.putLink).toBeUndefined()

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })

  test('omit', () => {
    const prevSch = schema({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevSch>(({ reqStr }) => reqStr)
    const sch = prevSch.and({ linkedStr })

    const omittedSch = sch.omit('reqStr')

    const assertSch: A.Equals<
      (typeof omittedSch)['attributes'],
      {
        hidBool: ResetLinks<FreezeAttribute<typeof hidBool, true>>
        defNum: ResetLinks<FreezeAttribute<typeof defNum, true>>
        savedAsBin: ResetLinks<FreezeAttribute<typeof savedAsBin, true>>
        keyStr: ResetLinks<FreezeAttribute<typeof keyStr, true>>
        enumStr: ResetLinks<FreezeAttribute<typeof enumStr, true>>
        linkedStr: ResetLinks<FreezeAttribute<typeof linkedStr, true>>
      }
    > = 1
    assertSch
    expect(omittedSch.attributes).toMatchObject({
      hidBool: hidBool.freeze('hidBool'),
      defNum: defNum.freeze('defNum'),
      savedAsBin: savedAsBin.freeze('savedAsBin'),
      keyStr: keyStr.freeze('keyStr'),
      enumStr: enumStr.freeze('enumStr')
    })
    // @ts-expect-error putLink is actually set to undefined
    expect(omittedSch.attributes.linkedStr.state.putLink).toBeUndefined()

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })
})
