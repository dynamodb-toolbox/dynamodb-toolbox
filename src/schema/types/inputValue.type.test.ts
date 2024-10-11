import type { A } from 'ts-toolbelt'

import type { testSchema } from './fixtures.test.js'
import type { InputValue } from './inputValue.js'

type Put = InputValue<typeof testSchema>
const assertPut: A.Equals<
  Put,
  {
    any: unknown
    nul?: null | undefined
    bool: boolean
    defaultedNum?: number
    bigNum: number | bigint
    keyStr: string
    hiddenStr: string
    prefixedStr: 'foo' | 'bar'
    savedAsBin: Uint8Array
    set: Set<string>
    list: { num: number; str: string }[]
    map: { num: number; str: string }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
    anyOf: string | number
    linkedStr?: string
  }
> = 1
assertPut

type Key = InputValue<typeof testSchema, { mode: 'key' }>
const assertKey: A.Equals<Key, { keyStr: string }> = 1
assertKey

type Update = InputValue<typeof testSchema, { mode: 'update' }>
const assertUpdate: A.Equals<
  Update,
  {
    any?: unknown
    nul?: null
    bool: boolean
    defaultedNum?: number
    bigNum?: number | bigint
    keyStr: string
    hiddenStr?: string
    prefixedStr?: 'foo' | 'bar'
    savedAsBin?: Uint8Array
    set?: Set<string>
    list?: ({ num?: number; str?: string } | undefined)[]
    map?: { num?: number; str?: string }
    record?: {
      [x: string]: { num?: number; str?: string } | undefined
    }
    anyOf?: string | number
    linkedStr?: string
  }
> = 1
assertUpdate
