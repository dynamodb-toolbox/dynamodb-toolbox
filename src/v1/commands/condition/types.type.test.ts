import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { A } from 'ts-toolbelt'

import {
  TableV2,
  EntityV2,
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

import type {
  Condition,
  NonLogicalCondition,
  AttributeCondition,
  SharedAttributeCondition,
  TypeCondition,
  AnyAttributePath
} from './types'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const table = new TableV2({
  name: 'table',
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'string' },
  documentClient
})

const entity = new EntityV2({
  name: 'entity',
  item: item({
    parentId: string().key().required('always').savedAs('pk'),
    childId: string().key().required('always').savedAs('sk'),
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
  }),
  table
})

type ATTRIBUTE_PATHS = AnyAttributePath<typeof entity>
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

type ATTRIBUTES = typeof entity['item']['attributes']

type PARENT_ID_CONDITION = AttributeCondition<'parentId', ATTRIBUTES['parentId'], ATTRIBUTE_PATHS>
const assertParentIdCondition: A.Equals<
  | SharedAttributeCondition<'parentId'>
  | { path: 'parentId'; eq: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; ne: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; in: (string | { attr: ATTRIBUTE_PATHS })[] }
  | { path: 'parentId'; lt: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; lte: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; gt: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; gte: string | { attr: ATTRIBUTE_PATHS } }
  | {
      path: 'parentId'
      between: [string | { attr: ATTRIBUTE_PATHS }, string | { attr: ATTRIBUTE_PATHS }]
    }
  | { path: 'parentId'; contains: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; notContains: string | { attr: ATTRIBUTE_PATHS } }
  | { path: 'parentId'; beginsWith: string | { attr: ATTRIBUTE_PATHS } },
  PARENT_ID_CONDITION
> = 1
assertParentIdCondition

type CHILD_ID_CONDITION = AttributeCondition<'childId', ATTRIBUTES['childId'], ATTRIBUTE_PATHS>

type ANY_CONDITION = AttributeCondition<'any', ATTRIBUTES['any'], ATTRIBUTE_PATHS>

const anyCondition: A.Contains<
  | { path: `any${string}`; exists: boolean }
  | { path: `any${string}`; type: TypeCondition }
  | { path: `any${string}`; size: string }
  | { path: `any${string}`; eq: boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; ne: boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; in: (boolean | string | number | Buffer | { attr: ATTRIBUTE_PATHS })[] }
  | { path: `any${string}`; lt: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; lt: number | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; lt: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; lte: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; lte: number | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; lte: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gt: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gt: number | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gt: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gte: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gte: number | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; gte: Buffer | { attr: ATTRIBUTE_PATHS } }
  | {
      path: `any${string}`
      between: [string | { attr: ATTRIBUTE_PATHS }, string | { attr: ATTRIBUTE_PATHS }]
    }
  | {
      path: `any${string}`
      between: [number | { attr: ATTRIBUTE_PATHS }, number | { attr: ATTRIBUTE_PATHS }]
    }
  // TODO: There is a bug with A.Equals, it does not work with Buffer tuple strangely
  | {
      path: `any${string}`
      between: [Buffer | { attr: ATTRIBUTE_PATHS }, Buffer | { attr: ATTRIBUTE_PATHS }]
    }
  | { path: `any${string}`; contains: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; contains: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; notContains: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; notContains: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; beginsWith: string | { attr: ATTRIBUTE_PATHS } }
  | { path: `any${string}`; beginsWith: Buffer | { attr: ATTRIBUTE_PATHS } },
  ANY_CONDITION
> = 1
anyCondition

// TODO: const CONDITION

type NUM_CONDITION = AttributeCondition<'num', ATTRIBUTES['num'], ATTRIBUTE_PATHS>
const assertNumCondition: A.Equals<
  | SharedAttributeCondition<'num'>
  | { path: 'num'; eq: number | { attr: ATTRIBUTE_PATHS } }
  | { path: 'num'; ne: number | { attr: ATTRIBUTE_PATHS } }
  | { path: 'num'; in: (number | { attr: ATTRIBUTE_PATHS })[] }
  | { path: 'num'; lt: number | { attr: ATTRIBUTE_PATHS } }
  | { path: 'num'; lte: number | { attr: ATTRIBUTE_PATHS } }
  | { path: 'num'; gt: number | { attr: ATTRIBUTE_PATHS } }
  | { path: 'num'; gte: number | { attr: ATTRIBUTE_PATHS } }
  | {
      path: 'num'
      between: [number | { attr: ATTRIBUTE_PATHS }, number | { attr: ATTRIBUTE_PATHS }]
    },
  NUM_CONDITION
> = 1
assertNumCondition

type BOOL_CONDITION = AttributeCondition<'bool', ATTRIBUTES['bool'], ATTRIBUTE_PATHS>
const assertBoolCondition: A.Equals<
  | SharedAttributeCondition<'bool'>
  | { path: 'bool'; eq: boolean | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bool'; ne: boolean | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bool'; in: (boolean | { attr: ATTRIBUTE_PATHS })[] },
  BOOL_CONDITION
> = 1
assertBoolCondition

type BIN_CONDITION = AttributeCondition<'bin', ATTRIBUTES['bin'], ATTRIBUTE_PATHS>
const assertBinCondition: A.Equals<
  | SharedAttributeCondition<'bin'>
  | { path: 'bin'; eq: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; ne: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; in: (Buffer | { attr: ATTRIBUTE_PATHS })[] }
  | { path: 'bin'; lt: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; lte: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; gt: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; gte: Buffer | { attr: ATTRIBUTE_PATHS } }
  | {
      path: 'bin'
      between: [Buffer | { attr: ATTRIBUTE_PATHS }, Buffer | { attr: ATTRIBUTE_PATHS }]
    }
  | { path: 'bin'; contains: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; notContains: Buffer | { attr: ATTRIBUTE_PATHS } }
  | { path: 'bin'; beginsWith: Buffer | { attr: ATTRIBUTE_PATHS } },
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

type ENTITY_NON_LOGICAL_CONDITION = NonLogicalCondition<typeof entity>
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
  Condition<typeof entity>
> = 1
assertEntityCondition
