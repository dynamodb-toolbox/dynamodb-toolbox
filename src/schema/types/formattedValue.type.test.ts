import type { A } from 'ts-toolbelt'

import type { testSchema } from './fixtures.test.js'
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
    map: {
      num: number
      str: string
    }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
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
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
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
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
  }
> = 1
assertWhiteListedB

type WhiteListedC = FormattedValue<
  typeof testSchema,
  { attributes: 'list[0].num' | 'map.num' | 'record.test' }
>
const assertWhiteListedC: A.Equals<
  WhiteListedC,
  {
    list: { num: number }[]
    map: { num: number }
    record: {
      [x in string]: { num: number; str: string } | undefined
    }
  }
> = 1
assertWhiteListedC

type WhiteListedD = FormattedValue<
  typeof testSchema,
  { attributes: "['list'][0].num" | "['map'].num" | "['record'].test" }
>
const assertWhiteListedD: A.Equals<
  WhiteListedD,
  {
    list: { num: number }[]
    map: { num: number }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
  }
> = 1
assertWhiteListedD

type WhiteListedE = FormattedValue<
  typeof testSchema,
  { attributes: "list[0]['num']" | "map['num']" | "record['test']" | "record['test'].num" }
>
const assertWhiteListedE: A.Equals<
  WhiteListedE,
  {
    list: { num: number }[]
    map: { num: number }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
  }
> = 1
assertWhiteListedE

type WhiteListedF = FormattedValue<
  typeof testSchema,
  { attributes: "['list'][0]['num']" | "['map']['num']" | "['record']['test']" }
>
const assertWhiteListedF: A.Equals<
  WhiteListedF,
  {
    list: { num: number }[]
    map: { num: number }
    record: {
      [x: string]: { num: number; str: string } | undefined
    }
  }
> = 1
assertWhiteListedF

type WhiteListedG = FormattedValue<typeof testSchema, { attributes: "record['test'].num" }>
const assertWhiteListedG: A.Equals<
  WhiteListedG,
  {
    record: {
      [x: string]: { num: number } | undefined
    }
  }
> = 1
assertWhiteListedG

type WhiteListedH = FormattedValue<typeof testSchema, { attributes: "record['test']['num']" }>
const assertWhiteListedH: A.Equals<
  WhiteListedH,
  {
    record: {
      [x: string]: { num: number } | undefined
    }
  }
> = 1
assertWhiteListedH

type Partial = FormattedValue<typeof testSchema, { partial: true }>
const assertPartial: A.Equals<
  Partial,
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
    record?: {
      [x: string]: { num?: number; str?: string } | undefined
    }
    anyOf?: string | number
    linkedStr?: string
  }
> = 1
assertPartial
