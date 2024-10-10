import type { A } from 'ts-toolbelt'

import type { pokemonSchema } from './fixtures.test.js'
import type { Value } from './value.js'

type Put = Value<typeof pokemonSchema>
const assertPut: A.Equals<
  Put,
  {
    any: unknown
    nul?: null | undefined
    bool: boolean
    defaultedNum: number
    bigNum: number | bigint
    keyStr: string
    prefixedStr: 'foo' | 'bar'
    savedAsBin: Uint8Array
    set: Set<string>
    list: number[]
    map: {
      num: number
      str: string
    }
    record: {
      [x: string]: string | undefined
    }
    anyOf: string | number
    linkedStr: string
  }
> = 1
assertPut

type Key = Value<typeof pokemonSchema, { mode: 'key' }>
const assertKey: A.Equals<Key, { keyStr: string }> = 1
assertKey

type Update = Value<typeof pokemonSchema, { mode: 'update' }>
const assertUpdate: A.Equals<
  Update,
  {
    // TOFIX
    any: unknown
    nul?: null
    bool: boolean
    defaultedNum?: number
    bigNum?: number | bigint
    keyStr: string
    prefixedStr?: 'foo' | 'bar'
    savedAsBin?: Uint8Array
    set?: Set<string>
    list?: (number | undefined)[]
    map?: {
      num?: number
      str?: string
    }
    record?: {
      [x: string]: string | undefined
    }
    anyOf?: string | number
    linkedStr?: string
  }
> = 1
assertUpdate
