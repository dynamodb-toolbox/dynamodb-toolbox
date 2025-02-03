import type { A } from 'ts-toolbelt'

import { cloneDeep } from './cloneDeep.js'

describe('cloneDeep', () => {
  test('clones a binary', () => {
    const originalBin = Uint8Array.from([0, 1])
    const clonedBin = cloneDeep(originalBin)

    expect(clonedBin).toStrictEqual(originalBin)
    const assertBin: A.Equals<typeof clonedBin, typeof originalBin> = 1
    assertBin

    // Does not mute the clone
    clonedBin.reverse()
    expect(clonedBin).not.toStrictEqual(originalBin)
  })

  test('clones a set', () => {
    const originalSet = new Set([0, 1])
    const clonedSet = cloneDeep(originalSet)

    expect(clonedSet).toStrictEqual(originalSet)
    const assertSet: A.Equals<typeof clonedSet, typeof originalSet> = 1
    assertSet

    // Does not mute the clone
    clonedSet.delete(1)
    expect(clonedSet).not.toStrictEqual(originalSet)
  })

  test('clones an array', () => {
    const originalArr = [0, 1]
    const clonedArr = cloneDeep(originalArr)

    expect(clonedArr).toStrictEqual(originalArr)
    const assertArr: A.Equals<typeof clonedArr, typeof originalArr> = 1
    assertArr

    // Does not mute the clone
    clonedArr.pop()
    expect(clonedArr).not.toStrictEqual(originalArr)
  })
})
