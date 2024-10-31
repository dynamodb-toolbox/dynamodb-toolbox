import type { A } from 'ts-toolbelt'

import { chunk } from './chunk.js'

describe('chunk', () => {
  test('chunks the array', () => {
    const originalArray = [1, 2, 3, 4, 5, 6, 7, 8]
    const chunkedArray = chunk(originalArray, 3)

    const assertChunkedArray: A.Equals<typeof chunkedArray, number[][]> = 1
    assertChunkedArray

    expect(chunkedArray).toStrictEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8]
    ])

    // Does not mute the original array
    expect(originalArray.length).toBe(8)
  })
})
