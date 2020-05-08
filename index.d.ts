declare module "dynamodb-toolbox" {
  // Imports
  import {
    DocumentClient,
    GetItemOutput,
    PutItemOutput,
    DeleteItemOutput,
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
    [entity: string]: Entity<any>;

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
    type?: string;
    created?: string;
    modified?: string;
  }
  interface GetOuput<Schema> extends GetItemOutput {
    Item?: Schema & SchemaBase;
  }
  interface PutOutput<Schema> extends PutItemOutput {
    Attributes?: Schema & SchemaBase;
  }
  interface DeleteOutput<Schema> extends DeleteItemOutput {
    Attributes?: Schema & SchemaBase;
  }
  interface UpdateOutput<Schema> {}
  // Todo: Define UpdateOutput
  export class Entity<Schema> {
    constructor(options: EntityConstructor);

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
  interface EntityAttributesConfiguration {
    type?: AnyDynamoDBType;
    coerce?: boolean;
    default?: string | boolean | number | [] | {} | ((data: any) => any); // Value "type" or a function
    onUpdate?: boolean;
    hidden?: boolean;
    required?: boolean | AlwaysOption;
    alias?: string;
    map?: string;
    setType?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBinaryType;
    partitionKey?: boolean | string;
    sortKey?: boolean | string;
  }
  interface CompositeKeyConfiguration extends EntityAttributesConfiguration {
    type?: DynamoDBStringType | DynamoDBNumberType | DynamoDBBooleanType;
    save?: boolean;
  }
  type CompositeKey = [
    string,
    number,
    (
      | CompositeKeyConfiguration
      | DynamoDBStringType
      | DynamoDBNumberType
      | DynamoDBBooleanType
    )?
  ];
  interface EntityAttributes {
    [attribute: string]:
      | AnyDynamoDBType
      | EntityAttributesConfiguration
      | CompositeKey;
  }
  interface EntityConstructor {
    name: string;
    timestamps?: boolean;
    created?: string;
    modified?: string;
    createdAlias?: string;
    modifiedAlias?: string;
    typeAlias?: string;
    attributes: EntityAttributes;
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
  type AlwaysOption = "allways";
  type UpdatedOldOption = "updated_old";
  type AllNewOption = "all_new";
  type UpdatedNewOption = "updated_new";
  type TotalOption = "total";
  type IndexesOption = "indexes";
  type SizeOption = "size";
}
