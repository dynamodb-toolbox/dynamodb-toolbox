import type { A } from 'ts-toolbelt'

import {
  Attribute,
  item,
  any,
  constant,
  string,
  number,
  boolean,
  binary,
  set,
  list,
  map,
  record,
  anyOf
} from 'v1'

import {
  Condition,
  NonLogicalCondition,
  AttributeCondition,
  SharedAttributeCondition,
  TypeCondition,
  AnyAttributePath,
  PathOrSize
} from './types'

const myItem = item({
  parentId: string().key().savedAs('pk'),
  childId: string().key().savedAs('sk'),
  any: any(),
  const: constant('const'),
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
  union: anyOf([map({ str: string() }), map({ num: number() })])
})

type ATTRIBUTE_PATHS = AnyAttributePath<typeof myItem>
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

type ATTRIBUTES = typeof myItem['attributes']

type PARENT_ID_CONDITION = AttributeCondition<'parentId', ATTRIBUTES['parentId'], ATTRIBUTE_PATHS>
const assertParentIdCondition: A.Equals<
  PathOrSize<'parentId'> &
    (
      | SharedAttributeCondition<'parentId'>
      | { eq: string | { attr: ATTRIBUTE_PATHS } }
      | { ne: string | { attr: ATTRIBUTE_PATHS } }
      | { in: (string | { attr: ATTRIBUTE_PATHS })[] }
      | { lt: string | { attr: ATTRIBUTE_PATHS } }
      | { lte: string | { attr: ATTRIBUTE_PATHS } }
      | { gt: string | { attr: ATTRIBUTE_PATHS } }
      | { gte: string | { attr: ATTRIBUTE_PATHS } }
      | { between: [string | { attr: ATTRIBUTE_PATHS }, string | { attr: ATTRIBUTE_PATHS }] }
      | { contains: string | { attr: ATTRIBUTE_PATHS } }
      | { notContains: string | { attr: ATTRIBUTE_PATHS } }
      | { beginsWith: string | { attr: ATTRIBUTE_PATHS } }
    ),
  PARENT_ID_CONDITION
> = 1
assertParentIdCondition

type CHILD_ID_CONDITION = AttributeCondition<'childId', ATTRIBUTES['childId'], ATTRIBUTE_PATHS>

type ANY_CONDITION = AttributeCondition<'any', ATTRIBUTES['any'], ATTRIBUTE_PATHS>

const anyCondition: A.Contains<
  PathOrSize<`any${string}`> &
    (
      | { exists: boolean }
      | { type: TypeCondition }
      | { size: string }
      | { eq: boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS } }
      | { ne: boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS } }
      | { in: (boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS })[] }
      | { lt: string | { attr: ATTRIBUTE_PATHS } }
      | { lt: number | { attr: ATTRIBUTE_PATHS } }
      | { lt: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { lte: string | { attr: ATTRIBUTE_PATHS } }
      | { lte: number | { attr: ATTRIBUTE_PATHS } }
      | { lte: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { gt: string | { attr: ATTRIBUTE_PATHS } }
      | { gt: number | { attr: ATTRIBUTE_PATHS } }
      | { gt: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { gte: string | { attr: ATTRIBUTE_PATHS } }
      | { gte: number | { attr: ATTRIBUTE_PATHS } }
      | { gte: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { between: [string | { attr: ATTRIBUTE_PATHS }, string | { attr: ATTRIBUTE_PATHS }] }
      | { between: [number | { attr: ATTRIBUTE_PATHS }, number | { attr: ATTRIBUTE_PATHS }] }
      // TODO: There is a bug with A.Equals, it does not work with Buffer tuple strangely
      | { between: [Buffer | { attr: ATTRIBUTE_PATHS }, Buffer | { attr: ATTRIBUTE_PATHS }] }
      | { contains: string | { attr: ATTRIBUTE_PATHS } }
      | { contains: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { notContains: string | { attr: ATTRIBUTE_PATHS } }
      | { notContains: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { beginsWith: string | { attr: ATTRIBUTE_PATHS } }
      | { beginsWith: Buffer | { attr: ATTRIBUTE_PATHS } }
    ),
  ANY_CONDITION
> = 1
anyCondition

// TODO: const CONDITION

type NUM_CONDITION = AttributeCondition<'num', ATTRIBUTES['num'], ATTRIBUTE_PATHS>
const assertNumCondition: A.Equals<
  PathOrSize<'num'> &
    (
      | SharedAttributeCondition<'num'>
      | { eq: number | { attr: ATTRIBUTE_PATHS } }
      | { ne: number | { attr: ATTRIBUTE_PATHS } }
      | { in: (number | { attr: ATTRIBUTE_PATHS })[] }
      | { lt: number | { attr: ATTRIBUTE_PATHS } }
      | { lte: number | { attr: ATTRIBUTE_PATHS } }
      | { gt: number | { attr: ATTRIBUTE_PATHS } }
      | { gte: number | { attr: ATTRIBUTE_PATHS } }
      | { between: [number | { attr: ATTRIBUTE_PATHS }, number | { attr: ATTRIBUTE_PATHS }] }
    ),
  NUM_CONDITION
> = 1
assertNumCondition

type BOOL_CONDITION = AttributeCondition<'bool', ATTRIBUTES['bool'], ATTRIBUTE_PATHS>
const assertBoolCondition: A.Equals<
  PathOrSize<'bool'> &
    (
      | SharedAttributeCondition<'bool'>
      | { eq: boolean | { attr: ATTRIBUTE_PATHS } }
      | { ne: boolean | { attr: ATTRIBUTE_PATHS } }
      | { in: (boolean | { attr: ATTRIBUTE_PATHS })[] }
    ),
  BOOL_CONDITION
> = 1
assertBoolCondition

type BIN_CONDITION = AttributeCondition<'bin', ATTRIBUTES['bin'], ATTRIBUTE_PATHS>
const assertBinCondition: A.Equals<
  PathOrSize<'bin'> &
    (
      | SharedAttributeCondition<'bin'>
      | { eq: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { ne: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { in: (Buffer | { attr: ATTRIBUTE_PATHS })[] }
      | { lt: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { lte: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { gt: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { gte: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { between: [Buffer | { attr: ATTRIBUTE_PATHS }, Buffer | { attr: ATTRIBUTE_PATHS }] }
      | { contains: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { notContains: Buffer | { attr: ATTRIBUTE_PATHS } }
      | { beginsWith: Buffer | { attr: ATTRIBUTE_PATHS } }
    ),
  BIN_CONDITION
> = 1
assertBinCondition

type STRING_SET_CONDITION = AttributeCondition<
  'stringSet',
  ATTRIBUTES['stringSet'],
  ATTRIBUTE_PATHS
>
const assertStringSetCondition: A.Equals<
  SharedAttributeCondition<'stringSet'>,
  STRING_SET_CONDITION
> = 1
assertStringSetCondition

type STRING_LIST_CONDITION = AttributeCondition<
  'stringList',
  ATTRIBUTES['stringList'],
  ATTRIBUTE_PATHS
>
const assertStringListCondition: A.Equals<
  | SharedAttributeCondition<'stringList'>
  | AttributeCondition<
      `stringList[${number}]`,
      ATTRIBUTES['stringList']['elements'],
      ATTRIBUTE_PATHS
    >,
  STRING_LIST_CONDITION
> = 1
assertStringListCondition

type MAP_LIST_CONDITION = AttributeCondition<'mapList', ATTRIBUTES['mapList'], ATTRIBUTE_PATHS>
const assertMapListCondition: A.Equals<
  | SharedAttributeCondition<'mapList'>
  | AttributeCondition<`mapList[${number}]`, ATTRIBUTES['mapList']['elements'], ATTRIBUTE_PATHS>
  | AttributeCondition<
      `mapList[${number}].num`,
      ATTRIBUTES['mapList']['elements']['attributes']['num'],
      ATTRIBUTE_PATHS
    >,
  MAP_LIST_CONDITION
> = 1
assertMapListCondition

type MAP_CONDITION = AttributeCondition<'map', ATTRIBUTES['map'], ATTRIBUTE_PATHS>
const assertMapCondition: A.Equals<
  | SharedAttributeCondition<'map'>
  | AttributeCondition<`map.num`, ATTRIBUTES['map']['attributes']['num'], ATTRIBUTE_PATHS>
  | AttributeCondition<
      `map.stringList`,
      ATTRIBUTES['map']['attributes']['stringList'],
      ATTRIBUTE_PATHS
    >
  | AttributeCondition<`map.map`, ATTRIBUTES['map']['attributes']['map'], ATTRIBUTE_PATHS>,
  MAP_CONDITION
> = 1
assertMapCondition

type RECORD_CONDITION = AttributeCondition<'record', ATTRIBUTES['record'], ATTRIBUTE_PATHS>
const assertRecordCondition: A.Equals<
  | SharedAttributeCondition<'record'>
  | AttributeCondition<
      'record.foo' | 'record.bar',
      ATTRIBUTES['record']['elements'],
      ATTRIBUTE_PATHS
    >,
  RECORD_CONDITION
> = 1
assertRecordCondition

type UNION_CONDITION = AttributeCondition<'union', ATTRIBUTES['union'], ATTRIBUTE_PATHS>
const assertUnionCondition: A.Equals<
  | SharedAttributeCondition<'union'>
  | (ATTRIBUTES['union']['elements'][number] extends infer ELEMENT
      ? ELEMENT extends Attribute
        ? AttributeCondition<'union', ELEMENT, ATTRIBUTE_PATHS>
        : never
      : never),
  UNION_CONDITION
> = 1
assertUnionCondition

type ENTITY_NON_LOGICAL_CONDITION = NonLogicalCondition<typeof myItem>
const assertEntityNonLogicalCondition: A.Contains<
  | PARENT_ID_CONDITION
  | CHILD_ID_CONDITION
  | ANY_CONDITION
  | NUM_CONDITION
  | BOOL_CONDITION
  | BIN_CONDITION
  | STRING_SET_CONDITION
  | STRING_LIST_CONDITION
  | MAP_LIST_CONDITION
  | MAP_CONDITION
  | RECORD_CONDITION
  | UNION_CONDITION,
  ENTITY_NON_LOGICAL_CONDITION
> = 1
assertEntityNonLogicalCondition

const assertEntityCondition: A.Contains<
  | ENTITY_NON_LOGICAL_CONDITION
  | { or: ENTITY_NON_LOGICAL_CONDITION[] }
  | { and: ENTITY_NON_LOGICAL_CONDITION[] }
  | { not: ENTITY_NON_LOGICAL_CONDITION },
  Condition<typeof myItem>
> = 1
assertEntityCondition
