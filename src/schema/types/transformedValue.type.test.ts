import type { A } from 'ts-toolbelt'

import type { bigSchema, testSchema } from './fixtures.test.js'
import type { TransformedValue } from './transformedValue.js'

type Put = TransformedValue<typeof testSchema>
const assertPut: A.Equals<
  Put,
  {
    any: unknown
    nul?: null | undefined
    bool: boolean
    defaultedNum: number
    bigNum: number | bigint
    keyStr: string
    hiddenStr: string
    prefixedStr: `PREFIX#${'foo' | 'bar'}`
    _b: Uint8Array
    set: Set<string>
    list: { num: number; str: string }[]
    map: { num: number; str: string }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
    anyOf: string | number
    linkedStr: string
  }
> = 1
assertPut

type Key = TransformedValue<typeof testSchema, { mode: 'key' }>
const assertKey: A.Equals<Key, { keyStr: string }> = 1
assertKey

type Update = TransformedValue<typeof testSchema, { mode: 'update' }>
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
    prefixedStr?: `PREFIX#${'foo' | 'bar'}`
    _b?: Uint8Array
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

type Big = TransformedValue<typeof bigSchema>
const assertBig: A.Equals<
  Big,
  {
    list: string[][][][][][][][][][][][][][][]
    map: {
      map: {
        map: {
          map: {
            map: {
              map: {
                map: {
                  map: {
                    map: { map: { map: { map: { map: { map: { map: { str: string } } } } } } }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
> = 1
assertBig
