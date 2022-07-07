import type { DocumentClient } from 'aws-sdk/clients/dynamodb';
import type { A, B, O } from 'ts-toolbelt';

import type { FirstDefined, If, PreventKeys } from '../../lib/utils';
import type { DynamoDBKeyTypes, DynamoDBTypes, $QueryOptions, TableDef } from '../Table';


export interface EntityConstructor<EntityTable extends TableDef | undefined = undefined,
  Name extends string = string,
  AutoExecute extends boolean = true,
  AutoParse extends boolean = true,
  Timestamps extends boolean = true,
  CreatedAlias extends string = 'created',
  ModifiedAlias extends string = 'modified',
  TypeAlias extends string = 'entity',
  ReadonlyAttributeDefinitions extends PreventKeys<AttributeDefinitions | O.Readonly<AttributeDefinitions, A.Key, 'deep'>,
    CreatedAlias | ModifiedAlias | TypeAlias> = PreventKeys<AttributeDefinitions, CreatedAlias | ModifiedAlias | TypeAlias>> {
  table?: EntityTable;
  name: Name;
  timestamps?: Timestamps;
  created?: string;
  modified?: string;
  createdAlias?: CreatedAlias;
  modifiedAlias?: ModifiedAlias;
  typeAlias?: TypeAlias;
  attributes: ReadonlyAttributeDefinitions;
  autoExecute?: AutoExecute;
  autoParse?: AutoParse;
}

type KeyAttributeDefinition = {
  type: 'string' | 'number' | 'binary'
  // 🔨 TOIMPROVE: Probably typable
  default: any
  hidden: boolean
  delimiter: string
  prefix: string
  suffix: string
  onUpdate: boolean
  dependsOn: string | string[]
  transform: (value: any, data: any) => any
  coerce: boolean
  // 💥 TODO: Are following options forbidden in KeyAttributeDefinitions ?
  save: never
  required: never
  alias: never
  map: never
  setType: never
}

export type PartitionKeyDefinition = O.Partial<KeyAttributeDefinition> & {
  partitionKey: true
  sortKey?: false
}

export type GSIPartitionKeyDefinition = O.Partial<KeyAttributeDefinition> & {
  partitionKey: string
  sortKey?: false
}

export type SortKeyDefinition = O.Partial<KeyAttributeDefinition> & {
  sortKey: true
  partitionKey?: false
}

export type GSISortKeyDefinition = O.Partial<KeyAttributeDefinition> & {
  partitionKey?: false
  sortKey: string
}

export type PureAttributeDefinition = O.Partial<{
  partitionKey: false
  sortKey: false
  type: DynamoDBTypes
  // 🔨 TOIMPROVE: Probably typable
  default: any | ((data: object) => any)
  dependsOn: string | string[]
  // 🔨 TOIMPROVE: Probably typable
  transform: (value: any, data: {}) => any
  coerce: boolean
  save: boolean
  onUpdate: boolean
  hidden: boolean
  required: boolean | 'always'
  alias: string
  map: string
  setType: DynamoDBKeyTypes
  delimiter: string
  prefix: string
  suffix: string
}>

export type CompositeAttributeDefinition =
  | [string, number]
  | [string, number, DynamoDBTypes]
  | [string, number, PureAttributeDefinition]

type AttributeDefinition =
  | DynamoDBTypes
  | PartitionKeyDefinition
  | SortKeyDefinition
  | GSIPartitionKeyDefinition
  | GSISortKeyDefinition
  | PureAttributeDefinition
  | CompositeAttributeDefinition

export type AttributeDefinitions = Record<A.Key, AttributeDefinition>

type InferKeyAttribute<Definitions extends AttributeDefinitions,
  KeyType extends 'partitionKey' | 'sortKey'> = O.SelectKeys<Definitions, Record<KeyType, true>>

type InferMappedAttributes<Definitions extends AttributeDefinitions,
  AttributeName extends A.Key> = O.SelectKeys<Definitions, [AttributeName, any, any?]>

export interface ParsedAttributes<Attributes extends A.Key = A.Key> {
  aliases: Attributes;
  all: Attributes;
  default: Attributes;
  key: {
    partitionKey: { pure: Attributes; dependsOn: Attributes; mapped: Attributes; all: Attributes }
    sortKey: { pure: Attributes; dependsOn: Attributes; mapped: Attributes; all: Attributes }
    all: Attributes
  };
  always: { all: Attributes; default: Attributes; input: Attributes };
  required: { all: Attributes; default: Attributes; input: Attributes };
  optional: Attributes;
  shown: Attributes;
}

type GetDependsOnAttributes<A extends AttributeDefinition> = A extends { dependsOn: A.Key }
  ? A['dependsOn']
  : A extends { dependsOn: A.Key[] }
    ? A['dependsOn'][number]
    : never

export type ParseAttributes<Definitions extends AttributeDefinitions,
  Timestamps extends boolean,
  CreatedAlias extends string,
  ModifiedAlias extends string,
  TypeAlias extends string,
  Aliases extends string =
      | (Timestamps extends true ? CreatedAlias | ModifiedAlias : never)
    | TypeAlias,
  Default extends A.Key =
      | O.SelectKeys<Definitions, { default: any } | [any, any, { default: any }]>
    | Aliases,
  PK extends A.Key = InferKeyAttribute<Definitions, 'partitionKey'>,
  PKDependsOn extends A.Key = GetDependsOnAttributes<Definitions[PK]>,
  PKMappedAttribute extends A.Key = InferMappedAttributes<Definitions, PK>,
  SK extends A.Key = InferKeyAttribute<Definitions, 'sortKey'>,
  SKDependsOn extends A.Key = GetDependsOnAttributes<Definitions[SK]>,
  SKMappedAttribute extends A.Key = InferMappedAttributes<Definitions, SK>,
  KeyAttributes extends A.Key = PK | PKMappedAttribute | SK | SKMappedAttribute,
  AlwaysAttributes extends A.Key = Exclude<| O.SelectKeys<Definitions, { required: 'always' } | [any, any, { required: 'always' }]>
    | (Timestamps extends true ? ModifiedAlias : never),
    KeyAttributes>,
  RequiredAttributes extends A.Key = Exclude<| O.SelectKeys<Definitions, { required: true } | [any, any, { required: true }]>
    | (Timestamps extends true ? CreatedAlias : never)
    | TypeAlias,
    KeyAttributes>,
  // 🔨 TOIMPROVE: Use EntityTable to infer extra attributes
  Attribute extends A.Key = keyof Definitions | Aliases,
  Hidden extends A.Key = O.SelectKeys<Definitions, { hidden: true } | [any, any, { hidden: true }]>> = {
  aliases: Aliases
  all: Attribute
  default: Default
  key: {
    partitionKey: {
      pure: PK
      mapped: PKMappedAttribute
      dependsOn: PKDependsOn
      all: PK | PKDependsOn | PKMappedAttribute
    }
    sortKey: {
      pure: SK
      mapped: SKMappedAttribute
      dependsOn: SKDependsOn
      all: SK | SKDependsOn | SKMappedAttribute
    }
    all: KeyAttributes
  }
  always: {
    all: AlwaysAttributes
    default: Extract<AlwaysAttributes, Default>
    input: Exclude<AlwaysAttributes, Default>
  }
  required: {
    all: RequiredAttributes
    default: Extract<RequiredAttributes, Default>
    input: Exclude<RequiredAttributes, Default>
  }
  optional: Exclude<Attribute, KeyAttributes | AlwaysAttributes | RequiredAttributes>
  shown: Exclude<Attribute, Hidden>
}

type FromDynamoData<T extends DynamoDBTypes> = {
  string: string
  boolean: boolean
  number: number
  list: any[]
  map: any
  binary: any
  set: any[]
}[T]

type InferItemAttributeValue<Definitions extends AttributeDefinitions,
  AttributeName extends keyof Definitions,
  Definition = Definitions[AttributeName]> = {
  dynamoDbType: Definition extends DynamoDBTypes ? FromDynamoData<Definition> : never
  pure: Definition extends | PartitionKeyDefinition
    | GSIPartitionKeyDefinition
    | SortKeyDefinition
    | GSISortKeyDefinition
    | PureAttributeDefinition
    ? Definition['type'] extends DynamoDBTypes
      ? FromDynamoData<A.Cast<Definition['type'], DynamoDBTypes>>
      : any
    : never
  composite: Definition extends CompositeAttributeDefinition
    ? Definition[0] extends Exclude<keyof Definitions, AttributeName>
      ? InferItemAttributeValue<Definitions, Definition[0]>
      : any
    : never
}[Definition extends DynamoDBTypes
  ? 'dynamoDbType'
  : Definition extends | PartitionKeyDefinition
    | GSIPartitionKeyDefinition
    | SortKeyDefinition
    | GSISortKeyDefinition
    | PureAttributeDefinition
    ? 'pure'
    : Definition extends CompositeAttributeDefinition
      ? 'composite'
      : never]

export type InferItem<Definitions extends AttributeDefinitions,
  Attributes extends ParsedAttributes> = O.Optional<{
  [K in Attributes['all']]: K extends keyof Definitions
    ? InferItemAttributeValue<Definitions, K>
    : K extends Attributes['aliases']
      ? string
      : never
},
  Attributes['optional']>

type CompositePrimaryKeyPart<Item extends O.Object,
  Attributes extends ParsedAttributes,
  KeyType extends 'partitionKey' | 'sortKey',
  KeyPureAttribute extends A.Key = Attributes['key'][KeyType]['pure'],
  KeyDependsOnAttributes extends A.Key = Attributes['key'][KeyType]['dependsOn'],
  KeyCompositeAttributes extends A.Key = Attributes['key'][KeyType]['mapped']> = If<A.Equals<KeyPureAttribute, never>,
  Record<never, unknown>,
  O.Optional<| O.Pick<Item, KeyPureAttribute>
    | If<A.Equals<KeyDependsOnAttributes, never>, never, O.Pick<Item, KeyDependsOnAttributes>>
    | If<A.Equals<KeyCompositeAttributes, never>, never, O.Pick<Item, KeyCompositeAttributes>>,
    If<A.Equals<KeyDependsOnAttributes, never>,
      // If primary key part doesn't have "dependsOn" attribute, either it has "default" attribute and is optional,
      // either it doesn't and is required
      Attributes['default'],
      // If primary key part has "dependsOn" attribute, "default" should be a function using other attributes. We want
      // either: - O.Pick<Item, KeyDependsOnAttributes> which should not contain KeyPureAttribute - O.Pick<Item,
      // KeyPureAttribute> with KeyPureAttribute NOT optional this time
      Exclude<Attributes['default'], KeyPureAttribute>>>>

export type InferCompositePrimaryKey<Item extends O.Object,
  Attributes extends ParsedAttributes> = A.Compute<CompositePrimaryKeyPart<Item, Attributes, 'partitionKey'> &
  CompositePrimaryKeyPart<Item, Attributes, 'sortKey'>>

// Options

export type Overlay = undefined | O.Object

type ConditionOrFilter<Attributes extends A.Key = A.Key> = (
  | { attr: Attributes }
  | { size: string }
  ) &
  O.Partial<{
    contains: string
    exists: boolean
    type: 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'
    or: boolean
    negate: boolean
    entity: string
    // 🔨 TOIMPROVE: Probably typable
    eq: string | number | boolean | null
    ne: string | number | boolean | null
    lt: string | number
    lte: string | number
    gt: string | number
    gte: string | number
    between: [string, string] | [number, number]
    beginsWith: string
    in: any[]
  }>

export type ConditionsOrFilters<Attributes extends A.Key = A.Key> =
  | ConditionOrFilter<Attributes>
  | ConditionsOrFilters<Attributes>[]

type BaseOptions<Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = {
  capacity: DocumentClient.ReturnConsumedCapacity
  execute: Execute
  parse: Parse
}

export type $ReadOptions<Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = BaseOptions<Execute, Parse> & {
  consistent: boolean
}

export type $GetOptions<Attributes extends A.Key = A.Key,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = O.Partial<$ReadOptions<Execute, Parse> & { attributes: Attributes[]; include: string[] }>

export type EntityQueryOptions<Attributes extends A.Key = A.Key,
  FiltersAttributes extends A.Key = Attributes,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = O.Partial<$QueryOptions<Execute, Parse> & {
  attributes: Attributes[]
  filters: ConditionsOrFilters<FiltersAttributes>
}>

type $WriteOptions<Attributes extends A.Key = A.Key,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = BaseOptions<Execute, Parse> & {
  conditions: ConditionsOrFilters<Attributes>
  metrics: DocumentClient.ReturnItemCollectionMetrics
  include: string[]
}

export type PutOptionsReturnValues = 'NONE' | 'ALL_OLD'

export type $PutOptions<Attributes extends A.Key = A.Key,
  ReturnValues extends PutOptionsReturnValues = PutOptionsReturnValues,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = O.Partial<$WriteOptions<Attributes, Execute, Parse> & { returnValues: ReturnValues }>

export type PutItem<MethodItemOverlay extends Overlay,
  EntityItemOverlay extends Overlay,
  CompositePrimaryKey extends O.Object,
  Item extends O.Object,
  Attributes extends ParsedAttributes> = FirstDefined<[
  MethodItemOverlay,
  EntityItemOverlay,
  A.Compute<CompositePrimaryKey &
    O.Pick<Item, Attributes['always']['input'] | Attributes['required']['input']> &
    O.Partial<O.Pick<Item,
      | Attributes['always']['default']
      | Attributes['required']['default']
      | Attributes['optional']>>>
]>

export type UpdateOptionsReturnValues = 'NONE' | 'UPDATED_OLD' | 'UPDATED_NEW' | 'ALL_OLD' | 'ALL_NEW'

export type $UpdateOptions<Attributes extends A.Key = A.Key,
  ReturnValues extends UpdateOptionsReturnValues = UpdateOptionsReturnValues,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = O.Partial<$WriteOptions<Attributes, Execute, Parse> & { returnValues: ReturnValues }>

interface UpdateCustomParameters {
  SET: string[];
  REMOVE: string[];
  ADD: string[];
  DELETE: string[];
}

export type UpdateCustomParams = O.Partial<UpdateCustomParameters & DocumentClient.UpdateItemInput>

export type UpdateItem<MethodItemOverlay extends Overlay,
  EntityItemOverlay extends Overlay,
  CompositePrimaryKey extends O.Object,
  Item extends O.Object,
  Attributes extends ParsedAttributes> = FirstDefined<[
  MethodItemOverlay,
  EntityItemOverlay,
  A.Compute<CompositePrimaryKey &
    {
      [inputAttr in Attributes['always']['input']]:
      | Item[A.Cast<inputAttr, keyof Item>]
      | { $delete?: string[]; $add?: any }
    } &
    {
      [optAttr in Attributes['required']['all'] | Attributes['always']['default']]?:
      | Item[A.Cast<optAttr, keyof Item>]
      | { $delete?: string[]; $add?: any }
    } &
    {
      [attr in Attributes['optional']]?:
      | null
      | Item[A.Cast<attr, keyof Item>]
      | { $delete?: string[]; $add?: any }
    } & { $remove?: Attributes['optional'] | Attributes['optional'][] }
      & {
       $append?: unknown[];
       $prepend?: unknown[];
  }>
]>

export type DeleteOptionsReturnValues = 'NONE' | 'ALL_OLD'

export type RawDeleteOptions<Attributes extends A.Key = A.Key,
  ReturnValues extends DeleteOptionsReturnValues = DeleteOptionsReturnValues,
  Execute extends boolean | undefined = undefined,
  Parse extends boolean | undefined = undefined> = O.Partial<$WriteOptions<Attributes, Execute, Parse> & { returnValues: ReturnValues }>

export type TransactionOptionsReturnValues = 'NONE' | 'ALL_OLD'

export interface TransactionOptions<Attributes extends A.Key = A.Key> {
  conditions?: ConditionsOrFilters<Attributes>;
  returnValues?: TransactionOptionsReturnValues;
}

export type ShouldExecute<Execute extends boolean | undefined, AutoExecute extends boolean> = B.Or<A.Equals<Execute, true>,
  B.And<A.Equals<Execute, undefined>, A.Equals<AutoExecute, true>>>

export type ShouldParse<Parse extends boolean | undefined, AutoParse extends boolean> = B.Or<A.Equals<Parse, true>,
  B.And<A.Equals<Parse, undefined>, A.Equals<AutoParse, true>>>

export type Readonly<T> = T extends O.Object ? { readonly [P in keyof T]: Readonly<T[P]> } : T
export type Writable<T> = { -readonly [P in keyof T]: Writable<T[P]> }

type EntityDef = {
  _typesOnly: { _entityItemOverlay: Overlay }
  timestamps: boolean
  createdAlias: string
  modifiedAlias: string
  typeAlias: string
  attributes: AttributeDefinitions | O.Readonly<AttributeDefinitions, A.Key, 'deep'>
}

type InferEntityItem<E extends EntityDef,
  WritableAttributeDefinitions extends AttributeDefinitions = A.Cast<O.Writable<E['attributes'], A.Key, 'deep'>,
    AttributeDefinitions>,
  Attributes extends ParsedAttributes = ParseAttributes<WritableAttributeDefinitions,
    E['timestamps'],
    E['createdAlias'],
    E['modifiedAlias'],
    E['typeAlias']>,
  Item = InferItem<WritableAttributeDefinitions, Attributes>> = Pick<Item, Extract<Attributes['shown'], keyof Item>>

export type EntityItem<E extends EntityDef> = E['_typesOnly']['_entityItemOverlay'] extends Record<A.Key,
    any>
  ? E['_typesOnly']['_entityItemOverlay']
  : InferEntityItem<E>

type ExtractAttributes<E extends EntityDef> = E['_typesOnly']['_entityItemOverlay'] extends Record<A.Key,
    any>
  ? ParsedAttributes<keyof E['_typesOnly']['_entityItemOverlay']>
  : ParseAttributes<A.Cast<O.Writable<E['attributes'], A.Key, 'deep'>, AttributeDefinitions>,
    E['timestamps'],
    E['createdAlias'],
    E['modifiedAlias'],
    E['typeAlias']>

export type GetOptions<E extends EntityDef,
  A extends ParsedAttributes = ExtractAttributes<E>> = $GetOptions<A['shown'], boolean | undefined, boolean | undefined>

export type QueryOptions<E extends EntityDef,
  A extends ParsedAttributes = ExtractAttributes<E>> = EntityQueryOptions<A['shown'], A['all'], boolean | undefined, boolean | undefined>

export type PutOptions<E extends EntityDef,
  A extends ParsedAttributes = ExtractAttributes<E>> = $PutOptions<A['all'], PutOptionsReturnValues, boolean | undefined, boolean | undefined>

export type DeleteOptions<E extends EntityDef,
  A extends ParsedAttributes = ExtractAttributes<E>> = RawDeleteOptions<A['all'], DeleteOptionsReturnValues, boolean | undefined, boolean | undefined>

export type UpdateOptions<E extends EntityDef,
  A extends ParsedAttributes = ExtractAttributes<E>> = $UpdateOptions<A['all'], UpdateOptionsReturnValues, boolean | undefined, boolean | undefined>
