import type { A } from 'ts-toolbelt'

import {
  schema,
  any,
  string,
  number,
  boolean,
  binary,
  set,
  list,
  map,
  record,
  anyOf
} from '~/index.js'

import type { Paths } from './paths.js'

export const mySchema = schema({
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
    map: map({
      num: number()
    })
  }),
  record: record(string().enum('foo', 'bar'), map({ num: number() })),
  union: anyOf(map({ str: string() }), map({ num: number() }))
})

export type ATTRIBUTE_PATHS = Paths<typeof mySchema>
const assertAttributePaths: A.Equals<
  | 'parentId'
  | 'childId'
  | 'any'
  | `any${string}`
  | 'const'
  | 'num'
  | 'bool'
  | 'bin'
  | 'stringSet'
  | 'stringList'
  | `stringList[${number}]`
  | 'mapList'
  | `mapList[${number}]`
  | `mapList[${number}].num`
  | 'map'
  | `map.num`
  | `map.stringList`
  | `map.stringList[${number}]`
  | `map.map`
  | `map.map.num`
  | 'record'
  | `record.${'foo' | 'bar'}`
  | `record.${'foo' | 'bar'}.num`
  | 'union'
  | 'union.str'
  | 'union.num',
  ATTRIBUTE_PATHS
> = 1
assertAttributePaths
