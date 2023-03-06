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
  Conditions,
  Condition,
  AttributeCondition,
  SharedAttributeCondition,
  TypeCondition
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

type ATTRIBUTES = typeof entity['item']['attributes']

type PARENT_ID_CONDITION = AttributeCondition<'parentId', ATTRIBUTES['parentId']>
const assertParentIdCondition: A.Equals<
  | SharedAttributeCondition<'parentId'>
  | { path: 'parentId'; eq: string }
  | { path: 'parentId'; ne: string }
  | { path: 'parentId'; in: string[] }
  | { path: 'parentId'; lt: string }
  | { path: 'parentId'; lte: string }
  | { path: 'parentId'; gt: string }
  | { path: 'parentId'; gte: string }
  | { path: 'parentId'; between: [string, string] }
  | { path: 'parentId'; contains: string }
  | { path: 'parentId'; notContains: string }
  | { path: 'parentId'; beginsWith: string },
  PARENT_ID_CONDITION
> = 1
assertParentIdCondition

type CHILD_ID_CONDITION = AttributeCondition<'childId', ATTRIBUTES['childId']>

type ANY_CONDITION = AttributeCondition<'any', ATTRIBUTES['any']>

const anyCondition: A.Contains<
  | { path: `any${string}`; exists: boolean }
  | { path: `any${string}`; type: TypeCondition }
  | { path: `any${string}`; size: string }
  | { path: `any${string}`; eq: boolean | string | number | Buffer }
  | { path: `any${string}`; ne: boolean | string | number | Buffer }
  | { path: `any${string}`; in: (boolean | string | number | Buffer)[] }
  | { path: `any${string}`; lt: string }
  | { path: `any${string}`; lt: number }
  | { path: `any${string}`; lt: Buffer }
  | { path: `any${string}`; lte: string }
  | { path: `any${string}`; lte: number }
  | { path: `any${string}`; lte: Buffer }
  | { path: `any${string}`; gt: string }
  | { path: `any${string}`; gt: number }
  | { path: `any${string}`; gt: Buffer }
  | { path: `any${string}`; gte: string }
  | { path: `any${string}`; gte: number }
  | { path: `any${string}`; gte: Buffer }
  | { path: `any${string}`; between: [string, string] }
  | { path: `any${string}`; between: [number, number] }
  // TODO: There is a bug with A.Equals, it does not work with Buffer tuple strangely
  | { path: `any${string}`; between: [Buffer, Buffer] }
  | { path: `any${string}`; contains: string }
  | { path: `any${string}`; contains: Buffer }
  | { path: `any${string}`; notContains: string }
  | { path: `any${string}`; notContains: Buffer }
  | { path: `any${string}`; beginsWith: string }
  | { path: `any${string}`; beginsWith: Buffer },
  ANY_CONDITION
> = 1
anyCondition

// TODO: const CONDITION

type NUM_CONDITION = AttributeCondition<'num', ATTRIBUTES['num']>
const assertNumCondition: A.Equals<
  | SharedAttributeCondition<'num'>
  | { path: 'num'; eq: number }
  | { path: 'num'; ne: number }
  | { path: 'num'; in: number[] }
  | { path: 'num'; lt: number }
  | { path: 'num'; lte: number }
  | { path: 'num'; gt: number }
  | { path: 'num'; gte: number }
  | { path: 'num'; between: [number, number] },
  NUM_CONDITION
> = 1
assertNumCondition

type BOOL_CONDITION = AttributeCondition<'bool', ATTRIBUTES['bool']>
const assertBoolCondition: A.Equals<
  | SharedAttributeCondition<'bool'>
  | { path: 'bool'; eq: boolean }
  | { path: 'bool'; ne: boolean }
  | { path: 'bool'; in: boolean[] },
  BOOL_CONDITION
> = 1
assertBoolCondition

type BIN_CONDITION = AttributeCondition<'bin', ATTRIBUTES['bin']>
const assertBinCondition: A.Equals<
  | SharedAttributeCondition<'bin'>
  | { path: 'bin'; eq: Buffer }
  | { path: 'bin'; ne: Buffer }
  | { path: 'bin'; in: Buffer[] }
  | { path: 'bin'; lt: Buffer }
  | { path: 'bin'; lte: Buffer }
  | { path: 'bin'; gt: Buffer }
  | { path: 'bin'; gte: Buffer }
  | { path: 'bin'; between: [Buffer, Buffer] }
  | { path: 'bin'; contains: Buffer }
  | { path: 'bin'; notContains: Buffer }
  | { path: 'bin'; beginsWith: Buffer },
  BIN_CONDITION
> = 1
assertBinCondition

type STRING_SET_CONDITION = AttributeCondition<'stringSet', ATTRIBUTES['stringSet']>
const assertStringSetCondition: A.Equals<
  SharedAttributeCondition<'stringSet'>,
  STRING_SET_CONDITION
> = 1
assertStringSetCondition

type STRING_LIST_CONDITION = AttributeCondition<'stringList', ATTRIBUTES['stringList']>
const assertStringListCondition: A.Equals<
  | SharedAttributeCondition<'stringList'>
  | AttributeCondition<`stringList[${number}]`, ATTRIBUTES['stringList']['elements']>,
  STRING_LIST_CONDITION
> = 1
assertStringListCondition

type MAP_LIST_CONDITION = AttributeCondition<'mapList', ATTRIBUTES['mapList']>
const assertMapListCondition: A.Equals<
  | SharedAttributeCondition<'mapList'>
  | AttributeCondition<`mapList[${number}]`, ATTRIBUTES['mapList']['elements']>
  | AttributeCondition<
      `mapList[${number}].num`,
      ATTRIBUTES['mapList']['elements']['attributes']['num']
    >,
  MAP_LIST_CONDITION
> = 1
assertMapListCondition

type MAP_CONDITION = AttributeCondition<'map', ATTRIBUTES['map']>
const assertMapCondition: A.Equals<
  | SharedAttributeCondition<'map'>
  | AttributeCondition<`map.num`, ATTRIBUTES['map']['attributes']['num']>
  | AttributeCondition<`map.stringList`, ATTRIBUTES['map']['attributes']['stringList']>
  | AttributeCondition<`map.map`, ATTRIBUTES['map']['attributes']['map']>,
  MAP_CONDITION
> = 1
assertMapCondition

type RECORD_CONDITION = AttributeCondition<'record', ATTRIBUTES['record']>
const assertRecordCondition: A.Equals<
  | SharedAttributeCondition<'record'>
  | AttributeCondition<'record.foo' | 'record.bar', ATTRIBUTES['record']['elements']>,
  RECORD_CONDITION
> = 1
assertRecordCondition

type UNION_CONDITION = AttributeCondition<'union', ATTRIBUTES['union']>
const assertUnionCondition: A.Equals<
  | SharedAttributeCondition<'union'>
  | (ATTRIBUTES['union']['elements'][number] extends infer ELEMENT
      ? ELEMENT extends Attribute
        ? AttributeCondition<'union', ELEMENT>
        : never
      : never),
  UNION_CONDITION
> = 1
assertUnionCondition

type ENTITY_CONDITION = Condition<typeof entity>
const assertEntityAttributePaths: A.Contains<
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
  ENTITY_CONDITION
> = 1
assertEntityAttributePaths

const assertEntityConditions: A.Contains<
  | ENTITY_CONDITION
  | { or: ENTITY_CONDITION[] }
  | { and: ENTITY_CONDITION[] }
  | { not: ENTITY_CONDITION },
  Conditions<typeof entity>
> = 1
assertEntityConditions
