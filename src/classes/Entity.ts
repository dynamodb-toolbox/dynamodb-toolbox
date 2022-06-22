/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// Import classes
import Table, {
  DynamoDBSetTypes,
  DynamoDBTypes,
  queryOptions,
  scanOptions,
} from "./Table";

// Import libraries & types
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import parseEntity from "../lib/parseEntity";
import validateTypes from "../lib/validateTypes";
import normalizeData from "../lib/normalizeData";
import formatItem from "../lib/formatItem";
import getKey from "../lib/getKey";
import parseConditions, { FilterExpressions } from "../lib/expressionBuilder";
import parseProjections, {
  ProjectionAttributes,
} from "../lib/projectionBuilder";

// Import error handlers
import { error, transformAttr, isEmpty } from "../lib/utils";
import { Document } from "aws-sdk/clients/textract";

export type SchemaType =
  | string
  | number
  | boolean
  | null
  | { [key: string]: SchemaType }
  | SchemaType[];

export interface EntityConstructor {
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
  typeHidden?: boolean;
}

export interface EntityAttributeConfig {
  type?: DynamoDBTypes;
  default?: any | ((data: object) => any);
  dependsOn?: string | string[];
  transform?: (value: any, data: {}) => any;
  inverseTransform?: (value: any, data: {}) => any;
  coerce?: boolean;
  save?: boolean;
  onUpdate?: boolean;
  hidden?: boolean;
  required?: boolean | "always";
  alias?: string;
  map?: string;
  setType?: DynamoDBSetTypes;
  partitionKey?: boolean | string | (string | boolean)[];
  delimiter?: string;
  sortKey?: boolean | string;
  prefix?: string;
  suffix?: string;
}

export type EntityCompositeAttributes = [
  string,
  number,
  (string | EntityAttributeConfig)?
];

export interface EntityAttributes {
  [attr: string]:
    | DynamoDBTypes
    | EntityAttributeConfig
    | EntityCompositeAttributes;
}

export type EntityAttributeConfiguration = EntityAttributeConfig & {
  link?: string;
};

interface getOptions {
  consistent?: boolean;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  attributes?: ProjectionAttributes;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
}

interface deleteOptions {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
}

interface transactionOptions {
  conditions?: FilterExpressions;
  returnValues?: DocumentClient.ReturnValuesOnConditionCheckFailure;
}

interface putOptions {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
}

interface updateOptions {
  conditions?: FilterExpressions;
  capacity?: DocumentClient.ReturnConsumedCapacity;
  metrics?: DocumentClient.ReturnItemCollectionMetrics;
  returnValues?: DocumentClient.ReturnValue;
  include?: string[];
  execute?: boolean;
  parse?: boolean;
}

interface updateCustomParameters {
  SET?: string[];
  REMOVE?: string[];
  ADD?: string[];
  DELETE?: string[];
}

type updateCustomParams = updateCustomParameters &
  Partial<DocumentClient.UpdateItemInput>;

// Declare Entity class
class Entity<Schema extends { [key in keyof Schema]: SchemaType }> {
  private _table?: Table;
  private _execute?: boolean;
  private _parse?: boolean;
  public name!: string;
  public schema: any;
  public _etAlias!: string;
  public defaults: any;
  public linked: any;
  public required: any;
  public typeHidden!: boolean;

  // Declare constructor (entity config)
  constructor(entity: EntityConstructor) {
    // Sanity check the entity object
    if (typeof entity !== "object" || Array.isArray(entity))
      error("Please provide a valid entity definition");

    // Parse the entity and merge into this
    Object.assign(this, parseEntity(entity));
  } // end construcor

  // Set the Entity's Table
  set table(table: Table) {
    // If a Table
    if (table.Table && table.Table.attributes) {
      // If this Entity already has a Table, throw an error
      if (this._table) {
        error(`This entity is already assigned a Table (${this._table.name})`);
        // Else if the Entity doesn't exist in the Table, add it
      } else if (!table.entities.includes(this.name)) {
        table.addEntity(this);
      }

      // Set the Entity's table
      this._table = table;

      // If an entity tracking field is enabled, add the attributes, alias and the default
      if (table.Table.entityField) {
        this.schema.attributes[table.Table.entityField] = {
          type: "string",
          hidden: this.typeHidden,
          alias: this._etAlias,
          default: this.name,
        } as EntityAttributeConfig;
        this.defaults[table.Table.entityField] = this.name;
        this.schema.attributes[this._etAlias] = {
          type: "string",
          map: table.Table.entityField,
          default: this.name,
        } as EntityAttributeConfig;
        this.defaults[this._etAlias] = this.name;
      } // end if entity tracking

      // Throw an error if not a valid Table
    } else {
      error("Invalid Table");
    }
  } // end set table

  // Returns the Entity's Table
  get table() {
    if (this._table) {
      return this._table;
    } else {
      return error(
        `The '${this.name}' entity must be attached to a Table to perform this operation`
      );
    }
  }

  // Return reference to the DocumentClient
  get DocumentClient() {
    if (this.table.DocumentClient) {
      return this.table.DocumentClient;
    } else {
      return error("DocumentClient required for this operation");
    }
  }

  // Sets the auto execute mode (default to true)
  set autoExecute(val) {
    this._execute = typeof val === "boolean" ? val : undefined;
  }

  // Gets the current auto execute mode
  get autoExecute() {
    return typeof this._execute === "boolean"
      ? this._execute
      : typeof this.table.autoExecute === "boolean"
      ? this.table.autoExecute
      : true;
  }

  // Sets the auto parse mode (default to true)
  set autoParse(val) {
    this._parse = typeof val === "boolean" ? val : undefined;
  }

  // Gets the current auto execute mode
  get autoParse() {
    return typeof this._parse === "boolean"
      ? this._parse
      : typeof this.table.autoParse === "boolean"
      ? this.table.autoParse
      : true;
  }

  // Primary key getters
  get partitionKey() {
    return this.schema.keys.partitionKey
      ? this.attribute(this.schema.keys.partitionKey)
      : error(`No partitionKey defined`);
  }
  get sortKey() {
    return this.schema.keys.sortKey
      ? this.attribute(this.schema.keys.sortKey)
      : null;
  }

  // Get mapped attribute name
  attribute(attr: string) {
    return this.schema.attributes[attr] && this.schema.attributes[attr].map
      ? this.schema.attributes[attr].map
      : this.schema.attributes[attr]
      ? attr
      : error(`'${attr}' does not exist or is an invalid alias`);
  } // end attribute

  // Parses the item
  parse(input: any, include: string[] = []) {
    // TODO: 'include' needs to handle nested maps?

    // Convert include to roots and de-alias
    include = include.map((attr) => {
      const _attr = attr.split(".")[0].split("[")[0];
      return (
        (this.schema.attributes[_attr] && this.schema.attributes[_attr].map) ||
        _attr
      );
    });

    // Load the schema
    const { schema, linked } = this;

    // Assume standard response from DynamoDB
    const data = input.Item || input.Items || input;

    if (Array.isArray(data)) {
      return data.map((item) =>
        formatItem(this.DocumentClient)(
          schema.attributes,
          linked,
          item,
          include
        )
      );
    } else {
      return formatItem(this.DocumentClient)(
        schema.attributes,
        linked,
        data,
        include
      );
    }
  } // end parse

  /**
   * Generate GET parameters and execute operation
   * @param {object} item - The keys from item you wish to get.
   * @param {object} [options] - Additional get options.
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
   */
  async get(
    item: Partial<Schema> = {},
    options: getOptions = {},
    params: Partial<DocumentClient.GetItemInput> = {}
  ) {
    // Generate the payload
    const payload = this.getParams(item, options, params);

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.get(payload).promise();

      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Item
            ? {
                Item: this.parse(
                  result.Item,
                  Array.isArray(options.include) ? options.include : []
                ),
              }
            : null
        );
      } else {
        return result;
      }
    } else {
      return payload;
    } // end if-else
  } // end get

  /**
   * Generate parameters for GET batch operation
   * @param {object} item - The keys from item you wish to get.
   */
  getBatch(item: Partial<Schema> = {}) {
    return {
      Table: this.table,
      Key: this.getParams(item).Key,
    };
  }

  /**
   * Generate parameters for GET transaction operation
   * @param {object} item - The keys from item you wish to get.
   * @param {object} [options] - Additional get options
   *
   * Creates a Delete object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Get.html
   */
  getTransaction(
    item: Partial<Schema> = {},
    options: { attributes?: ProjectionAttributes } = {}
  ): { Entity: Entity<Schema> } & DocumentClient.TransactGetItem {
    // Destructure options to check for extraneous arguments
    const {
      attributes, // ProjectionExpression
      ...args
    } = options;

    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
      error(`Invalid get transaction options: ${Object.keys(args).join(", ")}`);

    // Generate the get parameters
    let payload = this.getParams(item, options);

    // Return in transaction format
    return {
      Entity: this,
      Get: payload,
    };
  }

  /**
   * Generate GET parameters
   * @param {object} item - The keys from item you wish to get.
   * @param {object} [options] - Additional get options.
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the get request.
   */
  getParams(
    item: Partial<Schema> = {},
    options: getOptions = {},
    params: Partial<DocumentClient.GetItemInput> = {}
  ) {
    // Extract schema and merge defaults
    const { schema, defaults, linked, _table } = this;
    const data = normalizeData(this.DocumentClient)(
      schema.attributes,
      linked,
      Object.assign({}, defaults, item),
      true
    );

    const {
      consistent, // ConsistentRead (boolean)
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      attributes, // Projections
      ..._args
    } = options;

    // Remove other valid options from options
    const args = Object.keys(_args).filter(
      (x) => !["execute", "parse"].includes(x)
    );

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid get options: ${args.join(", ")}`);

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== "boolean")
      error(`'consistent' requires a boolean`);

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== "string" ||
        !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))
    )
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);

    let ExpressionAttributeNames; // init ExpressionAttributeNames
    let ProjectionExpression; // init ProjectionExpression

    // If projections
    if (attributes) {
      const { names, projections } = parseProjections(
        attributes,
        this.table,
        this.name
      );

      if (Object.keys(names).length > 0) {
        // Merge names and add projection expression
        ExpressionAttributeNames = names;
        ProjectionExpression = projections;
      } // end if names
    } // end if projections

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table!.name,
        Key: getKey(this.DocumentClient)(
          data,
          schema.attributes,
          schema.keys.partitionKey,
          schema.keys.sortKey
        ),
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      ProjectionExpression ? { ProjectionExpression } : null,
      consistent ? { ConsistentRead: consistent } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      typeof params === "object" ? params : {}
    );

    return payload;
  } // end getParams

  /**
   * Generate DELETE parameters and execute operation
   * @param {object} item - The keys from item you wish to delete.
   * @param {object} [options] - Additional delete options.
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
   */
  async delete(
    item: Partial<Schema> = {},
    options: deleteOptions = {},
    params: Partial<DocumentClient.DeleteItemInput> = {}
  ) {
    const payload = this.deleteParams(item, options, params);

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.delete(payload).promise();
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes
            ? {
                Attributes: this.parse(
                  result.Attributes,
                  Array.isArray(options.include) ? options.include : []
                ),
              }
            : null
        );
      } else {
        return result;
      }
    } else {
      return payload;
    } // end if-else
  } // end delete

  /**
   * Generate parameters for DELETE batch operation
   * @param {object} item - The keys from item you wish to delete.
   *
   * Only Key is supported (e.g. no conditions) https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
   */
  deleteBatch(item: Partial<Schema> = {}): {
    [key: string]: DocumentClient.WriteRequest;
  } {
    const payload = this.deleteParams(item);
    return { [payload.TableName]: { DeleteRequest: { Key: payload.Key } } };
  }

  /**
   * Generate parameters for DELETE transaction operation
   * @param {object} item - The keys from item you wish to delete.
   * @param {object} [options] - Additional delete options
   *
   * Creates a Delete object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Delete.html
   */
  deleteTransaction(
    item: Partial<Schema> = {},
    options: transactionOptions = {}
  ): { Delete: DocumentClient.Delete } {
    // Destructure options to check for extraneous arguments
    const {
      conditions, // ConditionExpression
      returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
      ...args
    } = options;

    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
      error(
        `Invalid delete transaction options: ${Object.keys(args).join(", ")}`
      );

    // Generate the delete parameters
    let payload = this.deleteParams(item, options);

    // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
    if ("ReturnValues" in payload) {
      let { ReturnValues, ..._payload } = payload;
      payload = Object.assign({}, _payload, {
        ReturnValuesOnConditionCheckFailure: ReturnValues,
      });
    }

    // Return in transaction format
    return { Delete: payload };
  }

  /**
   * Generate DELETE parameters
   * @param {object} item - The keys from item you wish to delete.
   * @param {object} [options] - Additional delete options.
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the delete request.
   */
  deleteParams(
    item: Partial<Schema> = {},
    options: deleteOptions = {},
    params: Partial<DocumentClient.DeleteItemInput> = {}
  ) {
    // Extract schema and merge defaults
    const { schema, defaults, linked, _table } = this;
    const data = normalizeData(this.DocumentClient)(
      schema.attributes,
      linked,
      Object.assign({}, defaults, item),
      true
    );

    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old)
      ..._args
    } = options;

    // Remove other valid options from options
    const args = Object.keys(_args).filter(
      (x) => !["execute", "parse"].includes(x)
    );

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid delete options: ${args.join(", ")}`);

    // Verify metrics
    if (
      metrics !== undefined &&
      (typeof metrics !== "string" ||
        !["NONE", "SIZE"].includes(metrics.toUpperCase()))
    )
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`);

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== "string" ||
        !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))
    )
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);

    // Verify returnValues
    if (
      returnValues !== undefined &&
      (typeof returnValues !== "string" ||
        !["NONE", "ALL_OLD"].includes(returnValues.toUpperCase()))
    )
      error(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`);

    let ExpressionAttributeNames; // init ExpressionAttributeNames
    let ExpressionAttributeValues; // init ExpressionAttributeValues
    let ConditionExpression; // init ConditionExpression

    // If conditions
    if (conditions) {
      // Parse the conditions
      const { expression, names, values } = parseConditions(
        conditions,
        this.table,
        this.name
      );

      if (Object.keys(names).length > 0) {
        // TODO: alias attribute field names
        // Merge names and values and add condition expression
        ExpressionAttributeNames = names;
        ExpressionAttributeValues = values;
        ConditionExpression = expression;
      } // end if names
    } // end if filters

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table!.name,
        Key: getKey(this.DocumentClient)(
          data,
          schema.attributes,
          schema.keys.partitionKey,
          schema.keys.sortKey
        ),
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      !isEmpty(ExpressionAttributeValues)
        ? { ExpressionAttributeValues }
        : null,
      ConditionExpression ? { ConditionExpression } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null,
      typeof params === "object" ? params : {}
    );

    return payload;
  } // end deleteParams

  /**
   * Generate UPDATE parameters and execute operations
   * @param {object} item - The keys from item you wish to update.
   * @param {object} [options] - Additional update options.
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the update request.
   */
  async update(
    item: Partial<Schema> = {},
    options: updateOptions = {},
    params: Partial<DocumentClient.UpdateItemInput> = {}
  ) {
    // Generate the payload
    const payload = this.updateParams(item, options, params);

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.update(payload).promise();
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes
            ? {
                Attributes: this.parse(
                  result.Attributes,
                  Array.isArray(options.include) ? options.include : []
                ),
              }
            : null
        );
      } else {
        return result;
      }
    } else {
      return payload;
    } // end if-else
  } // end delete

  /**
   * Generate parameters for UPDATE transaction operation
   * @param {object} item - The item you wish to update.
   * @param {object} [options] - Additional update options
   *
   * Creates an Update object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Update.html
   */
  updateTransaction(
    item: Partial<Schema> = {},
    options: transactionOptions = {}
  ): { Update: DocumentClient.Update } {
    // Destructure options to check for extraneous arguments
    const {
      conditions, // ConditionExpression
      returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
      ...args
    } = options;

    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
      error(
        `Invalid update transaction options: ${Object.keys(args).join(", ")}`
      );

    // Generate the update parameters
    let payload = this.updateParams(item, options);

    // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
    if ("ReturnValues" in payload) {
      let { ReturnValues, ..._payload } = payload;
      payload = Object.assign({}, _payload, {
        ReturnValuesOnConditionCheckFailure: ReturnValues,
      });
    }

    // Return in transaction format (cast as Update since UpdateExpression can't be undefined)
    return { Update: payload as DocumentClient.Update };
  }

  // Generate UPDATE Parameters
  updateParams(
    item: Partial<Schema> = {},
    options: updateOptions = {},
    {
      SET = [],
      REMOVE = [],
      ADD = [],
      DELETE = [],
      ExpressionAttributeNames = {},
      ExpressionAttributeValues = {},
      ...params
    }: updateCustomParams = {}
  ): DocumentClient.UpdateItemInput {
    // Validate operation types
    if (!Array.isArray(SET)) error("SET must be an array");
    if (!Array.isArray(REMOVE)) error("REMOVE must be an array");
    if (!Array.isArray(ADD)) error("ADD must be an array");
    if (!Array.isArray(DELETE)) error("DELETE must be an array");

    // Validate attribute names and values
    if (
      typeof ExpressionAttributeNames !== "object" ||
      Array.isArray(ExpressionAttributeNames)
    )
      error("ExpressionAttributeNames must be an object");
    if (
      typeof ExpressionAttributeValues !== "object" ||
      Array.isArray(ExpressionAttributeValues)
    )
      error("ExpressionAttributeValues must be an object");
    // if (ConditionExpression && typeof ConditionExpression !== 'string')
    //     error(`ConditionExpression must be a string`)

    // Extract schema and defaults
    const { schema, defaults, required, linked, _table } = this;

    // Initialize validateType with the DocumentClient
    const validateType = validateTypes(this.DocumentClient);

    // Merge defaults
    const data = normalizeData(this.DocumentClient)(
      schema.attributes,
      linked,
      Object.assign({}, defaults, item)
    );

    // Extract valid options
    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
      ..._args
    } = options;

    // Remove other valid options from options
    const args = Object.keys(_args).filter(
      (x) => !["execute", "parse"].includes(x)
    );

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid update options: ${args.join(", ")}`);

    // Verify metrics
    if (
      metrics !== undefined &&
      (typeof metrics !== "string" ||
        !["NONE", "SIZE"].includes(metrics.toUpperCase()))
    )
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`);

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== "string" ||
        !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))
    )
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);

    // Verify returnValues
    if (
      returnValues !== undefined &&
      (typeof returnValues !== "string" ||
        !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(
          returnValues.toUpperCase()
        ))
    )
      error(
        `'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`
      );

    let ConditionExpression; // init ConditionExpression

    // If conditions
    if (conditions) {
      // Parse the conditions
      const { expression, names, values } = parseConditions(
        conditions,
        this.table,
        this.name
      );

      if (Object.keys(names).length > 0) {
        // TODO: alias attribute field names
        // Add names, values and condition expression
        ExpressionAttributeNames = Object.assign(
          ExpressionAttributeNames,
          names
        );
        ExpressionAttributeValues = Object.assign(
          ExpressionAttributeValues,
          values
        );
        ConditionExpression = expression;
      } // end if names
    } // end if conditions

    // Check for required fields
    Object.keys(required).forEach(
      (field) =>
        required[field] &&
        (data[field] === undefined || data[field] === null) &&
        error(
          `'${field}${
            this.schema.attributes[field].alias
              ? `/${this.schema.attributes[field].alias}`
              : ""
          }' is a required field`
        )
    ); // end required field check

    // Get partition and sort keys
    const Key = getKey(this.DocumentClient)(
      data,
      schema.attributes,
      schema.keys.partitionKey,
      schema.keys.sortKey
    );

    // Init names and values
    const names: { [key: string]: any } = {};
    const values: { [key: string]: any } = {};

    // Loop through valid fields and add appropriate action
    Object.keys(data).forEach((field) => {
      const mapping = schema.attributes[field];

      // Remove attributes
      if (field === "$remove") {
        const attrs = Array.isArray(data[field]) ? data[field] : [data[field]];
        for (const i in attrs) {
          // Verify attribute
          if (!schema.attributes[attrs[i]])
            error(
              `'${attrs[i]}' is not a valid attribute and cannot be removed`
            );
          // Verify attribute is not a pk/sk
          if (
            schema.attributes[attrs[i]].partitionKey === true ||
            schema.attributes[attrs[i]].sortKey === true
          )
            error(
              `'${attrs[i]}' is the ${
                schema.attributes[attrs[i]].partitionKey === true
                  ? "partitionKey"
                  : "sortKey"
              } and cannot be removed`
            );
          // Grab the attribute name and add to REMOVE and names
          const attr = schema.attributes[attrs[i]].map || attrs[i];
          REMOVE.push(`#${attr}`);
          names[`#${attr}`] = attr;
        } // end for
      } else if (
        this._table!._removeNulls === true &&
        (data[field] === null || String(data[field]).trim() === "") &&
        (!mapping.link || mapping.save)
      ) {
        REMOVE.push(`#${field}`);
        names[`#${field}`] = field;
      } else if (
        // !mapping.partitionKey
        // && !mapping.sortKey
        mapping.partitionKey !== true &&
        mapping.sortKey !== true &&
        (mapping.save === undefined || mapping.save === true) &&
        (!mapping.link || (mapping.link && mapping.save === true))
      ) {
        // If a number or a set and adding
        if (
          ["number", "set"].includes(mapping.type) &&
          data[field]?.$add !== undefined &&
          data[field]?.$add !== null
        ) {
          ADD.push(`#${field} :${field}`);
          values[`:${field}`] = validateType(mapping, field, data[field].$add);
          // Add field to names
          names[`#${field}`] = field;
          // if a set and deleting items
        } else if (mapping.type === "set" && data[field]?.$delete) {
          DELETE.push(`#${field} :${field}`);
          values[`:${field}`] = validateType(
            mapping,
            field,
            data[field].$delete
          );
          // Add field to names
          names[`#${field}`] = field;
          // if a list and removing items by index
        } else if (
          mapping.type === "list" &&
          Array.isArray(data[field]?.$remove)
        ) {
          data[field].$remove.forEach((i: number) => {
            if (typeof i !== "number")
              error(
                `Remove array for '${field}' must only contain numeric indexes`
              );
            REMOVE.push(`#${field}[${i}]`);
          });
          // Add field to names
          names[`#${field}`] = field;
          // if list and appending or prepending
        } else if (
          mapping.type === "list" &&
          (data[field]?.$append || data[field]?.$prepend)
        ) {
          if (data[field].$append) {
            SET.push(`#${field} = list_append(#${field},:${field})`);
            values[`:${field}`] = validateType(
              mapping,
              field,
              data[field].$append
            );
          } else {
            SET.push(`#${field} = list_append(:${field},#${field})`);
            values[`:${field}`] = validateType(
              mapping,
              field,
              data[field].$prepend
            );
          }
          // Add field to names
          names[`#${field}`] = field;
          // if a list and updating by index
        } else if (
          mapping.type === "list" &&
          !Array.isArray(data[field]) &&
          typeof data[field] === "object"
        ) {
          Object.keys(data[field]).forEach((i) => {
            if (String(parseInt(i)) !== i)
              error(
                `Properties must be numeric to update specific list items in '${field}'`
              );
            SET.push(`#${field}[${i}] = :${field}_${i}`);
            values[`:${field}_${i}`] = data[field][i];
          });
          // Add field to names
          names[`#${field}`] = field;
          // if a map and updating by nested attribute/index
        } else if (mapping.type === "map" && data[field]?.$set) {
          Object.keys(data[field].$set).forEach((f) => {
            // TODO: handle null values to remove

            let props = f.split(".");
            let acc = [`#${field}`];
            props.forEach((prop, i) => {
              let id = `${field}_${props.slice(0, i + 1).join("_")}`;
              // Add names and values
              names[`#${id.replace(/\[(\d+)\]/, "")}`] = prop.replace(
                /\[(\d+)\]/,
                ""
              );
              // if the final prop, add the SET and values
              if (i === props.length - 1) {
                let input = data[field].$set[f];
                let path = `${acc.join(".")}.#${id}`;
                let value = `${id.replace(/\[(\d+)\]/, "_$1")}`;

                if (input === undefined) {
                  REMOVE.push(`${path}`);
                } else if (input.$add) {
                  ADD.push(`${path} :${value}`);
                  values[`:${value}`] = input.$add;
                } else if (input.$append) {
                  SET.push(`${path} = list_append(${path},:${value})`);
                  values[`:${value}`] = input.$append;
                } else if (input.$prepend) {
                  SET.push(`${path} = list_append(:${value},${path})`);
                  values[`:${value}`] = input.$prepend;
                } else if (input.$remove) {
                  // console.log('REMOVE:',input.$remove);
                  input.$remove.forEach((i: number) => {
                    if (typeof i !== "number")
                      error(
                        `Remove array for '${field}' must only contain numeric indexes`
                      );
                    REMOVE.push(`${path}[${i}]`);
                  });
                } else {
                  SET.push(`${path} = :${value}`);
                  values[`:${value}`] = input;
                }

                if (input.$set) {
                  Object.keys(input.$set).forEach((i) => {
                    if (String(parseInt(i)) !== i)
                      error(
                        `Properties must be numeric to update specific list items in '${field}'`
                      );
                    SET.push(`${path}[${i}] = :${value}_${i}`);
                    values[`:${value}_${i}`] = input.$set[i];
                  });
                }
              } else {
                acc.push(`#${id.replace(/\[(\d+)\]/, "")}`);
              }
            });
          });
          // Add field to names
          names[`#${field}`] = field;
          // else add to SET
        } else {
          let value = transformAttr(
            mapping,
            validateType(mapping, field, data[field]),
            data
          );

          // It's possible that defaults can purposely return undefined values
          // if (hasValue(value)) {
          if (value !== undefined) {
            // Push the update to SET
            SET.push(
              mapping.default !== undefined &&
                // @ts-ignore
                item[field] === undefined &&
                !mapping.onUpdate
                ? `#${field} = if_not_exists(#${field},:${field})`
                : `#${field} = :${field}`
            );
            // Add names and values
            names[`#${field}`] = field;
            values[`:${field}`] = value;
          }
        }
      } // end if undefined
    });

    // Create the update expression
    const expression = (
      (SET.length > 0 ? "SET " + SET.join(", ") : "") +
      (REMOVE.length > 0 ? " REMOVE " + REMOVE.join(", ") : "") +
      (ADD.length > 0 ? " ADD " + ADD.join(", ") : "") +
      (DELETE.length > 0 ? " DELETE " + DELETE.join(", ") : "")
    ).trim();

    // Merge attribute values
    ExpressionAttributeValues = Object.assign(
      values,
      ExpressionAttributeValues
    );

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table!.name,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(
          names,
          ExpressionAttributeNames
        ),
      },
      typeof params === "object" ? params : {},
      !isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {},
      ConditionExpression ? { ConditionExpression } : {},
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null
    ); // end assign

    return payload;

    // TODO: Check why primary/secondary GSIs are using if_not_exists
  } // end updateParams

  // PUT - put item
  async put(
    item: Partial<Schema> = {},
    options: putOptions = {},
    params: Partial<DocumentClient.PutItemInput> = {}
  ) {
    // Generate the payload
    const payload = this.putParams(item, options, params);

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.put(payload).promise();
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes
            ? {
                Attributes: this.parse(
                  result.Attributes,
                  Array.isArray(options.include) ? options.include : []
                ),
              }
            : null
        );
      } else {
        return result;
      }
    } else {
      return payload;
    } // end-if
  } // end put

  /**
   * Generate parameters for PUT batch operation
   * @param {object} item - The item you wish to put.
   *
   * Only Item is supported (e.g. no conditions) https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
   */
  putBatch(item: Partial<Schema> = {}): {
    [key: string]: DocumentClient.WriteRequest;
  } {
    const payload = this.putParams(item);
    return { [payload.TableName]: { PutRequest: { Item: payload.Item } } };
  }

  /**
   * Generate parameters for PUT transaction operation
   * @param {object} item - The item you wish to put.
   * @param {object} [options] - Additional put options
   *
   * Creates a Put object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Put.html
   */
  putTransaction(
    item: Partial<Schema> = {},
    options: transactionOptions = {}
  ): { Put: DocumentClient.Put } {
    // Destructure options to check for extraneous arguments
    const {
      conditions, // ConditionExpression
      returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
      ...args
    } = options;

    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
      error(`Invalid put transaction options: ${Object.keys(args).join(", ")}`);

    // Generate the put parameters
    let payload = this.putParams(item, options);

    // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
    if ("ReturnValues" in payload) {
      let { ReturnValues, ..._payload } = payload;
      payload = Object.assign({}, _payload, {
        ReturnValuesOnConditionCheckFailure: ReturnValues,
      });
    }

    // Return in transaction format
    return { Put: payload };
  }

  // Generate PUT Parameters
  putParams(
    item: Partial<Schema> = {},
    options: putOptions = {},
    params: Partial<DocumentClient.PutItemInput> = {}
  ) {
    // Extract schema and defaults
    const { schema, defaults, required, linked, _table } = this;

    // Initialize validateType with the DocumentClient
    const validateType = validateTypes(this.DocumentClient);

    // Merge defaults
    const data = normalizeData(this.DocumentClient)(
      schema.attributes,
      linked,
      Object.assign({}, defaults, item)
    );

    // console.log(data);

    // Extract valid options
    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
      ..._args
    } = options;

    // Remove other valid options from options
    const args = Object.keys(_args).filter(
      (x) => !["execute", "parse"].includes(x)
    );

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid put options: ${args.join(", ")}`);

    // Verify metrics
    if (
      metrics !== undefined &&
      (typeof metrics !== "string" ||
        !["NONE", "SIZE"].includes(metrics.toUpperCase()))
    )
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`);

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== "string" ||
        !["NONE", "TOTAL", "INDEXES"].includes(capacity.toUpperCase()))
    )
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`);

    // Verify returnValues
    // TODO: Check this, conflicts with dynalite
    if (
      returnValues !== undefined &&
      (typeof returnValues !== "string" ||
        !["NONE", "ALL_OLD", "UPDATED_OLD", "ALL_NEW", "UPDATED_NEW"].includes(
          returnValues.toUpperCase()
        ))
    )
      error(
        `'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`
      );

    let ExpressionAttributeNames; // init ExpressionAttributeNames
    let ExpressionAttributeValues; // init ExpressionAttributeValues
    let ConditionExpression; // init ConditionExpression

    // If conditions
    if (conditions) {
      // Parse the conditions
      const { expression, names, values } = parseConditions(
        conditions,
        this.table,
        this.name
      );

      if (Object.keys(names).length > 0) {
        // TODO: alias attribute field names
        // Add names, values and condition expression
        ExpressionAttributeNames = names;
        ExpressionAttributeValues = values;
        ConditionExpression = expression;
      } // end if names
    } // end if filters

    // Check for required fields
    Object.keys(required).forEach(
      (field) =>
        required[field] !== undefined &&
        (data[field] === undefined || data[field] === null) &&
        error(
          `'${field}${
            this.schema.attributes[field].alias
              ? `/${this.schema.attributes[field].alias}`
              : ""
          }' is a required field`
        )
    ); // end required field check

    // Checks for partition and sort keys
    getKey(this.DocumentClient)(
      data,
      schema.attributes,
      schema.keys.partitionKey,
      schema.keys.sortKey
    );

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table!.name,
        // Loop through valid fields and add appropriate action
        Item: Object.keys(data).reduce((acc, field) => {
          let mapping = schema.attributes[field];
          let value = validateType(mapping, field, data[field]);
          return value !== undefined &&
            (mapping.save === undefined || mapping.save === true) &&
            (!mapping.link || (mapping.link && mapping.save === true)) &&
            (!_table!._removeNulls || (_table!._removeNulls && value !== null))
            ? Object.assign(acc, {
                [field]: transformAttr(mapping, value, data),
              })
            : acc;
        }, {}),
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      !isEmpty(ExpressionAttributeValues)
        ? { ExpressionAttributeValues }
        : null,
      ConditionExpression ? { ConditionExpression } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null,
      typeof params === "object" ? params : {}
    );

    return payload;
  } // end putParams

  /**
   * Generate parameters for ConditionCheck transaction operation
   * @param {object} item - The keys from item you wish to check.
   * @param {object} [options] - Additional condition check options
   *
   * Creates a ConditionCheck object: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ConditionCheck.html
   */
  conditionCheck(
    item: Partial<Schema> = {},
    options: transactionOptions = {}
  ): { ConditionCheck: DocumentClient.ConditionCheck } {
    // Destructure options to check for extraneous arguments
    const {
      conditions, // ConditionExpression
      returnValues, // ReturnValuesOnConditionCheckFailure (none, all_old)
      ...args
    } = options;

    // Error on extraneous arguments
    if (Object.keys(args).length > 0)
      error(`Invalid conditionCheck options: ${Object.keys(args).join(", ")}`);

    // Generate the condition parameters (same params as delete)
    let payload = this.deleteParams(item, options);

    // Error on missing conditions
    if (!("ConditionExpression" in payload))
      error(`'conditions' are required in a conditionCheck`);

    // If ReturnValues exists, replace with ReturnValuesOnConditionCheckFailure
    if ("ReturnValues" in payload) {
      let { ReturnValues, ..._payload } = payload;
      payload = Object.assign({}, _payload, {
        ReturnValuesOnConditionCheckFailure: ReturnValues,
      });
    }

    // Return in transaction format
    return { ConditionCheck: payload };
  }

  // Query pass-through (default entity)
  query(
    pk: any,
    options: queryOptions = {},
    params: Partial<DocumentClient.QueryInput> = {}
  ) {
    options.entity = this.name;
    return this.table.query(pk, options, params);
  }

  // Scan pass-through (default entity)
  scan(
    options: scanOptions = {},
    params: Partial<DocumentClient.ScanInput> = {}
  ) {
    options.entity = this.name;
    return this.table.scan(options, params);
  }
} // end Entity

// Export the Entity class
export default Entity;
