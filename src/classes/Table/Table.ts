import type { A, O } from 'ts-toolbelt'

import { parseTable, ParsedTable } from '../../lib/parseTable'
import parseFilters from '../../lib/expressionBuilder'
import validateTypes from '../../lib/validateTypes'
import Entity, { AttributeMap } from '../Entity'
import {
  default as parseProjections,
  ProjectionAttributes,
  ProjectionAttributesTable,
} from '../../lib/projectionBuilder'
import type { ParsedEntity } from '../../lib/parseEntity'
import type {
  BatchGetOptions,
  BatchGetParamsMeta,
  batchWriteOptions,
  ScanOptions, ScanParamsWithMeta,
  TableConstructor,
  TableDef,
  TableQueryOptions,
  transactGetOptions,
  TransactGetParamsWithMeta,
  transactGetParamsOptions,
  TransactWriteOptions,
  transactWriteParamsOptions,
} from './types'

import { error, conditionError, If, Compute } from '../../lib/utils'
import {
  BatchGetCommand,
  BatchGetCommandInput, BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocumentClient, QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  TransactGetCommand,
  TransactGetCommandInput,
  TransactGetCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from '@aws-sdk/lib-dynamodb'
import { TransactGetItem } from '@aws-sdk/client-dynamodb'

class Table<Name extends string, PartitionKey extends A.Key, SortKey extends A.Key | null> {
  private _execute = true
  private _parse = true
  public _removeNulls = true
  private _docClient?: DynamoDBDocumentClient
  private _entities: string[] = []
  public Table!: ParsedTable['Table']
  public name!: string
  public alias?: string;

  // 🔨 TOIMPROVE: Put entities in Table.entities key & type
  [key: string]: any

  // Declare constructor (table config and optional entities)
  constructor(table: TableConstructor<Name, PartitionKey, SortKey>) {
    // Sanity check the table definition
    if (typeof table !== 'object' || Array.isArray(table)) {
      error('Please provide a valid table definition')
    }

    // Parse the table and merge into this
    Object.assign(this, parseTable(table))
  }

  // Sets the auto execute mode (default to true)
  set autoExecute(val) {
    this._execute = typeof val === 'boolean' ? val : true
  }

  // Gets the current auto execute mode
  get autoExecute() {
    return this._execute
  }

  // Sets the auto parse mode (default to true)
  set autoParse(val) {
    this._parse = typeof val === 'boolean' ? val : true
  }

  // Gets the current auto execute mode
  get autoParse() {
    return this._parse
  }

  // Sets the auto execute mode (default to true)
  set removeNullAttributes(val) {
    this._removeNulls = typeof val === 'boolean' ? val : true
  }

  // Gets the current auto execute mode
  get removeNullAttributes() {
    return this._removeNulls
  }

  get DocumentClient(): DynamoDBDocumentClient & { options?: { convertEmptyValues: boolean; wrapNumbers: boolean } } {
    return this._docClient as any
  }

  // Validate and sets the document client
  set DocumentClient(
    docClient: (DynamoDBDocumentClient) | undefined,
  ) {
    // @ts-ignore
    if (docClient && docClient.send) {
      docClient.config.translateConfig ??= {
        marshallOptions: {}
      }

      // Automatically set convertEmptyValues to true, unless false
      if (docClient.config.translateConfig?.marshallOptions?.convertEmptyValues !== false) {
        docClient.config.translateConfig!.marshallOptions!.convertEmptyValues = true
      }
      this._docClient = docClient
    } else {
      error('Invalid DocumentClient')
    }
  }

  /**
   * Adds an entity to the table
   * @param {Entity|Entity[]} Entity - An Entity or array of Entities to add to the table.
   * NOTE: this does not adjust the entity's type inference because it is static
   */
  addEntity(entity: ParsedEntity | ParsedEntity[]): void {
    // Coerce entity to array
    const entities = Array.isArray(entity) ? entity : [entity]

    // Loop through entities
    for (const i in entities) {
      const entity = entities[i]

      if (!(entity instanceof Entity)) {
        error('Invalid Entity')
      }

      if (this._entities?.includes?.(entity.name)) {
        return
      }

      // Generate the reserved words list
      const reservedWords = Object.getOwnPropertyNames(this).concat(
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)),
      )

      // Check for reserved word
      if (reservedWords.includes(entity.name)) {
        error(`'${entity.name}' is a reserved word and cannot be used to name an Entity`)
      }

      // Check for sortKeys (if applicable)
      if (!this.Table.sortKey && entity.schema.keys.sortKey) {
        error(`${entity.name} entity contains a sortKey, but the Table does not`)
      } else if (this.Table.sortKey && !entity.schema.keys.sortKey) {
        error(`${entity.name} entity does not have a sortKey defined`)
      }

      // Process Entity index keys
      for (const key in entity.schema.keys) {
        // Set the value of the key
        const attr = entity.schema.keys[key]

        // Switch based on key type (pk, sk, or index)
        switch (key) {
          // For the primary index
          case 'partitionKey':
          case 'sortKey':
            // If the attribute's name doesn't match the table's pk/sk name
            if (attr !== this.Table[key] && this.Table[key]) {
              // If the table's index attribute name does not conflict with another entity attribute
              if (!entity.schema.attributes[this.Table[key]!]) {
                // FIX: better way to do this?
                // Add the attribute using the same config and add alias
                entity.schema.attributes[this.Table[key]!] = Object.assign(
                  {},
                  entity.schema.attributes[attr],
                  { alias: attr },
                )
                // Add a map from the attribute to the new index attribute
                entity.schema.attributes[attr].map = this.Table[key]
                // Otherwise, throw an error
              } else {
                error(
                  `The Table's ${key} name (${String(
                    this.Table[key],
                  )}) conflicts with an Entity attribute name`,
                )
              }
            }
            break

          // For secondary indexes
          default:
            // Verify that the table has this index
            if (!this.Table.indexes[key]) error(`'${key}' is not a valid secondary index name`)

            // Loop through the key types (pk/sk) defined in the key mapping
            for (const keyType in attr) {
              // Make sure the table index contains the defined key types
              // @ts-ignore
              if (!this.Table.indexes[key][keyType]) {
                error(`${entity.name} contains a ${keyType}, but it is not used by ${key}`)
              }

              // console.log(key,keyType,this.Table.indexes[key])

              // If the attribute's name doesn't match the indexes attribute name
              // @ts-ignore
              if (attr[keyType] !== this.Table.indexes[key][keyType]) {
                // If the indexes attribute name does not conflict with another entity attribute
                // @ts-ignore
                if (!entity.schema.attributes[this.Table.indexes[key][keyType]]) {
                  // If there is already a mapping for this attribute, make sure they match
                  // TODO: Figure out if this is even possible anymore. I don't think it is.
                  if (
                    entity.schema.attributes[attr[keyType]].map &&
                    entity.schema.attributes[attr[keyType]].map !==
                    // @ts-ignore
                    this.Table.indexes[key][keyType]
                  ) {
                    error(
                      `${key}'s ${keyType} cannot map to the '${attr[keyType]}' alias because it is already mapped to another table attribute`,
                    )
                  }

                  // Add the index attribute using the same config and add alias
                  // @ts-ignore
                  entity.schema.attributes[this.Table.indexes[key][keyType]] = Object.assign(
                    {},
                    entity.schema.attributes[attr[keyType]],
                    { alias: attr[keyType] },
                  )
                  // Add a map from the attribute to the new index attribute
                  // @ts-ignore
                  entity.schema.attributes[attr[keyType]].map = this.Table.indexes[key][keyType]
                } else {
                  // @ts-ignore
                  const config = entity.schema.attributes[this.Table.indexes[key][keyType]]

                  // If the existing attribute isn't used by this index
                  if (
                    (!config.partitionKey && !config.sortKey) ||
                    (config.partitionKey && !config.partitionKey.includes(key)) ||
                    (config.sortKey && !config.sortKey.includes(key))
                  ) {
                    error(
                      // @ts-ignore
                      `${key}'s ${keyType} name (${this.Table.indexes[key][keyType]}) conflicts with another Entity attribute name`,
                    )
                  }
                }
              }
            }

            // Check that composite keys define both keys
            // TODO: This only checks for the attribute, not the explicit assignment
            if (
              this.Table.indexes[key].partitionKey &&
              this.Table.indexes[key].sortKey &&
              (!entity.schema.attributes[this.Table.indexes[key].partitionKey!] ||
                !entity.schema.attributes[this.Table.indexes[key].sortKey!])
            ) {
              error(`${key} requires mappings for both the partitionKey and the sortKey`)
            }
            break
        }
      }

      // Loop through the Entity's attributes and validate their types against the Table definition
      // Add attribute to table if not defined
      for (const attr in entity.schema.attributes) {
        // If an entity field conflicts with the entityField or its alias, throw an error
        if (
          this.Table.entityField &&
          (attr === this.Table.entityField || attr === entity._etAlias)
        ) {
          error(
            `Attribute or alias '${attr}' conflicts with the table's 'entityField' mapping or entity alias`,
          )

          // If the atribute already exists in the table definition
        } else if (this.Table.attributes[attr]) {
          // If type is specified, check for attribute match
          if (
            this.Table.attributes[attr].type &&
            this.Table.attributes[attr].type !== entity.schema.attributes[attr].type
          ) {
            error(
              `${entity.name} attribute type for '${attr}' (${entity.schema.attributes[attr].type}) does not match table's type (${this.Table.attributes[attr].type})`,
            )
          }

          // Add entity mappings
          this.Table.attributes[attr].mappings[entity.name] = Object.assign(
            {
              [entity.schema.attributes[attr].alias || attr]: entity.schema.attributes[attr].type,
            },
            // Add setType if type 'set'
            entity.schema.attributes[attr].type === 'set'
              ? { _setType: entity.schema.attributes[attr].setType }
              : {},
          )

          // else if the attribute doesn't exist
        } else if (!entity.schema.attributes[attr].map) {
          // Add type and entity map
          this.Table.attributes[attr] = Object.assign(
            {
              mappings: {
                [entity.name]: Object.assign(
                  {
                    [entity.schema.attributes[attr].alias || attr]:
                    entity.schema.attributes[attr].type,
                  },
                  // Add setType if type 'set'
                  entity.schema.attributes[attr].type === 'set'
                    ? { _setType: entity.schema.attributes[attr].setType }
                    : {},
                ),
              },
            },
            entity.schema.attributes[attr].partitionKey || entity.schema.attributes[attr].sortKey
              ? { type: entity.schema.attributes[attr].type }
              : null,
          )
        }
      }

      // Add the Entity to the Table's entities list
      this._entities.push(entity.name)

      // Add the entity to the Table object
      this[entity.name] = entity

      entity?.setTable?.(this)
    }
  }


  removeEntity(entity: Entity): void {
    if (!(entity instanceof Entity)) {
      error('Entity must be an instance of Entity')
    }

    if (!this._entities.includes(entity.name)) {
      return
    }

    delete this[entity.name]

    // Remove the entity from the table's entity list
    this._entities.splice(this._entities.indexOf(entity.name), 1)

    // Loop through the entity's attributes
    for (const attr in entity.schema.attributes) {
      // If the attribute is not mapped to another entity
      if (!entity.schema.attributes[attr].map) {
        // If the attribute is not used by any other entity
        if (Object.keys(this.Table.attributes[attr].mappings).length === 1) {
          // Remove the attribute from the table
          delete this.Table.attributes[attr]
        } else {
          // Remove the entity from the attribute's mappings
          delete this.Table.attributes[attr].mappings[entity.name]
        }
      }
    }

    let shouldRemoveIndexFromTable = true
    for (const indexName in entity.schema.indexes) {
      for(const tableEntity of this._entities) {
        if(this[tableEntity]?.name === entity.name) {
          continue
        }

        if(this[tableEntity]?.schema?.indexes?.[indexName]) {
          shouldRemoveIndexFromTable = false
          break
        }
      }

      if(shouldRemoveIndexFromTable) {
        delete this.Table.indexes[indexName]
      }
    }

    entity?.setTable?.(undefined)
  }

  get entities() {
    return this._entities
  }

  // ----------------------------------------------------------------//
  // Table actions
  // ----------------------------------------------------------------//

  async query<Item = AttributeMap,
    Execute extends boolean | undefined = undefined,
    Parse extends boolean | undefined = undefined>(
    pk: any,
    options: TableQueryOptions<Execute, Parse> = {},
    params: Partial<QueryCommandInput> = {},
  ): Promise<If<A.Equals<Execute, false>,
    QueryCommandInput,
    If<A.Equals<Parse, false>,
      Compute<QueryCommandOutput & {
        next?: () => Promise<QueryCommandOutput>
      }>,
      Compute<O.Update<QueryCommandOutput, 'Items', Item[]> & {
        next?: () => Promise<O.Update<QueryCommandOutput, 'Items', Item[]>>
      }>>>> {
    // Generate query parameters with projection data
    const { payload, EntityProjections, TableProjections } = this.queryParams<Execute, Parse>(
      pk,
      options,
      params,
      true,
    )

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient!.send(new QueryCommand(payload))

      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          {
            Items:
              result.Items?.map((item: unknown) => {
                if (typeof item !== 'object' || item === null) {
                  return item
                }

                const itemEntityName = options.parseAsEntity ||
                  (item as Record<string, any>)[this.Table.entityField !== false
                    ? this.Table.entityField
                    : undefined as never]
                if (typeof itemEntityName !== 'string') {
                  return item
                }

                if (this[itemEntityName]) {
                  return this[itemEntityName].parse(
                    item,
                    EntityProjections[itemEntityName]
                      ? EntityProjections[itemEntityName]
                      : TableProjections
                        ? TableProjections
                        : [],
                  )
                }

                return item
              }),
          },
          // If last evaluated key, return a next function
          result.LastEvaluatedKey
            ? {
              next: () => {
                return this.query(
                  pk,
                  Object.assign(options, { startKey: result.LastEvaluatedKey }),
                  params,
                )
              },
            }
            : null,
        ) as any
      } else {
        return result as any
      }
    } else {
      return payload
    }
  }

  // Query the table
  queryParams<Execute extends boolean | undefined = undefined,
    Parse extends boolean | undefined = undefined>(
    pk: any,
    options: TableQueryOptions<Execute, Parse> = {},
    params: Partial<QueryCommandInput> = {},
    projections = false,
    // 🔨 TOIMPROVE: Type queryParams return
  ): any {
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.KeyConditionExpressions

    // Deconstruct valid options
    const {
      index,
      limit,
      reverse, // ScanIndexForward
      consistent, // ConsistentRead (boolean)
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      select, // Select (all_attributes, all_projected_attributes, specific_attributes, count)
      eq, // =
      lt, // <
      lte, // <=
      gt, // >
      gte, // >=
      between, // between
      beginsWith, // begins_with,
      filters, // filter object,
      attributes, // Projections
      startKey,
      entity, // optional entity name to filter aliases
      parseAsEntity, // optional entity name to parse the result as
      ..._args // capture extra arguments
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid query options: ${args.join(', ')}`)

    // Verify pk
    if (
      (typeof pk !== 'string' && typeof pk !== 'number') ||
      (typeof pk === 'string' && pk.trim().length === 0)
    ) {
      error(`Query requires a string, number or binary 'partitionKey' as its first parameter`)
    }

    // Verify index
    if (index !== undefined && !this.Table.indexes[index]) {
      error(`'${index}' is not a valid index name`)
    }

    // Verify limit
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) {
      error(`'limit' must be a positive integer`)
    }

    // Verify reverse
    if (reverse !== undefined && typeof reverse !== 'boolean') error(`'reverse' requires a boolean`)

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== 'boolean') {
      error(`'consistent' requires a boolean`)
    }

    // Verify select
    // TODO: Make dependent on whether or not an index is supplied
    if (
      select !== undefined &&
      (typeof select !== 'string' ||
        !['ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', 'COUNT'].includes(
          select.toUpperCase(),
        ))
    ) {
      error(
        `'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`,
      )
    }

    // Verify entity
    if (entity !== undefined && (typeof entity !== 'string' || !(entity in this))) {
      error(`'entity' must be a string and a valid table Entity name`)
    }

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    // Verify startKey
    // TODO: validate startKey shape
    if (startKey && (typeof startKey !== 'object' || Array.isArray(startKey))) {
      error(`'startKey' requires a valid object`)
    }

    // Default names and values
    let ExpressionAttributeNames: { [key: string]: any } = {
      '#pk': (index && this.Table.indexes[index].partitionKey) || this.Table.partitionKey,
    }
    let ExpressionAttributeValues: { [key: string]: any } = { ':pk': pk }
    let KeyConditionExpression = '#pk = :pk'
    let FilterExpression
    let ProjectionExpression
    let EntityProjections = {}
    let TableProjections // FIXME: removed default

    // Parse sortKey condition operator and value
    let operator,
      value: any,
      f = ''
    if (eq !== undefined) {
      value = eq
      f = 'eq'
      operator = '='
    }
    if (lt !== undefined) {
      value = value ? conditionError(f) : lt
      f = 'lt'
      operator = '<'
    }
    if (lte !== undefined) {
      value = value ? conditionError(f) : lte
      f = 'lte'
      operator = '<='
    }
    if (gt !== undefined) {
      value = value ? conditionError(f) : gt
      f = 'gt'
      operator = '>'
    }
    if (gte !== undefined) {
      value = value ? conditionError(f) : gte
      f = 'gte'
      operator = '>='
    }
    if (beginsWith !== undefined) {
      value = value ? conditionError(f) : beginsWith
      f = 'beginsWith'
      operator = 'BEGINS_WITH'
    }
    if (between !== undefined) {
      value = value ? conditionError(f) : between
      f = 'between'
      operator = 'BETWEEN'
    }

    // If a sortKey condition was set
    if (operator) {
      // Get sortKey configuration
      const sk = index
        ? this.Table.indexes[index].sortKey
          ? this.Table.attributes[this.Table.indexes[index].sortKey!] || { type: 'string' }
          : error(`Conditional expressions require the index to have a sortKey`)
        : this.Table.sortKey
          ? this.Table.attributes[this.Table.sortKey]
          : error(`Conditional expressions require the table to have a sortKey`)

      // Init validateType
      const validateType = validateTypes()

      // Add the sortKey attribute name
      ExpressionAttributeNames['#sk'] =
        (index && this.Table.indexes[index].sortKey) || this.Table.sortKey
      // If between operation
      if (operator === 'BETWEEN') {
        // Verify array input
        if (!Array.isArray(value) || value.length !== 2) {
          error(`'between' conditions requires an array with two values.`)
        }
        // Add values and special key condition
        ExpressionAttributeValues[':sk0'] = validateType(sk, f + '[0]', value[0])
        ExpressionAttributeValues[':sk1'] = validateType(sk, f + '[1]', value[1])
        KeyConditionExpression += ' and #sk between :sk0 and :sk1'
      } else {
        // Add value
        ExpressionAttributeValues[':sk'] = validateType(sk, f, value)
        // If begins_with, add special key condition
        if (operator === 'BEGINS_WITH') {
          KeyConditionExpression += ' and begins_with(#sk,:sk)'
        } else {
          KeyConditionExpression += ` and #sk ${operator} :sk`
        }
      }
    }

    // If filter expressions
    if (filters) {
      // Parse the filter
      const { expression, names, values } = parseFilters(filters, this, entity)

      if (Object.keys(names).length > 0) {
        // TODO: alias attribute field names
        // console.log(names)

        // Merge names and values and add filter expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names)
        ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values)
        FilterExpression = expression
      }
    }

    // If projections
    if (attributes) {
      const { names, projections, entities, tableAttrs } = parseProjections(
        attributes,
        this,
        entity!,
        true,
      )

      if (Object.keys(names).length > 0) {
        // Merge names and add projection expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names)
        ProjectionExpression = projections
        EntityProjections = entities
        TableProjections = tableAttrs
      }
    }

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: this.name,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      },
      FilterExpression ? { FilterExpression } : null,
      ProjectionExpression ? { ProjectionExpression } : null,
      index ? { IndexName: index } : null,
      limit ? { Limit: String(limit) } : null,
      reverse ? { ScanIndexForward: !reverse } : null,
      consistent ? { ConsistentRead: consistent } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      select ? { Select: select.toUpperCase() } : null,
      startKey ? { ExclusiveStartKey: startKey } : null,
      typeof params === 'object' ? params : null,
    )

    return projections ? { payload, EntityProjections, TableProjections } : payload
  }

  async scan<Item = AttributeMap,
    Execute extends boolean | undefined = undefined,
    Parse extends boolean | undefined = undefined>(
    options: ScanOptions<Execute, Parse> = {},
    params: Partial<ScanCommandInput> = {},
  ): Promise<If<A.Equals<Execute, false>,
    ScanCommandInput,
    If<A.Equals<Parse, false>,
      Compute<ScanCommandOutput & {
        next?: () => Promise<ScanCommandOutput>
      }>,
      Compute<O.Update<ScanCommandOutput, 'Items', Item[]> & {
        next?: () => Promise<O.Update<ScanCommandOutput, 'Items', Item[]>>
      }>>>> {
    // Generate query parameters with meta data
    const { payload, EntityProjections, TableProjections } = this.scanParams<Execute, Parse>(
      options,
      params,
      true,
    ) as ScanParamsWithMeta

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient!.send(new ScanCommand(payload)) as ScanCommandOutput

      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          {
            Items: result.Items?.map(item => {
              const itemEntityName = options.parseAsEntity ||
                item[this.Table.entityField !== false ? this.Table.entityField : undefined as never]
              const itemEntityInstance = this[itemEntityName]

              if (itemEntityInstance != null) {
                return itemEntityInstance.parse(
                  item,
                  EntityProjections[itemEntityName]
                    ? EntityProjections[itemEntityName]
                    : TableProjections
                      ? TableProjections
                      : [],
                )
              } else {
                return item
              }
            }),
          },
          // If last evaluated key, return a next function
          result.LastEvaluatedKey
            ? {
              next: () => {
                return this.scan(
                  Object.assign(options, { startKey: result.LastEvaluatedKey }),
                  params,
                )
              },
            }
            : null,
        ) as any
      } else {
        return result as any
      }
    } else {
      return payload as any
    }
  }

  // Generate SCAN Parameters
  scanParams<Execute extends boolean | undefined = undefined,
    Parse extends boolean | undefined = undefined>(
    options: ScanOptions<Execute, Parse> = {},
    params: Partial<ScanCommandInput> = {},
    meta = false,
  ): ScanCommandInput | ScanParamsWithMeta {
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.KeyConditionExpressions

    // Deconstruct valid options
    const {
      index,
      limit,
      consistent, // ConsistentRead (boolean)
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      select, // Select (all_attributes, all_projected_attributes, specific_attributes, count)
      filters, // filter object,
      attributes, // Projections
      segments, // Segments,
      segment, // Segment
      startKey,
      entity, // optional entity name to filter aliases
      parseAsEntity, // optional entity name to parse the result as
      ..._args // capture extra arguments
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid scan options: ${args.join(', ')}`)

    // Verify index
    if (index !== undefined && !this.Table.indexes[index]) {
      error(`'${index}' is not a valid index name`)
    }

    // Verify limit
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) {
      error(`'limit' must be a positive integer`)
    }

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== 'boolean') {
      error(`'consistent' requires a boolean`)
    }

    // Verify select
    // TODO: Make dependent on whether or not an index is supplied
    if (
      select !== undefined &&
      (typeof select !== 'string' ||
        !['ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', 'COUNT'].includes(
          select.toUpperCase(),
        ))
    ) {
      error(
        `'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`,
      )
    }

    // Verify entity
    if (entity !== undefined && (typeof entity !== 'string' || !(entity in this))) {
      error(`'entity' must be a string and a valid table Entity name`)
    }

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    // Verify startKey
    // TODO: validate startKey shape
    if (startKey && (typeof startKey !== 'object' || Array.isArray(startKey))) {
      error(`'startKey' requires a valid object`)
    }

    // Verify consistent segments
    if (segments !== undefined && (!Number.isInteger(segments) || segments < 1)) {
      error(`'segments' must be an integer greater than 1`)
    }

    if (
      segment !== undefined &&
      (!Number.isInteger(segment) || segment < 0 || segment >= segments!)
    ) {
      error(
        `'segment' must be an integer greater than or equal to 0 and less than the total number of segments`,
      )
    }

    if (
      (segments !== undefined && segment === undefined) ||
      (segments === undefined && segment !== undefined)
    ) {
      error(`Both 'segments' and 'segment' must be provided`)
    }

    // Default names and values
    let ExpressionAttributeNames = {}
    let ExpressionAttributeValues = {}
    let FilterExpression // init FilterExpression
    let ProjectionExpression // init ProjectionExpression
    let EntityProjections = {}
    let TableProjections

    // If filter expressions
    if (filters) {
      // Parse the filter
      const { expression, names, values } = parseFilters(filters, this, entity)

      if (Object.keys(names).length > 0) {
        // TODO: alias attribute field names
        // console.log(names)

        // Merge names and values and add filter expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names)
        ExpressionAttributeValues = Object.assign(ExpressionAttributeValues, values)
        FilterExpression = expression
      }
    }

    // If projections
    if (attributes) {
      const { names, projections, entities, tableAttrs } = parseProjections(
        attributes,
        this,
        entity!,
        true,
      )

      if (Object.keys(names).length > 0) {
        // Merge names and add projection expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames, names)
        ProjectionExpression = projections
        EntityProjections = entities
        TableProjections = tableAttrs
      }
    }

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: this.name,
      },
      Object.keys(ExpressionAttributeNames).length ? { ExpressionAttributeNames } : null,
      Object.keys(ExpressionAttributeValues).length ? { ExpressionAttributeValues } : null,
      FilterExpression ? { FilterExpression } : null,
      ProjectionExpression ? { ProjectionExpression } : null,
      index ? { IndexName: index } : null,
      segments ? { TotalSegments: segments } : null,
      Number.isInteger(segment) ? { Segment: segment } : null,
      limit ? { Limit: String(limit) } : null,
      consistent ? { ConsistentRead: consistent } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      select ? { Select: select.toUpperCase() } : null,
      startKey ? { ExclusiveStartKey: startKey } : null,
      typeof params === 'object' ? params : null,
    )

    return meta ? { payload, EntityProjections, TableProjections } : payload
  }

  // BatchGet Items
  async batchGet(
    items: any,
    options: BatchGetOptions = {},
    params: Partial<BatchGetCommandInput> = {},
  ) {
    // Generate the payload with meta information
    const {
      payload, // batchGet payload
      Tables, // table reference
      EntityProjections,
      TableProjections,
    } = this.batchGetParams(items, options, params, true) as BatchGetParamsMeta

    const shouldExecute = options.execute || (this.autoExecute && options.execute !== false)
    if (!shouldExecute) {
      return payload
    }

    const result = await this.DocumentClient!.send(new BatchGetCommand(payload))

    const shouldParse = options.parse || (this.autoParse && options.parse !== false)
    if (!shouldParse) {
      return result
    }

    return this.parseBatchGetResponse(
      result,
      Tables,
      EntityProjections,
      TableProjections,
      options,
    )
  }

  parseBatchGetResponse(
    result: any,
    // 💥 Retype as Record<string, Table> with inferred type
    Tables: any,
    EntityProjections: { [key: string]: any },
    TableProjections: { [key: string]: string[] },
    options: BatchGetOptions = {},
  ) {
    return Object.assign(
      result,
      // If reponses exist
      result.Responses
        ? {
          // Loop through the tables
          Responses: Object.keys(result.Responses).reduce((acc, table) => {
            // Merge in tables
            return Object.assign(acc, {
              // Map over the items
              [(Tables[table] && Tables[table].alias) || table]: result.Responses[table].map(
                (item: TableDef) => {
                  // Check that the table has a reference, the entityField exists, and that the entity type exists on
                  // the table
                  if (
                    Tables[table] &&
                    Tables[table][item[String(Tables[table].Table.entityField)]]
                  ) {
                    // Parse the item and pass in projection references
                    return Tables[table][item[String(Tables[table].Table.entityField)]].parse(
                      item,
                      EntityProjections[table] &&
                      EntityProjections[table][item[String(Tables[table].Table.entityField)]]
                        ? EntityProjections[table][item[String(Tables[table].Table.entityField)]]
                        : TableProjections[table]
                          ? TableProjections[table]
                          : [],
                    )
                    // Else, just return the original item
                  } else {
                    return item
                  }
                },
              ),
            })
          }, {}),
        }
        : null,
      // If UnprocessedKeys, return a next function
      result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0
        ? {
          next: async (): Promise<any> => {
            const nextResult = await this.DocumentClient!.send( new BatchGetCommand(
              Object.assign(
                { RequestItems: result.UnprocessedKeys },
                options.capacity
                  ? { ReturnConsumedCapacity: options.capacity.toUpperCase() }
                  : null,
              ),
            ))

            return this.parseBatchGetResponse(
              nextResult,
              Tables,
              EntityProjections,
              TableProjections,
              options,
            )
          },
        }
        : { next: () => false }, // TODO: How should this return?
    )
  }

  // Generate BatchGet Params
  batchGetParams(
    _items: any,
    options: BatchGetOptions = {},
    params: Partial<BatchGetCommandInput> = {},
    meta = false,
  ) {
    const items = Array.isArray(_items) ? _items : [_items]

    // Error on no items
    if (items.length === 0) error(`No items supplied`)

    const { capacity, consistent, attributes, ..._args } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid batchGet options: ${args.join(', ')}`)

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    // Init RequestItems and Tables reference
    const RequestItems: BatchGetCommandInput['RequestItems'] = {}
    const Tables: { [key: string]: any } = {}
    const TableAliases: { [key: string]: any } = {}
    const EntityProjections: { [key: string]: any } = {}
    const TableProjections: { [key: string]: any } = {}

    // // Loop through items
    for (const i in items) {
      const item = items[i]

      // Check item for Table reference and key
      if (item && item.Table && item.Table.Table && item.Key && item.Key?.constructor === Object) {
        // Set the table
        const table = item.Table.name

        // If it doesn't exist
        if (!RequestItems[table]) {
          // Create a table property with an empty array
          RequestItems[table] = { Keys: [] }
          // Add the table/table alias reference
          Tables[table] = item.Table
          if (item.Table.alias) TableAliases[item.Table.alias] = table
        }

        RequestItems![table]!.Keys!.push(item.Key)
      } else {
        error(`Item references must contain a valid Table object and Key`)
      }
    }

    // Parse 'consistent' option
    if (consistent) {
      // If true, add to all table mappings
      if (consistent === true) {
        for (const tbl in RequestItems) {
          RequestItems[tbl].ConsistentRead = true
        }
      } else if (consistent?.constructor === Object) {
        for (const tbl in consistent as Record<string, unknown>) {
          const tbl_name = TableAliases[tbl] || tbl
          if (RequestItems[tbl_name]) {
            if (typeof consistent[tbl] === 'boolean') {
              RequestItems[tbl_name].ConsistentRead = consistent[tbl]
            } else {
              error(`'consistent' values must be booleans (${tbl})`)
            }
          } else {
            error(`There are no items for the table or table alias: ${tbl}`)
          }
        }
      } else {
        error(`'consistent' must be a boolean or an map of table names`)
      }
    }

    // If projections
    if (attributes) {
      let attrs: ProjectionAttributesTable | ProjectionAttributes = attributes

      // If an Array, ensure single table and convert to standard format
      if (Array.isArray(attributes)) {
        if (Object.keys(RequestItems).length === 1) {
          attrs = { [Object.keys(RequestItems)[0]]: attributes }
        } else {
          error(`'attributes' must use a table map when requesting items from multiple tables`)
        }
      }

      for (const tbl in attrs as ProjectionAttributesTable) {
        const tbl_name = TableAliases[tbl] || tbl
        if (Tables[tbl_name]) {
          const { names, projections, entities, tableAttrs } = parseProjections(
            (attrs as ProjectionAttributesTable)[tbl],
            Tables[tbl_name],
            null,
            true,
          )
          RequestItems[tbl_name].ExpressionAttributeNames = names
          RequestItems[tbl_name].ProjectionExpression = projections
          EntityProjections[tbl_name] = entities
          TableProjections[tbl_name] = tableAttrs
        } else {
          error(`There are no items for the table: ${tbl}`)
        }
      }
    }

    const payload = Object.assign(
      { RequestItems },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      typeof params === 'object' ? params : null,
    )

    return meta
      ? {
        payload,
        Tables,
        EntityProjections,
        TableProjections,
      }
      : payload
  } // batchGetParams

  // BatchWrite Items
  async batchWrite(
    items: any,
    options: batchWriteOptions = {},
    params: Partial<BatchWriteCommandInput> = {},
  ) {
    // Generate the payload with meta information
    const payload = this.batchWriteParams(
      items,
      options,
      params,
    ) as BatchWriteCommandInput

    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient!.send( new BatchWriteCommand(payload))

      if (options.parse || (this.autoParse && options.parse !== false)) {
        return this.parseBatchWriteResponse(result, options)
      } else {
        return result
      }
    } else {
      return payload
    }
  }

  private parseBatchWriteResponse(result: any, options: batchWriteOptions = {}): any {
    return Object.assign(
      result,
      // If UnprocessedItems, return a next function
      result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0
        ? {
          next: async () => {
            const nextResult = await this.DocumentClient!.send( new BatchWriteCommand(
              Object.assign(
                { RequestItems: result.UnprocessedItems },
                options.capacity
                  ? { ReturnConsumedCapacity: options.capacity.toUpperCase() }
                  : null,
                options.metrics
                  ? { ReturnItemCollectionMetrics: options.metrics.toUpperCase() }
                  : null,
              ),
            ))

            return this.parseBatchWriteResponse(nextResult, options)
          },
        }
        : { next: () => false }, // TODO: How should this return?
    )
  }

  /**
   * Generates parameters for a batchWrite
   * @param {object} _items - An array of objects generated from putBatch and/or deleteBatch entity calls.
   * @param {object} [options] - Additional batchWrite options
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the batchWrite request.
   * @param {boolean} [meta] - Internal flag to enable entity parsing
   *
   */
  batchWriteParams(
    _items: any,
    options: batchWriteOptions = {},
    params: Partial<BatchWriteCommandInput> = {},
    meta = false,
  ) {
    // Convert items to array
    const items = (Array.isArray(_items) ? _items : [_items]).filter(x => x)

    // Error on no items
    if (items.length === 0) error(`No items supplied`)

    const { capacity, metrics, ..._args } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid batchWrite options: ${args.join(', ')}`)

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    // Verify metrics
    if (
      metrics !== undefined &&
      (typeof metrics !== 'string' || !['NONE', 'SIZE'].includes(metrics.toUpperCase()))
    ) {
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`)
    }

    // Init RequestItems
    const RequestItems: { [key: string]: any } = {}

    // Loop through items
    for (const i in items) {
      const item = items[i]
      const table = Object.keys(item)[0]

      // Create a table property with an empty array if it doesn't exist
      if (!RequestItems[table]) RequestItems[table] = []

      // TODO: Add some validation here?

      // Push request onto the table array
      RequestItems[table].push(item[table])
    }

    const payload: BatchWriteCommandInput = Object.assign(
      { RequestItems },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      typeof params === 'object' ? params : null,
    )

    const Tables = {}
    return meta ? { payload, Tables } : payload
  } // batchWriteParams

  /**
   * Performs a transactGet operation
   * @param {object} items - An array of objects generated from getTransaction entity calls.
   * @param {object} [options] - Additional transactGet options
   *
   */
  async transactGet(
    items: ({ Entity?: any } & TransactGetItem)[] = [],
    options: transactGetOptions = {},
    // params: Partial<TransactGetCommandInput> = {}
  ) {
    // Generate the payload with meta information
    const { payload, Entities } = this.transactGetParams(
      items,
      options,
      true,
    ) as TransactGetParamsWithMeta

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient!.send ( new TransactGetCommand(payload)) as TransactGetCommandOutput

      if (options.parse || (this.autoParse && options.parse !== false)) {
        // Parse the items using the appropriate entity
        return Object.assign(
          result,
          result.Responses
            ? {
              Responses: result.Responses!.map((res, i) => {
                if (res.Item) {
                  return { Item: Entities[i].parse ? Entities[i].parse(res.Item) : res.Item }
                } else {
                  return {}
                }
              }),
            }
            : null,
        ) as TransactGetCommandOutput
      } else {
        return result as TransactGetCommandOutput
      }
    } else {
      return payload as TransactGetCommandInput
    }
  }

  /**
   * Generates parameters for a transactGet operation
   * @param {object} _items - An array of objects generated from getTransaction entity calls.
   * @param {object} [options] - Additional transactGet options.
   * @param {boolean} [meta] - A flag for returning metadata, this is for internal use.
   *
   * Creates a TransactGetItems object:
   *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html
   */
  transactGetParams(
    _items: ({ Entity?: any } & TransactGetItem)[],
    options?: transactGetParamsOptions,
    meta?: false | undefined,
  ): TransactGetCommandInput
  transactGetParams(
    _items: ({ Entity?: any } & TransactGetItem)[],
    options: transactGetParamsOptions,
    meta: true,
  ): TransactGetParamsWithMeta
  transactGetParams(
    _items: ({ Entity?: any } & TransactGetItem)[],
    options: transactGetParamsOptions = {},
    meta = false,
  ): TransactGetCommandInput | TransactGetParamsWithMeta {
    const items = Array.isArray(_items) ? _items : _items ? [_items] : []

    // Error on no items
    if (items.length === 0) error(`No items supplied`)

    // Extract valid options
    const {
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    if (args.length > 0) error(`Invalid transactGet options: ${args.join(', ')}`)

    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    const Entities: (any | undefined)[] = []

    const payload = Object.assign(
      {
        // Loop through items and verify transaction objects
        TransactItems: items.map(item => {
          const { Entity, ..._item } = item
          Entities.push(Entity)
          if (!('Get' in _item) || Object.keys(_item).length > 1) {
            error(`Invalid transaction item. Use the 'getTransaction' method on an entity.`)
          }
          return _item
        }),
      },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
    )

    return meta ? { Entities, payload } : payload as any
  }

  /**
   * Performs a transactWrite operation
   * @param {object} items - An array of objects generated from putTransaction, updateTransaction, or deleteTransaction
   *   entity calls.
   * @param {object} [options] - Additional transactWrite options.
   * @param {object} [params] - Additional transactWrite parameters.
   *
   */
  async transactWrite(
    items: TransactWriteCommandInput['TransactItems'],
    options: TransactWriteOptions = {},
    params?: Partial<TransactWriteCommandInput>,
  ) {
    const payload = this.transactWriteParams(items, options, params)

    if (options.execute || (this.autoExecute && options.execute !== false)) {
      return await this.DocumentClient!.send(new TransactWriteCommand(payload)) as TransactWriteCommandOutput
    } else {
      return payload as TransactWriteCommandInput
    }
  }

  /**
   * Generates parameters for a transactWrite operation
   * @param {object} _items - An array of objects generated from putTransaction, updateTransaction, or deleteTransaction
   *   entity calls.
   * @param {object} [options] - Additional options
   * @param {object} [params] - Additional DynamoDB parameters you wish to pass to the transactWrite request.
   *
   * Creates a TransactWriteItems object:
   *   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html
   */
  transactWriteParams(
    _items: TransactWriteCommandInput['TransactItems'],
    options: transactWriteParamsOptions = {},
    params: Partial<TransactWriteCommandInput> = {},
  ): TransactWriteCommandInput {
    const items = Array.isArray(_items) ? _items : _items ? [_items] : []

    // Error on no items
    if (items.length === 0) error(`No items supplied`)

    // Extract valid options
    const {
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics (size or none)
      token, // ClientRequestToken (1-36 characters)
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute', 'parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0) error(`Invalid transactWrite options: ${args.join(', ')}`)

    // Verify capacity
    if (
      capacity !== undefined &&
      (typeof capacity !== 'string' ||
        !['NONE', 'TOTAL', 'INDEXES'].includes(capacity.toUpperCase()))
    ) {
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    }

    // Verify metrics
    if (
      metrics !== undefined &&
      (typeof metrics !== 'string' || !['NONE', 'SIZE'].includes(metrics.toUpperCase()))
    ) {
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`)
    }

    // Verify token
    if (
      token !== undefined &&
      (typeof token !== 'string' || token.trim().length === 0 || token.trim().length > 36)
    ) {
      error(`'token' must be a string up to 36 characters long `)
    }

    // Generate the payload
    const payload = Object.assign(
      {
        // Loop through items
        TransactItems: items.map(item => {
          if (
            // Check for valid transaction object
            (!('ConditionCheck' in item) &&
              !('Delete' in item) &&
              !('Put' in item) &&
              !('Update' in item)) ||
            Object.keys(item).length > 1
          ) {
            error(
              `Invalid transaction item. Use the 'putTransaction', 'updateTransaction', 'deleteTransaction', or 'conditionCheck' methods on an entity.`,
            )
          }
          return item
        }),
      },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      token ? { ClientRequestToken: token.trim() } : null,
      typeof params === 'object' ? params : {},
    )

    return payload
  }

  // Entity operation references
  async parse(entity: string, input: any, include = []) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].parse(input, include)
  }

  async get(entity: string, item = {}, options = {}, params = {}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].get(item, options, params)
  }

  async delete(entity: string, item = {}, options = {}, params = {}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].delete(item, options, params)
  }

  async update(entity: string, item = {}, options = {}, params = {}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].update(item, options, params)
  }

  async put(entity: string, item = {}, options = {}, params = {}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].put(item, options, params)
  }
}

// Export the Table class
export default Table
