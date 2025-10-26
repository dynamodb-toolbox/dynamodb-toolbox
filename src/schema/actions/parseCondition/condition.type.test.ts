import type { A } from 'ts-toolbelt'

import type {
  AnyOfSchema,
  AppendKey,
  BinarySchema,
  BooleanSchema,
  ListSchema,
  MapSchema,
  NumberSchema,
  Paths,
  RecordSchema,
  SetSchema,
  StringSchema
} from '~/schema/index.js'

import type { mySchema } from './condition.fixture.test.js'
import type {
  AnyOfSchemaCondition,
  AttrCondition,
  BinarySchemaCondition,
  BooleanSchemaCondition,
  ConditionType,
  ExistsCondition,
  FreeCondition,
  ListSchemaCondition,
  MapSchemaCondition,
  NonLogicalCondition,
  NullSchemaCondition,
  NumberSchemaCondition,
  RecordSchemaCondition,
  SchemaCondition,
  SetSchemaCondition,
  SizeCondition,
  StringSchemaCondition,
  TypeCondition
} from './condition.js'

type ATTRIBUTES = (typeof mySchema)['attributes']
type ALL_PATHS = Paths<typeof mySchema>

type ANY_ATTR_PATH = 'any' | "['any']"
type ANY_CONDITION = AttrCondition<ANY_ATTR_PATH, ATTRIBUTES['any'], ALL_PATHS>

const anyCondition: A.Equals<
  ANY_CONDITION,
  // Exact path
  | ExistsCondition<ANY_ATTR_PATH>
  | TypeCondition<ANY_ATTR_PATH>
  | NullSchemaCondition<ANY_ATTR_PATH>
  | BooleanSchemaCondition<ANY_ATTR_PATH, BooleanSchema, ALL_PATHS, { foo: 'bar' }>
  | NumberSchemaCondition<ANY_ATTR_PATH, NumberSchema, ALL_PATHS, { foo: 'bar' }>
  | StringSchemaCondition<ANY_ATTR_PATH, StringSchema, ALL_PATHS, { foo: 'bar' }>
  | BinarySchemaCondition<ANY_ATTR_PATH, BinarySchema, ALL_PATHS, { foo: 'bar' }>
  | SetSchemaCondition<ANY_ATTR_PATH, SetSchema, ALL_PATHS>
  | ListSchemaCondition<ANY_ATTR_PATH, ListSchema, ALL_PATHS>
  | MapSchemaCondition<ANY_ATTR_PATH, MapSchema, ALL_PATHS>
  | RecordSchemaCondition<ANY_ATTR_PATH, RecordSchema, ALL_PATHS>
  | AnyOfSchemaCondition<ANY_ATTR_PATH, AnyOfSchema, ALL_PATHS>
  // Sub-paths
  | ExistsCondition<`${ANY_ATTR_PATH}${string}`>
  | TypeCondition<`${ANY_ATTR_PATH}${string}`>
  | NullSchemaCondition<`${ANY_ATTR_PATH}${string}`>
  | BooleanSchemaCondition<`${ANY_ATTR_PATH}${string}`, BooleanSchema, ALL_PATHS>
  | NumberSchemaCondition<`${ANY_ATTR_PATH}${string}`, NumberSchema, ALL_PATHS>
  | StringSchemaCondition<`${ANY_ATTR_PATH}${string}`, StringSchema, ALL_PATHS>
  | BinarySchemaCondition<`${ANY_ATTR_PATH}${string}`, BinarySchema, ALL_PATHS>
  | SetSchemaCondition<`${ANY_ATTR_PATH}${string}`, SetSchema, ALL_PATHS>
  | ListSchemaCondition<`${ANY_ATTR_PATH}${string}`, ListSchema, ALL_PATHS>
  | MapSchemaCondition<`${ANY_ATTR_PATH}${string}`, MapSchema, ALL_PATHS>
  | RecordSchemaCondition<`${ANY_ATTR_PATH}${string}`, RecordSchema, ALL_PATHS>
  | AnyOfSchemaCondition<`${ANY_ATTR_PATH}${string}`, AnyOfSchema, ALL_PATHS>
> = 1
anyCondition

type NULL_ATTR_PATH = 'nul' | "['nul']"
type NULL_CONDITION = AttrCondition<NULL_ATTR_PATH, ATTRIBUTES['nul'], ALL_PATHS>
const assertNullCondition: A.Equals<
  { attr: NULL_ATTR_PATH; exists: boolean } | { attr: NULL_ATTR_PATH; type: ConditionType },
  NULL_CONDITION
> = 1
assertNullCondition

type BOOL_ATTR_PATH = 'bool' | "['bool']"
type BOOL_CONDITION = AttrCondition<BOOL_ATTR_PATH, ATTRIBUTES['bool'], ALL_PATHS>
const assertBoolCondition: A.Equals<
  BOOL_CONDITION,
  | { attr: BOOL_ATTR_PATH; exists: boolean }
  | { attr: BOOL_ATTR_PATH; type: ConditionType }
  | { attr: BOOL_ATTR_PATH; eq: boolean | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BOOL_ATTR_PATH; ne: boolean | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BOOL_ATTR_PATH; in: (boolean | { attr: ALL_PATHS })[]; transform?: boolean }
> = 1
assertBoolCondition

type NUM_ATTR_PATH = 'num' | "['num']"
type NUM_CONDITION = AttrCondition<NUM_ATTR_PATH, ATTRIBUTES['num'], ALL_PATHS>
const assertNumCondition: A.Equals<
  NUM_CONDITION,
  | { attr: NUM_ATTR_PATH; exists: boolean }
  | { attr: NUM_ATTR_PATH; type: ConditionType }
  | { attr: NUM_ATTR_PATH; eq: number | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: NUM_ATTR_PATH; ne: number | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: NUM_ATTR_PATH; in: (number | { attr: ALL_PATHS })[]; transform?: boolean }
  | {
      attr: NUM_ATTR_PATH
      lt: number | bigint | { attr: ALL_PATHS }
      transform?: boolean
    }
  | {
      attr: NUM_ATTR_PATH
      lte: number | bigint | { attr: ALL_PATHS }
      transform?: boolean
    }
  | {
      attr: NUM_ATTR_PATH
      gt: number | bigint | { attr: ALL_PATHS }
      transform?: boolean
    }
  | {
      attr: NUM_ATTR_PATH
      gte: number | bigint | { attr: ALL_PATHS }
      transform?: boolean
    }
  | {
      attr: NUM_ATTR_PATH
      between: [number | bigint | { attr: ALL_PATHS }, number | bigint | { attr: ALL_PATHS }]
      transform?: boolean
    }
> = 1
assertNumCondition

type STR_ATTR_PATH = 'str' | "['str']"
type STR_CONDITION_PARENT_ID = AttrCondition<STR_ATTR_PATH, ATTRIBUTES['str'], ALL_PATHS>
const assertStrCondition: A.Equals<
  STR_CONDITION_PARENT_ID,
  | { attr: STR_ATTR_PATH; exists: boolean }
  | { attr: STR_ATTR_PATH; type: ConditionType }
  | { attr: STR_ATTR_PATH; eq: 'foo' | 'bar' | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: STR_ATTR_PATH; ne: 'foo' | 'bar' | { attr: ALL_PATHS }; transform?: boolean }
  | {
      attr: STR_ATTR_PATH
      in: ('foo' | 'bar' | { attr: ALL_PATHS })[]
      transform?: boolean
    }
  | { attr: STR_ATTR_PATH; lt: string | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: STR_ATTR_PATH; lte: string | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: STR_ATTR_PATH; gt: string | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: STR_ATTR_PATH; gte: string | { attr: ALL_PATHS }; transform?: boolean }
  | {
      attr: STR_ATTR_PATH
      between: [string | { attr: ALL_PATHS }, string | { attr: ALL_PATHS }]
      transform?: boolean
    }
  | {
      attr: STR_ATTR_PATH
      beginsWith: string | { attr: ALL_PATHS }
      transform?: boolean
    }
  | { attr: STR_ATTR_PATH; contains: string | { attr: ALL_PATHS }; transform?: boolean }
  // Using size
  | { size: STR_ATTR_PATH; eq: number | { attr: ALL_PATHS } }
  | { size: STR_ATTR_PATH; ne: number | { attr: ALL_PATHS } }
  | { size: STR_ATTR_PATH; in: (number | { attr: ALL_PATHS })[] }
  | { size: STR_ATTR_PATH; lt: number | { attr: ALL_PATHS } }
  | { size: STR_ATTR_PATH; lte: number | { attr: ALL_PATHS } }
  | { size: STR_ATTR_PATH; gt: number | { attr: ALL_PATHS } }
  | { size: STR_ATTR_PATH; gte: number | { attr: ALL_PATHS } }
  | {
      size: STR_ATTR_PATH
      between: [number | { attr: ALL_PATHS }, number | { attr: ALL_PATHS }]
    }
> = 1
assertStrCondition

type BIN_ATTR_PATH = 'bin' | "['bin']"
type BIN_CONDITION = AttrCondition<BIN_ATTR_PATH, ATTRIBUTES['bin'], ALL_PATHS>
const assertBinCondition: A.Equals<
  BIN_CONDITION,
  | { attr: BIN_ATTR_PATH; exists: boolean }
  | { attr: BIN_ATTR_PATH; type: ConditionType }
  | { attr: BIN_ATTR_PATH; eq: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BIN_ATTR_PATH; ne: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | {
      attr: BIN_ATTR_PATH
      in: (Uint8Array | { attr: ALL_PATHS })[]
      transform?: boolean
    }
  | { attr: BIN_ATTR_PATH; lt: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BIN_ATTR_PATH; lte: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BIN_ATTR_PATH; gt: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | { attr: BIN_ATTR_PATH; gte: Uint8Array | { attr: ALL_PATHS }; transform?: boolean }
  | {
      attr: BIN_ATTR_PATH
      between: [Uint8Array | { attr: ALL_PATHS }, Uint8Array | { attr: ALL_PATHS }]
      transform?: boolean
    }
  // Already tested above
  | SizeCondition<BIN_ATTR_PATH, ALL_PATHS>
> = 1
assertBinCondition

type STRING_SET_ATTR_PATH = 'stringSet' | "['stringSet']"
type STRING_SET_CONDITION = AttrCondition<STRING_SET_ATTR_PATH, ATTRIBUTES['stringSet'], ALL_PATHS>
const assertStringSetCondition: A.Equals<
  STRING_SET_CONDITION,
  | { attr: STRING_SET_ATTR_PATH; exists: boolean }
  | { attr: STRING_SET_ATTR_PATH; type: ConditionType }
  | { attr: STRING_SET_ATTR_PATH; contains: string | { attr: ALL_PATHS }; transform?: boolean }
  // Already tested above
  | SizeCondition<STRING_SET_ATTR_PATH, ALL_PATHS>
> = 1
assertStringSetCondition

type STRING_LIST_ATTR_PATH = 'stringList' | "['stringList']"
type STRING_LIST_CONDITION = AttrCondition<
  STRING_LIST_ATTR_PATH,
  ATTRIBUTES['stringList'],
  ALL_PATHS
>
const assertStringListCondition: A.Equals<
  STRING_LIST_CONDITION,
  | { attr: STRING_LIST_ATTR_PATH; exists: boolean }
  | { attr: STRING_LIST_ATTR_PATH; type: ConditionType }
  | { attr: STRING_LIST_ATTR_PATH; contains: string | { attr: ALL_PATHS }; transform?: boolean }
  // Already tested above
  | StringSchemaCondition<
      `${STRING_LIST_ATTR_PATH}[${number}]`,
      ATTRIBUTES['stringList']['elements'],
      ALL_PATHS
    >
  // Already tested above
  | SizeCondition<STRING_LIST_ATTR_PATH, ALL_PATHS>
> = 1
assertStringListCondition

type MAP_LIST_ATTR_PATH = 'mapList' | "['mapList']"
type MAP_LIST_CONDITION = AttrCondition<MAP_LIST_ATTR_PATH, ATTRIBUTES['mapList'], ALL_PATHS>
const assertMapListCondition: A.Equals<
  MAP_LIST_CONDITION,
  | { attr: MAP_LIST_ATTR_PATH; exists: boolean }
  | { attr: MAP_LIST_ATTR_PATH; type: ConditionType }
  // Already tested below
  | MapSchemaCondition<
      `${MAP_LIST_ATTR_PATH}[${number}]`,
      ATTRIBUTES['mapList']['elements'],
      ALL_PATHS
    >
  // Already tested above
  | SizeCondition<MAP_LIST_ATTR_PATH, ALL_PATHS>
> = 1
assertMapListCondition

type MAP_ATTR_PATH = 'map' | "['map']"
type MAP_CONDITION = AttrCondition<MAP_ATTR_PATH, ATTRIBUTES['map'], ALL_PATHS>
const assertMapCondition: A.Equals<
  MAP_CONDITION,
  | { attr: MAP_ATTR_PATH; exists: boolean }
  | { attr: MAP_ATTR_PATH; type: ConditionType }
  | NumberSchemaCondition<
      AppendKey<MAP_ATTR_PATH, 'num'>,
      ATTRIBUTES['map']['attributes']['num'],
      ALL_PATHS
    >
  | ListSchemaCondition<
      AppendKey<MAP_ATTR_PATH, 'stringList'>,
      ATTRIBUTES['map']['attributes']['stringList'],
      ALL_PATHS
    >
  | MapSchemaCondition<
      AppendKey<MAP_ATTR_PATH, 'map'>,
      ATTRIBUTES['map']['attributes']['map'],
      ALL_PATHS
    >
  // Already tested above
  | SizeCondition<MAP_ATTR_PATH, ALL_PATHS>
> = 1
assertMapCondition

type RECORD_ATTR_PATH = 'record' | "['record']"
type RECORD_CONDITION = AttrCondition<RECORD_ATTR_PATH, ATTRIBUTES['record'], ALL_PATHS>
const assertRecordCondition: A.Equals<
  RECORD_CONDITION,
  | { attr: RECORD_ATTR_PATH; exists: boolean }
  | { attr: RECORD_ATTR_PATH; type: ConditionType }
  // Already tested above (map)
  | AttrCondition<
      AppendKey<RECORD_ATTR_PATH, 'foo' | 'bar'>,
      ATTRIBUTES['record']['elements'],
      ALL_PATHS
    >
  // Already tested above
  | SizeCondition<RECORD_ATTR_PATH, ALL_PATHS>
> = 1
assertRecordCondition

type DICT_ATTR_PATH = 'dict' | "['dict']"
type DICT_CONDITION = AttrCondition<DICT_ATTR_PATH, ATTRIBUTES['dict'], ALL_PATHS>
const assertDictCondition: A.Equals<
  DICT_CONDITION,
  | { attr: DICT_ATTR_PATH; exists: boolean }
  | { attr: DICT_ATTR_PATH; type: ConditionType }
  // Already tested above (string)
  | AttrCondition<AppendKey<DICT_ATTR_PATH, string>, ATTRIBUTES['dict']['elements'], ALL_PATHS>
  // Already tested above
  | SizeCondition<DICT_ATTR_PATH, ALL_PATHS>
> = 1
assertDictCondition

type UNION_ATTR_PATH = 'union' | "['union']"
type UNION_CONDITION = AttrCondition<UNION_ATTR_PATH, ATTRIBUTES['union'], ALL_PATHS>
const assertUnionCondition: A.Equals<
  UNION_CONDITION,
  | { attr: UNION_ATTR_PATH; exists: boolean }
  | { attr: UNION_ATTR_PATH; type: ConditionType }
  // Already tested above (map)
  | AttrCondition<UNION_ATTR_PATH, ATTRIBUTES['union']['elements'][0], ALL_PATHS>
  | AttrCondition<UNION_ATTR_PATH, ATTRIBUTES['union']['elements'][1], ALL_PATHS>
> = 1
assertUnionCondition

type NON_LOGICAL_CONDITION = NonLogicalCondition<typeof mySchema>
const assertNonLogicalCondition: A.Equals<
  | FreeCondition
  | ANY_CONDITION
  | NULL_CONDITION
  | BOOL_CONDITION
  | NUM_CONDITION
  | STR_CONDITION_PARENT_ID
  | BIN_CONDITION
  | STRING_SET_CONDITION
  | STRING_LIST_CONDITION
  | MAP_LIST_CONDITION
  | MAP_CONDITION
  | RECORD_CONDITION
  | DICT_CONDITION
  | UNION_CONDITION,
  NON_LOGICAL_CONDITION
> = 1
assertNonLogicalCondition

type CONDITION = SchemaCondition<typeof mySchema>
const assertSchemaCondition: A.Equals<
  SchemaCondition<typeof mySchema>,
  NON_LOGICAL_CONDITION | { or: CONDITION[] } | { and: CONDITION[] } | { not: CONDITION }
> = 1
assertSchemaCondition
