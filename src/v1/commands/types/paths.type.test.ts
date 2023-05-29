import type { A } from 'ts-toolbelt'

import { mySchema } from './fixtures.test'
import type { AnyAttributePath } from './paths'

export type ATTRIBUTE_PATHS = AnyAttributePath<typeof mySchema>
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
