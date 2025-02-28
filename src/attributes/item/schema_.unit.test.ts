import type { A } from 'ts-toolbelt'

import { binary, boolean, list, map, number, set, string } from '~/attributes/index.js'
import type { ResetLinks } from '~/schema/utils/resetLinks.js'

import type { Light } from '../shared/light.js'
import { item } from './schema_.js'

describe('item', () => {
  const reqStr = string()
  const hidBool = boolean().hidden()
  const defNum = number().putDefault(42)
  const savedAsBin = binary().savedAs('_b')
  const keyStr = string().key()
  const enumStr = string().enum('foo', 'bar')

  test('primitives', () => {
    const sch = item({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })

    const assertType: A.Equals<(typeof sch)['type'], 'item'> = 1
    assertType
    expect(sch.type).toBe('item')

    const assertAttr: A.Equals<
      (typeof sch)['attributes'],
      {
        reqStr: Light<typeof reqStr>
        hidBool: Light<typeof hidBool>
        defNum: Light<typeof defNum>
        savedAsBin: Light<typeof savedAsBin>
        keyStr: Light<typeof keyStr>
        enumStr: Light<typeof enumStr>
      }
    > = 1
    assertAttr

    expect(sch.attributes).toStrictEqual({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })

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

    const sch = item({ optSet, reqSet, hiddenSet })

    const assertSch: A.Equals<
      (typeof sch)['attributes'],
      {
        optSet: Light<typeof optSet>
        reqSet: Light<typeof reqSet>
        hiddenSet: Light<typeof hiddenSet>
      }
    > = 1
    assertSch

    expect(sch.attributes).toStrictEqual({ optSet, reqSet, hiddenSet })
  })

  test('list', () => {
    const str = string()
    const optList = list(str).optional()
    const deepList = list(list(str))
    const reqList = list(str)
    const hiddenList = list(str).optional().hidden()

    const sch = item({
      optList,
      deepList,
      reqList,
      hiddenList
    })

    const assertSch: A.Contains<
      (typeof sch)['attributes'],
      {
        optList: Light<typeof optList>
        deepList: Light<typeof deepList>
        reqList: Light<typeof reqList>
        hiddenList: Light<typeof hiddenList>
      }
    > = 1
    assertSch

    expect(sch.attributes).toStrictEqual({ optList, deepList, reqList, hiddenList })
  })

  test('maps', () => {
    const str = string()
    const flatMap = map({ str })
    const deepMap = map({
      deep: map({ str })
    })
    const reqMap = map({ str })
    const hiddenMap = map({ str }).hidden()

    const sch = item({ flatMap, deepMap, reqMap, hiddenMap })

    const assertSch: A.Contains<
      (typeof sch)['attributes'],
      {
        flatMap: Light<typeof flatMap>
        deepMap: Light<typeof deepMap>
        reqMap: Light<typeof reqMap>
        hiddenMap: Light<typeof hiddenMap>
      }
    > = 1
    assertSch

    expect(sch.attributes).toStrictEqual({ flatMap, deepMap, reqMap, hiddenMap })
  })

  test('pick', () => {
    const prevSch = item({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevSch>(({ reqStr }) => reqStr)
    const sch = prevSch.and({ linkedStr })

    const pickedSch = sch.pick('hidBool', 'defNum', 'savedAsBin', 'keyStr', 'enumStr', 'linkedStr')

    const assertSch: A.Equals<
      (typeof pickedSch)['attributes'],
      {
        hidBool: ResetLinks<typeof hidBool>
        defNum: ResetLinks<typeof defNum>
        savedAsBin: ResetLinks<typeof savedAsBin>
        keyStr: ResetLinks<typeof keyStr>
        enumStr: ResetLinks<typeof enumStr>
        linkedStr: ResetLinks<typeof linkedStr>
      }
    > = 1
    assertSch
    expect(pickedSch.attributes).toMatchObject({ hidBool, defNum, savedAsBin, keyStr, enumStr })
    // @ts-expect-error putLink is actually set to undefined
    expect(pickedSch.attributes.linkedStr.props.putLink).toBeUndefined()

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })

  test('omit', () => {
    const prevSch = item({ reqStr, hidBool, defNum, savedAsBin, keyStr, enumStr })
    const linkedStr = string().link<typeof prevSch>(({ reqStr }) => reqStr)
    const sch = prevSch.and({ linkedStr })

    const omittedSch = sch.omit('reqStr')

    const assertSch: A.Equals<
      (typeof omittedSch)['attributes'],
      {
        hidBool: ResetLinks<typeof hidBool>
        defNum: ResetLinks<typeof defNum>
        savedAsBin: ResetLinks<typeof savedAsBin>
        keyStr: ResetLinks<typeof keyStr>
        enumStr: ResetLinks<typeof enumStr>
        linkedStr: ResetLinks<typeof linkedStr>
      }
    > = 1
    assertSch
    expect(omittedSch.attributes).toMatchObject({ hidBool, defNum, savedAsBin, keyStr, enumStr })
    // @ts-expect-error putLink is actually set to undefined
    expect(omittedSch.attributes.linkedStr.props.putLink).toBeUndefined()

    // doesn't mute original sch
    expect(sch.attributes).toHaveProperty('reqStr')
  })
})
