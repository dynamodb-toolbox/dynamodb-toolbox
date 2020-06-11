// DynamoDB Toolbox TypeScript Definition
//
// Improvements:
// 1. Type Table methods parameters and returns
// 1bis. Improve sortKey typing and impact on gt, lt, etc.
// 2. Separate this file in several for better code understanding
// 3. Improve input/output to methods thanks to "Schema"
// 4. Improve complex "key" type from update and delete methods
// 5. Pass DynamoDB Toolbox to TypeScript :fear:

export declare namespace DynamoToolbox {
  // Imports
  import {
    DocumentClient,
    GetItemOutput,
    PutItemOutput,
    DeleteItemOutput,
    UpdateItemOutput,
  } from 'aws-sdk/clients/dynamodb'

  // Exports
  export class Table {
    constructor(options: TableConstructor)

    // Properties
    DocumentClient: DocumentClient
    // getters and setters with different types is a no in TS
    // https://github.com/microsoft/TypeScript/issues/2521
    get entities(): any
    set entities(entity: any)
    autoExecute: boolean
    autoParse: boolean

    // Methods
    attribute(...args: any) // Not documented
    parse(entity, input, include?)
    get(entity, key, options?, parameters?)
    delete(entity, key, options?, parameters?)
    put(entity, item, options?, parameters?)
    update(entity, key, options?, parameters?)
    query(
      partitionKey: string,
      options?: QueryInputOptions,
      parameters?
    ): Promise<any>
    scan(options?: ScanInputOptions, parameters?): Promise<any>
    batchWrite(items, options?, parameters?)
    batchGet(items, options?, parameters?)
  }

  interface ScanInputOptions {
    index?: string
    limit?: number
    consistent?: boolean
    capacity: string
    select: string
    filters?: {} | []
    attributes?: {} | []
    startKey?: {}
    segments?: number
    segment?: number
    entity?: string
    autoExecute?: boolean
    autoParse?: boolean
    execute?: boolean
    parse?: boolean
  }
  interface QueryInputOptions {
    index?: string
    limit?: number
    reverse?: boolean
    consistent?: boolean
    capacity?: string
    select?: string
    eq?: string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    between?: [string, string]
    beginsWith?: string
    filters?: {} | []
    attributes?: {} | []
    startKey?: {}
    entity?: string
    autoExecute?: boolean
    autoParse?: boolean
    parse?: boolean; // FIXME not documented
    execute?: boolean; // FIXME not documented
  }
  interface BachGetOptions extends FIXME {
  
  }
  interface SchemaBase {
    entity: string
    created: string
    modified: string
  }
  interface GetOuput<Schema> extends Omit<GetItemOutput, 'Item'> {
    Item?: Schema & SchemaBase
  }
  interface PutOutput<Schema> extends Omit<PutItemOutput, 'Attributes'> {
    Attributes?: Schema & SchemaBase
  }
  interface DeleteOutput<Schema> extends Omit<DeleteItemOutput, 'Attributes'> {
    Attributes?: Schema & SchemaBase
  }
  interface UpdateOutput<Schema> extends Omit<UpdateItemOutput, 'Attributes'> {
    Attributes?: Schema & SchemaBase
  }

  export class Entity<
    Schema extends { [key in keyof Schema]: SchemaType },
    HiddenKeys extends Omit<Partial<string>, keyof Schema>
  > {
    constructor(options: EntityConstructor<Schema, HiddenKeys>)

    // Properties
    table: Table
    readonly DocumentClient: DocumentClient
    autoExecute: boolean
    autoParse: boolean
    readonly partitionKey: string
    readonly sortKey: string

    // Methods
    attribute(attribute: string): string
    parse(input, include?)
    get(
      item: Schema,
      options?: {
        consistent?: boolean
        capacity?: NoneOption | TotalOption | IndexesOption
        attributes?: [] | {}
        autoExecute?: boolean
        autoParse?: boolean
      },
      parameters?
    ): Promise<GetOuput<Schema>>
    delete(
      key: {},
      options?: {
        conditions?: [] | {}
        capacity?: NoneOption | TotalOption | IndexesOption
        metrics?: NoneOption | SizeOption
        returnValues?: NoneOption | AllOldOption
        autoExecute?: boolean
        autoParse?: boolean
      },
      parameters?
    ): Promise<DeleteOutput<Schema>>
    put(
      item: Schema,
      options?: {
        conditions?: [] | {}
        capacity?: NoneOption | TotalOption | IndexesOption // Cannot use DynamoDB type as it's upper-case
        metrics?: NoneOption | SizeOption
        returnValues?: NoneOption | AllOldOption
        autoExecute?: boolean
        autoParse?: boolean
      },
      parameters?
    ): Promise<PutOutput<Schema>>
    update(
      key: Schema & { $remove?: string[] }, // Complex part to type
      options?: {
        conditions?: [] | {}
        capacity?: NoneOption | TotalOption | IndexesOption
        metrics?: NoneOption | SizeOption
        returnValues?:
          | NoneOption
          | AllOldOption
          | UpdatedOldOption
          | AllNewOption
          | UpdatedNewOption
        autoExecute?: boolean
        autoParse?: boolean
      },
      parameters?
    ): Promise<UpdateOutput<Schema>>
    query(
      partitionKey: string,
      options?: QueryInputOptions,
      parameters?
    ): Promise<any>
    scan(options?, parameters?)
  }

  // Table
  interface TableAttributes {
    [attribute: string]: AnyDynamoDBType
  }
  interface Indexes {
    [index: string]: { partitionKey?: string; sortKey?: string }
  }
  interface TableConstructor {
    name: string
    alias?: string
    partitionKey: string
    sortKey?: string
    entityField?: boolean | string
    attributes?: TableAttributes
    indexes?: Indexes
    autoExecute?: boolean
    autoParse?: boolean
    DocumentClient?: DocumentClient
    entities?: {} // improve - not documented
    removeNullAttributes?: boolean
  }

  // Entity
  interface EntityAttributeConfiguration<Schema> {
    type?: AnyDynamoDBType
    coerce?: boolean
    default?: SchemaType | ((data: Schema) => SchemaType) // Value "type" or a function
    onUpdate?: boolean
    required?: boolean | AlwaysOption
    alias?: string
    map?: string
    setType?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBinaryType
    partitionKey?: boolean | string
    sortKey?: boolean | string
  }

  interface VisibleEntityAttributeConfiguration<Schema>
    extends EntityAttributeConfiguration<Schema> {
    hidden?: false
  }

  interface HiddenEntityAttributeConfiguration<Schema>
    extends EntityAttributeConfiguration<Schema> {
    hidden: true
  }

  type CompositeKeyConfiguration<Schema, EAC> = EAC & {
    type?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBooleanType
    save?: boolean
  }

  type CompositeKey<Schema, EAC> = [
    string,
    number,
    (
      | CompositeKeyConfiguration<Schema, EAC>
      | DynamoDBStringType
      | DynamoDBNumberType
      | DynamoDBBooleanType
    )?
  ]

  type EntityAttributes<Schema, HiddenKeys extends Partial<string>> = Record<
    keyof Schema,
    AnyDynamoDBType | any
  > &
    Record<
      HiddenKeys,
      | AnyDynamoDBType
      | HiddenEntityAttributeConfiguration<Schema>
      | CompositeKey<Schema, HiddenEntityAttributeConfiguration<Schema>>
    >

  interface EntityConstructor<Schema, HiddenKeys extends Partial<string>> {
    name: string
    timestamps?: boolean
    created?: string
    modified?: string
    createdAlias?: string
    modifiedAlias?: string
    typeAlias?: string
    attributes: FIXME, //EntityAttributes<Schema, HiddenKeys>
    autoExecute?: boolean
    autoParse?: boolean
    table?: Table
  }

  // Constants

  // DynamoDB
  type DynamoDBStringType = 'string'
  type DynamoDBBooleanType = 'boolean'
  type DynamoDBNumberType = 'number'
  type DynamoDBListType = 'list'
  type DynamoDBMapType = 'map'
  type DynamoDBBinaryType = 'binary'
  type DynamoDBSetType = 'set'
  type AnyDynamoDBType =
    | DynamoDBStringType
    | DynamoDBBooleanType
    | DynamoDBNumberType
    | DynamoDBListType
    | DynamoDBMapType
    | DynamoDBBinaryType
    | DynamoDBSetType

  // Options
  type NoneOption = 'none'
  type AllOldOption = 'all_old'
  type AlwaysOption = 'always'
  type UpdatedOldOption = 'updated_old'
  type AllNewOption = 'all_new'
  type UpdatedNewOption = 'updated_new'
  type TotalOption = 'total'
  type IndexesOption = 'indexes'
  type SizeOption = 'size'

  type SchemaType =
    | string
    | number
    | boolean
    | { [key: string]: SchemaType }
    | SchemaType[]
  
  type FIXME = any
}
