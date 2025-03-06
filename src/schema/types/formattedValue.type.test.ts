import type { A } from 'ts-toolbelt'

import type { bigSchema, testSchema } from './fixtures.test.js'
import type { FormattedValue } from './formattedValue.js'

type Formatted = FormattedValue<typeof testSchema>
const assertFormatted: A.Equals<
  Formatted,
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
    list: { num: number; str: string }[]
    map: { num: number; str: string }
    record: Record<'foo' | 'bar', { num: number; str: string }>
    partialRecord: Partial<Record<'foo' | 'bar', string>>
    anyOf: string | number
    linkedStr: string
  }
> = 1
assertFormatted

type WhiteListedA = FormattedValue<
  typeof testSchema,
  { attributes: 'any' | 'nul' | 'list' | 'map' | 'record' }
>
const assertWhiteListedA: A.Equals<
  WhiteListedA,
  {
    any: unknown
    nul?: null | undefined
    list: { num: number; str: string }[]
    map: { num: number; str: string }
    record: Record<'foo' | 'bar', { num: number; str: string }>
  }
> = 1
assertWhiteListedA

type WhiteListedB = FormattedValue<
  typeof testSchema,
  { attributes: "['any']" | "['nul']" | "['list']" | "['map']" | "['record']" }
>
const assertWhiteListedB: A.Equals<
  WhiteListedB,
  {
    any: unknown
    nul?: null | undefined
    list: { num: number; str: string }[]
    map: { num: number; str: string }
    record: Record<'foo' | 'bar', { num: number; str: string }>
  }
> = 1
assertWhiteListedB

type WhiteListedC = FormattedValue<
  typeof testSchema,
  { attributes: 'list[0].num' | 'map.num' | 'record.foo' }
>
const assertWhiteListedC: A.Equals<
  WhiteListedC,
  {
    list: { num: number }[]
    map: { num: number }
    record: Record<'foo', { num: number; str: string }>
  }
> = 1
assertWhiteListedC

type WhiteListedD = FormattedValue<
  typeof testSchema,
  { attributes: "['list'][0].num" | "['map'].num" | "['record'].foo" }
>
const assertWhiteListedD: A.Equals<
  WhiteListedD,
  {
    list: { num: number }[]
    map: { num: number }
    record: Record<'foo', { num: number; str: string }>
  }
> = 1
assertWhiteListedD

type WhiteListedE = FormattedValue<
  typeof testSchema,
  { attributes: "list[0]['num']" | "map['num']" | "record['foo']" | "record['foo'].num" }
>
const assertWhiteListedE: A.Equals<
  WhiteListedE,
  {
    list: { num: number }[]
    map: { num: number }
    record: Record<'foo', { num: number; str: string }>
  }
> = 1
assertWhiteListedE

type WhiteListedF = FormattedValue<
  typeof testSchema,
  { attributes: "['list'][0]['num']" | "['map']['num']" | "['record']['foo']" }
>
const assertWhiteListedF: A.Equals<
  WhiteListedF,
  {
    list: { num: number }[]
    map: { num: number }
    record: Record<'foo', { num: number; str: string }>
  }
> = 1
assertWhiteListedF

type WhiteListedG = FormattedValue<typeof testSchema, { attributes: "record['foo'].num" }>
const assertWhiteListedG: A.Equals<WhiteListedG, { record: Record<'foo', { num: number }> }> = 1
assertWhiteListedG

type WhiteListedH = FormattedValue<typeof testSchema, { attributes: "record['foo']['num']" }>
const assertWhiteListedH: A.Equals<WhiteListedH, { record: Record<'foo', { num: number }> }> = 1
assertWhiteListedH

type Partial_ = FormattedValue<typeof testSchema, { partial: true }>
const assertPartial: A.Equals<
  Partial_,
  {
    any?: unknown
    nul?: null | undefined
    bool?: boolean
    defaultedNum?: number
    bigNum?: number | bigint
    keyStr?: string
    prefixedStr?: 'foo' | 'bar'
    savedAsBin?: Uint8Array
    set?: Set<string>
    list?: { num?: number; str?: string }[]
    map?: { num?: number; str?: string }
    record?: Partial<Record<'foo' | 'bar', { num?: number; str?: string } | undefined>>
    partialRecord?: Partial<Record<'foo' | 'bar', string>>
    anyOf?: string | number
    linkedStr?: string
  }
> = 1
assertPartial

type Big = FormattedValue<typeof bigSchema>
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
