declare module "dynamodb-toolbox" {
  // Imports
  import {
    DocumentClient,
    GetItemOutput,
    PutItemOutput,
    DeleteItemOutput,
    UpdateItemOutput,
  } from "aws-sdk/clients/dynamodb";

  // Exports
  export class Table {
    constructor(options: TableConstructor);

    // Properties
    DocumentClient: DocumentClient;
    // getters and setters with different types is a no in TS
    // https://github.com/microsoft/TypeScript/issues/2521
    get entities(): any;
    set entities(entity: any);
    autoExecute: boolean;
    autoParse: boolean;

    // Methods
    attribute();
    parse();
    get();
    delete();
    put();
    update();
    query();
    scan();
    batchWrite();
    batchGet();
  }

  interface SchemaBase {
    entity: string;
    created: string;
    modified: string;
  }
  interface GetOuput<Schema> extends Omit<GetItemOutput, "Item"> {
    Item?: Schema & SchemaBase;
  }
  interface PutOutput<Schema> extends Omit<PutItemOutput, "Attributes"> {
    Attributes?: Schema & SchemaBase;
  }
  interface DeleteOutput<Schema> extends Omit<DeleteItemOutput, "Attributes"> {
    Attributes?: Schema & SchemaBase;
  }
  interface UpdateOutput<Schema> extends Omit<UpdateItemOutput, "Attributes"> {
    Attributes?: Schema & SchemaBase;
  }

  export class Entity<Schema extends { [key in keyof Schema]: SchemaType }> {
    constructor(options: EntityConstructor<Schema>);

    // Properties
    table: Table;
    readonly DocumentClient: DocumentClient;
    autoExecute: boolean;
    autoParse: boolean;
    readonly partitionKey: string;
    readonly sortKey: string;

    // Methods
    attribute(attribute: string): string;
    parse(input, include?);
    get(
      item: Schema,
      options?: {
        consistent?: boolean;
        capacity?: NoneOption | TotalOption | IndexesOption;
        attributes?: [] | {};
        autoExecute?: boolean;
        autoParse?: boolean;
      },
      parameters?
    ): Promise<GetOuput<Schema>>;
    delete(
      key: {},
      options?: {
        conditions?: [] | {};
        capacity?: NoneOption | TotalOption | IndexesOption;
        metrics?: NoneOption | SizeOption;
        returnValues?: NoneOption | AllOldOption;
        autoExecute?: boolean;
        autoParse?: boolean;
      },
      parameters?
    ): Promise<DeleteOutput<Schema>>;
    put(
      item: Schema,
      options?: {
        conditions?: [] | {};
        capacity?: NoneOption | TotalOption | IndexesOption; // Cannot use DynamoDB type as it's upper-case
        metrics?: NoneOption | SizeOption;
        returnValues?: NoneOption | AllOldOption;
        autoExecute?: boolean;
        autoParse?: boolean;
      },
      parameters?
    ): Promise<PutOutput<Schema>>;
    update(
      key: Schema & { $remove?: string[] }, // Complex part to type
      options?: {
        conditions?: [] | {};
        capacity?: NoneOption | TotalOption | IndexesOption;
        metrics?: NoneOption | SizeOption;
        returnValues?:
          | NoneOption
          | AllOldOption
          | UpdatedOldOption
          | AllNewOption
          | UpdatedNewOption;
        autoExecute?: boolean;
        autoParse?: boolean;
      },
      parameters?
    ): Promise<UpdateOutput<Schema>>;
    query(partionKey, options?, parameters?);
    scan(options?, parameters?);
  }

  // Table
  interface TableAttributes {
    [attribute: string]: AnyDynamoDBType;
  }
  interface Indexes {
    [index: string]: { partitionKey?: string; sortKey?: string };
  }
  interface TableConstructor {
    name: string;
    alias?: string;
    partitionKey: string;
    sortKey?: string;
    entityField?: boolean | string;
    attributes?: TableAttributes;
    indexes?: Indexes;
    autoExecute?: boolean;
    autoParse?: boolean;
    DocumentClient?: DocumentClient;
    entities?: {}; // improve - not documented
  }

  // Entity
  interface EntityAttributeConfiguration<Schema> {
    type?: AnyDynamoDBType;
    coerce?: boolean;
    default?: SchemaType | ((data: Schema) => SchemaType); // Value "type" or a function
    onUpdate?: boolean;
    hidden?: boolean;
    required?: boolean | AlwaysOption;
    alias?: string;
    map?: string;
    setType?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBinaryType;
    partitionKey?: boolean | string;
    sortKey?: boolean | string;
  }
  interface CompositeKeyConfiguration<Schema>
    extends EntityAttributeConfiguration<Schema> {
    type?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBooleanType;
    save?: boolean;
  }
  type CompositeKey<Schema> = [
    string,
    number,
    (
      | CompositeKeyConfiguration<Schema>
      | DynamoDBStringType
      | DynamoDBNumberType
      | DynamoDBBooleanType
    )?
  ];
  type EntityAttributes<Schema> = Record<
    keyof Schema,
    | AnyDynamoDBType
    | EntityAttributeConfiguration<Schema>
    | CompositeKey<Schema>
  >;
  interface EntityConstructor<Schema> {
    name: string;
    timestamps?: boolean;
    created?: string;
    modified?: string;
    createdAlias?: string;
    modifiedAlias?: string;
    typeAlias?: string;
    attributes: EntityAttributes<Schema>;
    autoExecute?: boolean;
    autoParse?: boolean;
    table?: Table;
  }

  // Constants

  // DynamoDB
  type DynamoDBStringType = "string";
  type DynamoDBBooleanType = "boolean";
  type DynamoDBNumberType = "number";
  type DynamoDBListType = "list";
  type DynamoDBMapType = "map";
  type DynamoDBBinaryType = "binary";
  type DynamoDBSetType = "set";
  type AnyDynamoDBType =
    | DynamoDBStringType
    | DynamoDBBooleanType
    | DynamoDBNumberType
    | DynamoDBListType
    | DynamoDBMapType
    | DynamoDBBinaryType
    | DynamoDBSetType;

  // Options
  type NoneOption = "none";
  type AllOldOption = "all_old";
  type AlwaysOption = "always";
  type UpdatedOldOption = "updated_old";
  type AllNewOption = "all_new";
  type UpdatedNewOption = "updated_new";
  type TotalOption = "total";
  type IndexesOption = "indexes";
  type SizeOption = "size";

  type SchemaType =
    | string
    | number
    | boolean
    | { [key: string]: SchemaType }
    | SchemaType[];
}
