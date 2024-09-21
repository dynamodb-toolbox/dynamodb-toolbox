import type { A } from 'ts-toolbelt'

import type {
  Attribute,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  NullAttribute,
  NumberAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'

import type { mySchema } from './condition.fixture.test.js'
import type {
  AttrCondition,
  AttrOrSize,
  BaseAttrCondition,
  ConditionType,
  ListAttrCondition,
  NonLogicalCondition,
  PrimitiveAttrCondition,
  SchemaCondition,
  SetAttrCondition
} from './condition.js'

type ATTRIBUTES = (typeof mySchema)['attributes']
type ATTRIBUTE_PATHS = Paths<typeof mySchema>

type PARENT_ID_CONDITION = AttrCondition<'parentId', ATTRIBUTES['parentId'], ATTRIBUTE_PATHS>
const assertParentIdCondition: A.Equals<
  AttrOrSize<'parentId'> &
    (
      | BaseAttrCondition<'parentId'>
      | ({ transform?: boolean } & (
          | { eq: string | { attr: ATTRIBUTE_PATHS } }
          | { ne: string | { attr: ATTRIBUTE_PATHS } }
          | { in: (string | { attr: ATTRIBUTE_PATHS })[] }
          | { lt: string | { attr: ATTRIBUTE_PATHS } }
          | { lte: string | { attr: ATTRIBUTE_PATHS } }
          | { gt: string | { attr: ATTRIBUTE_PATHS } }
          | { gte: string | { attr: ATTRIBUTE_PATHS } }
          | { between: [string | { attr: ATTRIBUTE_PATHS }, string | { attr: ATTRIBUTE_PATHS }] }
          | { contains: string | { attr: ATTRIBUTE_PATHS } }
          | { beginsWith: string | { attr: ATTRIBUTE_PATHS } }
        ))
    ),
  PARENT_ID_CONDITION
> = 1
assertParentIdCondition

type CHILD_ID_CONDITION = AttrCondition<'childId', ATTRIBUTES['childId'], ATTRIBUTE_PATHS>

type ANY_CONDITION = AttrCondition<'any', ATTRIBUTES['any'], ATTRIBUTE_PATHS>

const anyCondition: A.Equals<
  ANY_CONDITION,
  | (AttrOrSize<'any'> & ({ exists: boolean } | { type: ConditionType }))
  | (AttrOrSize<`any${string}`> & ({ exists: boolean } | { type: ConditionType }))
  | PrimitiveAttrCondition<`any${string}`, NullAttribute, ATTRIBUTE_PATHS>
  | PrimitiveAttrCondition<`any${string}`, BooleanAttribute, ATTRIBUTE_PATHS>
  | PrimitiveAttrCondition<`any${string}`, NumberAttribute, ATTRIBUTE_PATHS>
  | PrimitiveAttrCondition<`any${string}`, StringAttribute, ATTRIBUTE_PATHS>
  | PrimitiveAttrCondition<`any${string}`, BinaryAttribute, ATTRIBUTE_PATHS>
  | SetAttrCondition<`any${string}`, SetAttribute, ATTRIBUTE_PATHS>
  | ListAttrCondition<`any${string}`, ListAttribute, ATTRIBUTE_PATHS>
> = 1
anyCondition

type NUM_CONDITION = AttrCondition<'num', ATTRIBUTES['num'], ATTRIBUTE_PATHS>
const assertNumCondition: A.Equals<
  AttrOrSize<'num'> &
    (
      | BaseAttrCondition<'num'>
      | ({ transform?: boolean } & (
          | { eq: number | { attr: ATTRIBUTE_PATHS } }
          | { ne: number | { attr: ATTRIBUTE_PATHS } }
          | { in: (number | { attr: ATTRIBUTE_PATHS })[] }
          | { lt: number | { attr: ATTRIBUTE_PATHS } }
          | { lte: number | { attr: ATTRIBUTE_PATHS } }
          | { gt: number | { attr: ATTRIBUTE_PATHS } }
          | { gte: number | { attr: ATTRIBUTE_PATHS } }
          | { between: [number | { attr: ATTRIBUTE_PATHS }, number | { attr: ATTRIBUTE_PATHS }] }
        ))
    ),
  NUM_CONDITION
> = 1
assertNumCondition

type BOOL_CONDITION = AttrCondition<'bool', ATTRIBUTES['bool'], ATTRIBUTE_PATHS>
const assertBoolCondition: A.Equals<
  AttrOrSize<'bool'> &
    (
      | BaseAttrCondition<'bool'>
      | ({ transform?: boolean } & (
          | { eq: boolean | { attr: ATTRIBUTE_PATHS } }
          | { ne: boolean | { attr: ATTRIBUTE_PATHS } }
          | { in: (boolean | { attr: ATTRIBUTE_PATHS })[] }
        ))
    ),
  BOOL_CONDITION
> = 1
assertBoolCondition

type BIN_CONDITION = AttrCondition<'bin', ATTRIBUTES['bin'], ATTRIBUTE_PATHS>
const assertBinCondition: A.Equals<
  BIN_CONDITION,
  AttrOrSize<'bin'> &
    (
      | BaseAttrCondition<'bin'>
      | ({ transform?: boolean } & (
          | { eq: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | { ne: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | { in: (Uint8Array | { attr: ATTRIBUTE_PATHS })[] }
          | { lt: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | { lte: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | { gt: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | { gte: Uint8Array | { attr: ATTRIBUTE_PATHS } }
          | {
              between: [
                Uint8Array | { attr: ATTRIBUTE_PATHS },
                Uint8Array | { attr: ATTRIBUTE_PATHS }
              ]
            }
        ))
    )
> = 1
assertBinCondition

type STRING_SET_CONDITION = AttrCondition<'stringSet', ATTRIBUTES['stringSet'], ATTRIBUTE_PATHS>
const assertStringSetCondition: A.Equals<
  STRING_SET_CONDITION,
  AttrOrSize<'stringSet'> &
    (BaseAttrCondition<'stringSet'> | { contains: string | { attr: ATTRIBUTE_PATHS } })
> = 1
assertStringSetCondition

type STRING_LIST_CONDITION = AttrCondition<'stringList', ATTRIBUTES['stringList'], ATTRIBUTE_PATHS>
const assertStringListCondition: A.Equals<
  STRING_LIST_CONDITION,
  | BaseAttrCondition<'stringList'>
  | (AttrOrSize<'stringList'> & { contains: string | { attr: ATTRIBUTE_PATHS } })
  | AttrCondition<`stringList[${number}]`, ATTRIBUTES['stringList']['elements'], ATTRIBUTE_PATHS>
> = 1
assertStringListCondition

type MAP_LIST_CONDITION = AttrCondition<'mapList', ATTRIBUTES['mapList'], ATTRIBUTE_PATHS>
const assertMapListCondition: A.Equals<
  | BaseAttrCondition<'mapList'>
  | AttrCondition<`mapList[${number}]`, ATTRIBUTES['mapList']['elements'], ATTRIBUTE_PATHS>,
  MAP_LIST_CONDITION
> = 1
assertMapListCondition

type MAP_CONDITION = AttrCondition<'map', ATTRIBUTES['map'], ATTRIBUTE_PATHS>
const assertMapCondition: A.Equals<
  MAP_CONDITION,
  | BaseAttrCondition<'map'>
  | AttrCondition<`map.num`, ATTRIBUTES['map']['attributes']['num'], ATTRIBUTE_PATHS>
  | AttrCondition<`map.stringList`, ATTRIBUTES['map']['attributes']['stringList'], ATTRIBUTE_PATHS>
  | AttrCondition<`map.map`, ATTRIBUTES['map']['attributes']['map'], ATTRIBUTE_PATHS>
> = 1
assertMapCondition

type RECORD_CONDITION = AttrCondition<'record', ATTRIBUTES['record'], ATTRIBUTE_PATHS>
const assertRecordCondition: A.Equals<
  RECORD_CONDITION,
  | BaseAttrCondition<'record'>
  | AttrCondition<'record.foo' | 'record.bar', ATTRIBUTES['record']['elements'], ATTRIBUTE_PATHS>
> = 1
assertRecordCondition

type UNION_CONDITION = AttrCondition<'union', ATTRIBUTES['union'], ATTRIBUTE_PATHS>
const assertUnionCondition: A.Equals<
  UNION_CONDITION,
  | BaseAttrCondition<'union'>
  | (ATTRIBUTES['union']['elements'][number] extends infer ELEMENT
      ? ELEMENT extends Attribute
        ? AttrCondition<'union', ELEMENT, ATTRIBUTE_PATHS>
        : never
      : never)
> = 1
assertUnionCondition

type NON_LOGICAL_CONDITION = NonLogicalCondition<typeof mySchema>
const assertNonLogicalCondition: A.Contains<
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
  NON_LOGICAL_CONDITION
> = 1
assertNonLogicalCondition

const assertEntityCondition: A.Contains<
  | NON_LOGICAL_CONDITION
  | { or: NON_LOGICAL_CONDITION[] }
  | { and: NON_LOGICAL_CONDITION[] }
  | { not: NON_LOGICAL_CONDITION },
  SchemaCondition<typeof mySchema>
> = 1
assertEntityCondition
