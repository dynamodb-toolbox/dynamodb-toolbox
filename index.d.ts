import { DocumentClient } from "aws-sdk/clients/dynamodb";

type FieldTypes =
  | "string"
  | "boolean"
  | "number"
  | "list"
  | "map"
  | "binary"
  | "set";

type CoerceTypes = "string" | "boolean" | "number" | "list";

type SetTypes = "string" | "number" | "binary";

type CompositeKeyFieldConfiguration<T> = FieldDefinition<T> & {
  save?: boolean;
};

type CompositeKeyFieldDefinition<T> = [
  string,
  number,
  CompositeKeyFieldConfiguration<T>?
];

interface FieldDefinition<T> {
  type?: FieldTypes;
  coerce?: CoerceTypes;
  default?: (data: T) => any;
  onUpdate?: boolean;
  hidden?: boolean;
  required?: boolean | "always";
  alias?: keyof T;
  setType?: SetTypes;
}

type SchemaDefinition<T> = Record<
  string,
  FieldTypes | FieldDefinition<T> | CompositeKeyFieldDefinition<T>
>;

interface ModelDefinition<T> {
  table: string;
  partitionKey: string;
  sortKey?: string;
  model?: boolean;
  timestamps?: boolean;
  created?: string;
  modified?: string;
  schema: SchemaDefinition<T>;
}

type UpdateNumberOperations =
  | {
      $add: number;
    }
  | number;

type UpdateArrayOperations<T> =
  | {
      $add?: T[];
      $delete?: T[];
      $append?: T[];
      $prepend?: T[];
      $remove?: T[];
      [index: number]: T;
    }
  | T[];

type UpdateItemObjectField<T> =
  | {
      $set:
        | {
            [P in keyof T]?: UpdateItemField<T[P]>;
          }
        | {
            [index: string]: any;
          };
    }
  | T;

type UpdateItemField<T> = T extends Array<infer P>
  ? UpdateArrayOperations<P>
  : T extends object
  ? UpdateItemObjectField<T>
  : T extends number
  ? UpdateNumberOperations
  : T;

type UpdateItemWrapper<T> = { [P in keyof T]?: UpdateItemField<T[P]> };

export class Model<T> {
  constructor(modelName: string, modelDefinition: ModelDefinition<T>);

  put(
    item: T,
    custom?: Partial<DocumentClient.PutItemInput>
  ): DocumentClient.PutItemInput;

  update(
    item: UpdateItemWrapper<T>,
    custom?: Partial<DocumentClient.UpdateItemInput>
  ): DocumentClient.UpdateItemInput;

  get(
    key: Partial<T>,
    custom?: DocumentClient.GetItemInput
  ): DocumentClient.GetItemInput;

  delete(
    key: Partial<T>,
    custom?: DocumentClient.DeleteItemInput
  ): DocumentClient.DeleteItemInput;

  parse(response: DocumentClient.GetItemOutput): T | T[];
}
