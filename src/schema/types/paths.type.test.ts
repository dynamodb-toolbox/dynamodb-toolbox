import type { A } from 'ts-toolbelt'

import {
  any,
  anyOf,
  binary,
  boolean,
  item,
  list,
  map,
  number,
  record,
  set,
  string
} from '~/index.js'

import type { Paths } from './paths.js'

export const mySchema = item({
  parentId: string().key().savedAs('pk'),
  childId: string().key().savedAs('sk'),
  any: any(),
  const: string().const('const'),
  num: number(),
  bool: boolean(),
  bin: binary(),
  stringSet: set(string()),
  stringList: list(string()),
  mapList: list(map({ num: number() })),
  map: map({
    num: number(),
    stringList: list(string()),
    map: map({ num: number() })
  }),
  record: record(string().enum('foo', 'bar'), map({ num: number() })),
  dict: record(string(), string()),
  union: anyOf(map({ str: string() }), map({ num: number() }))
})

export type SCHEMA_PATHS = Paths<typeof mySchema>

const assertAttributePaths: A.Equals<
  | 'parentId'
  | `['parentId']`
  | 'childId'
  | `['childId']`
  | `${'any' | `['any']`}${string}`
  | 'const'
  | `['const']`
  | 'num'
  | `['num']`
  | 'bool'
  | `['bool']`
  | 'bin'
  | `['bin']`
  | 'stringSet'
  | `['stringSet']`
  | `${'stringList' | `['stringList']`}${'' | `[${number}]`}`
  | 'mapList'
  | `['mapList']`
  | `${'mapList' | `['mapList']`}[${number}]${'' | '.num' | `['num']`}`
  | `${'map' | `['map']`}${'' | '.num' | `['num']`}`
  | `${'map' | `['map']`}${'.stringList' | `['stringList']`}${'' | `[${number}]`}`
  | `${'map' | `['map']`}${'.map' | `['map']`}${'' | '.num' | `['num']`}`
  | 'record'
  | `['record']`
  | `${'record' | `['record']`}${'.foo' | '.bar' | `['foo']` | `['bar']`}${'' | '.num' | `['num']`}`
  | `${'dict' | `['dict']`}${'' | `.${string}` | `['${string}']`}`
  | `${'union' | `['union']`}${'' | '.str' | `['str']` | '.num' | `['num']`}`,
  SCHEMA_PATHS
> = 1
assertAttributePaths
