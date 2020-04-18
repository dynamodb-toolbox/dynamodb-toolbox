'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// Import parseTable 
const parseTable = require('../lib/parseTable')
const parseFilters = require('../lib/expressionBuilder')
const parseProjections = require('../lib/projectionBuilder')
const validateTypes = require('../lib/validateTypes')

// Import standard error handler
const { error } = require('../lib/utils')

// Import Entity class
const Entity = require('./Entity')

// Define condition error
const conditonError = (op) =>
  error(`You can only supply one sortKey condition per query. Already using '${op}'`)

// Declare Table class
class Table {

  // Declare constructor (table config and optional entities)
  constructor(table) { //},docClient,entities) {

    // Sanity check the table definition
    if (typeof table !== 'object' || Array.isArray(table))
      error('Please provide a valid table definition')
    
    // Parse the table and merge into this
    Object.assign(this,parseTable(table))
    
  } // end constructor

  // Sets the auto execute mode (default to true)
  set autoExecute(val) { this._execute = typeof val === 'boolean' ? val : true }

  // Gets the current auto execute mode
  get autoExecute() { return this._execute }

  // Sets the auto parse mode (default to true)
  set autoParse(val) { this._parse = typeof val === 'boolean' ? val : true }

  // Gets the current auto execute mode
  get autoParse() { return this._parse }

  // Retrieves the document client
  get DocumentClient() { return this._docClient }

  // Validate and sets the document client
  set DocumentClient(docClient) {
    // If a valid document client
    if (docClient.constructor.name === 'DocumentClient') {
      this._docClient = docClient
    } else {
      error('Invalid DocumentClient')
    }
  } // end DocmentClient

  // Adds a new Entities to the table
  set entities(entity) {

    // Coerce entity to array
    let entities = Array.isArray(entity) ? entity : [entity]

    // Loop through entities
    for (let i in entities) {
      let entity = entities[i]

      // If an instance of Entity, add it
      if (entity instanceof Entity) {    
        
        // Check for existing entity name
        if (this._entities.includes(entity.name)) {
          error(`Entity name '${entity.name}' already exists`)
        }

        // Generate the reserved words list
        const reservedWords = Object.getOwnPropertyNames(this)
          .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(this)))

        // Check for reserved word
        if (reservedWords.includes(entity.name)) {
          error(`'${entity.name}' is a reserved word and cannot be used to name an Entity`)
        }

        // Check for partitionKey
        if (!entity.schema.keys.partitionKey) {
          error(`Entity must have a partitionKey`)
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
          switch(key) {

            // For the primary index
            case 'partitionKey':
            case 'sortKey':
              // If the attribute's name doesn't match the table's pk/sk name
              if (attr !== this.Table[key]) {
                // If the table's index attribute name does not conflict with another entity attribute
                if (!entity.schema.attributes[this.Table[key]]) {
                  // Add the attribute using the same config and add alias
                  entity.schema.attributes[this.Table[key]] = Object.assign(
                    {},
                    entity.schema.attributes[attr],
                    { alias: attr }
                  ) // end assign
                  // Add a map from the attribute to the new index attribute
                  entity.schema.attributes[attr].map = this.Table[key]
                // Otherwise, throw an error
                } else {
                  error(`The Table's ${key} name (${this.Table[key]}) conflicts with an Entity attribute name`)
                } // end if-else
              } // end if
              break
            
            // For secondary indexes
            default:
              // Verify that the table has this index
              if (!this.Table.indexes[key]) error(`'${key}' is not a valid secondary index name`)
              
              // Loop through the key types (pk/sk) defined in the key mapping
              for (const keyType in attr) {
                // If the attribute's name doesn't match the indexes attribute name
                if (attr[keyType] !== this.Table.indexes[key][keyType]) {
                  // If the indexes attribute name does not conflict with another entity attribute
                  if (!entity.schema.attributes[this.Table.indexes[key][keyType]]) {
                    // Add the index attribute using the same config and add alias
                    entity.schema.attributes[this.Table.indexes[key][keyType]] = Object.assign(
                      {},
                      entity.schema.attributes[attr[keyType]],
                      { alias: attr[keyType] }
                    ) // end assign
                    // Add a map from the attribute to the new index attribute
                    entity.schema.attributes[attr[keyType]].map = this.Table.indexes[key][keyType]
                  // Otherwise, throw an error
                  } else {
                    // console.log(
                    //   entity.schema.attributes[this.Table.indexes[key][keyType]][keyType]
                    //   // || entity.schema.attributes[this.Table.indexes[key][keyType]][keyType].includes(key)
                    // )
                    error(`${key}'s ${keyType} name (${this.Table.indexes[key][keyType]}) conflicts with an Entity attribute name`)
                  } // end if-else
                } // end if
              } // end for
              break

          } // end switch
        } // end for

        // Loop through the Entity's attributes and validate their types against the Table definition
        // Add attribute to table if not defined
        for (let attr in entity.schema.attributes) {
          
          // If an entity field conflicts with the entityField or its alias, throw an error
          if (this.Table.entityField && (attr === this.Table.entityField || attr === entity._tpAlias)) {
            error(`Attribute or alias '${attr}' conflicts with the table's 'entityField' mapping or entity alias`)

          // If the atribute already exists in the table definition
          } else if (this.Table.attributes[attr]) {

            // Check type (and setType if exists)
            if (this.Table.attributes[attr].type === entity.schema.attributes[attr].type
                && (this.Table.attributes[attr].type !== 'set' 
                  || this.Table.attributes[attr].setType === entity.schema.attributes[attr].setType)
            ) {
              // Add entity mappings
              this.Table.attributes[attr].mappings[entity.name] = entity.schema.attributes[attr].alias || attr
            // Otherwise throw an error
            } else {
              error(`${entity.name} attribute type '${attr}' (${entity.schema.attributes[attr].type}) does not match table's type (${this.Table.attributes[attr].type})`)
            } // end check type

          // else if the attribute doesn't exist
          } else if (!entity.schema.attributes[attr].map) {
            
            // Add type and entity map
            this.Table.attributes[attr] = Object.assign(
              {
                type: entity.schema.attributes[attr].type,
                mappings: { [entity.name]: entity.schema.attributes[attr].alias || attr }
              },
              // Add setType if type 'set'
              entity.schema.attributes[attr].type === 'set' 
                ? { setType: entity.schema.attributes[attr].setType }
                : {}
            ) // end Object.assign

          } // end if-else Table attribute exists
          
        } // end for loop to check/add attributes
        
        // Add the Entity to the Table's entities list
        this._entities.push(entity.name)

        // Add the entity to the Table object
        this[entity.name] = entity

        // Set the Entity's table by reference
        entity.table = this

      } else {
        error('Invalid Entity')
      }
    } // end for

  } // end addEntity

  get entities() {
    return this._entities
  }

  // ----------------------------------------------------------------//
  // Table actions
  // ----------------------------------------------------------------//

  // Query the table
  async query(pk,options={},params={}) { 
    
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.KeyConditionExpressions

    // Deconstruct valid options
    const { 
      index,
      limit,
      reverse, // ScanIndexForward
      consistent, // ConsistentRead (boolean)
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
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
      ..._args // capture extra arguments
    } = options
    
    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid query options: ${args.join(', ')}`)

    // Verify pk
    if (typeof pk !== 'string' || pk.trim().length === 0)
      error(`Query requires a string 'partitionKey' as its first parameter`)

    // Verify index
    if (index !== undefined && !this.Table.indexes[index])
      error(`'${index}' is not a valid index name`)

    // Verify limit
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0))
      error(`'limit' must be a positive integer`)

    // Verify reverse
    if (reverse !== undefined && typeof reverse !== 'boolean')
      error(`'reverse' requires a boolean`)

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== 'boolean')
      error(`'consistent' requires a boolean`)
  
    // Verify entity
    if (entity !== undefined && (typeof entity !== 'string' || !(entity in this)))
      error(`'entity' must be a string and a valid table Entity name`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Verify startKey
    // TODO: validate startKey shape
    if (startKey && (typeof startKey !== 'object' || Array.isArray(startKey)))
      error(`'startKey' requires a valid object`)

    // Default names and values
    let ExpressionAttributeNames = { '#pk': (index && this.Table.indexes[index].partitionKey) || this.Table.partitionKey }
    let ExpressionAttributeValues = { ':pk': pk }
    let KeyConditionExpression = '#pk = :pk'
    let FilterExpression // init FilterExpression
    let ProjectionExpression // init ProjectionExpression
    let EntityProjections = {}
    let TableProjections = []

    // Parse sortKey condition operator and value
    let operator, value, f
    if (eq) { f = 'eq'; value = value ? conditonError(f) : eq; operator = '=' }
    if (lt) { f = 'lt'; value = value ? conditonError(f) : lt; operator = '<' }
    if (lte) { f = 'lte'; value = value ? conditonError(f) : lte; operator = '<=' }
    if (gt) { f = 'gt'; value = value ? conditonError(f) : gt; operator = '>' }
    if (gte) { f = ''; value = value ? conditonError(f) : gte; operator = '>=' }
    if (beginsWith) { f = 'beginsWith'; value = value ? conditonError(f) : beginsWith; operator = 'BEGINS_WITH' }
    if (between) { f = 'between'; value = value ? conditonError(f) : between; operator = 'BETWEEN' }

    // If a sortKey condition was set
    if (operator) {

      // Get sortKey configuration
      const sk = index ? 
        (
          this.Table.indexes[index].sortKey ? (
            this.Table.attributes[this.Table.indexes[index].sortKey] || { type: 'string'}
          )
            : error(`Conditional expressions require the index to have a sortKey`)
        )
        : this.Table.sortKey ? this.Table.attributes[this.Table.sortKey]
        : error(`Conditional expressions require the table to have a sortKey`)        

      // Init validateType
      const validateType = validateTypes()

      // Add the sortKey attribute name
      ExpressionAttributeNames['#sk'] = (index && this.Table.indexes[index].sortKey) || this.Table.sortKey
      // If between operation
      if (operator === 'BETWEEN') {
        // Verify array input
        if (!Array.isArray(value) || value.length !== 2)
          error(`'between' conditions requires an array with two values.`)
        // Add values and special key condition
        ExpressionAttributeValues[':sk0'] = validateType(sk,f+'[0]',value[0])
        ExpressionAttributeValues[':sk1'] = validateType(sk,f+'[1]',value[1])
        KeyConditionExpression += ' and #sk between :sk0 and :sk1'
      } else {
        // Add value
        ExpressionAttributeValues[':sk'] = validateType(sk,f,value)
        // If begins_with, add special key condition
        if (operator === 'BEGINS_WITH') {
          KeyConditionExpression += ' and begins_with(#sk,:sk)'
        } else {
          KeyConditionExpression += ` and #sk ${operator} :sk`
        }
      } // end if-else    
    } // end if operator


    // If filter expressions
    if (filters) {
      
      // Parse the filter
      const {
        expression,
        names,
        values
      } = parseFilters(filters,this,entity)

      if (Object.keys(names).length > 0) {

        // TODO: alias attribute field names
        // console.log(names)
        
        // Merge names and values and add filter expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames,names)
        ExpressionAttributeValues = Object.assign(ExpressionAttributeValues,values)
        FilterExpression = expression
      } // end if names
      
    } // end if filters

    // If projections
    if (attributes) {
      const { names, projections, entities, tableAttrs } = parseProjections(attributes,this,entity)     

      if (Object.keys(names).length > 0) {
        // Merge names and add projection expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames,names)
        ProjectionExpression = projections
        EntityProjections = entities
        TableProjections = tableAttrs
      } // end if names

    } // end if projections

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: this.name,
        KeyConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues
      },
      FilterExpression ? { FilterExpression } : null,
      ProjectionExpression ? { ProjectionExpression } : null,
      index ? { IndexName: index } : null,
      limit ? { Limit: String(limit) } : null,
      reverse ? { ScanIndexForward: !reverse } : null,
      consistent ? { ConsistentRead: consistent } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      startKey ? { ExclusiveStartKey: startKey } : null,
      typeof params === 'object' ? params : null
    )

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.query(payload).promise()
      
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {

        return Object.assign(
          result,
          { 
            Items: result.Items.map(item => {
              if (this[item[this.Table.entityField]]) {
                return this[item[this.Table.entityField]].parse(
                  item,
                  // Array.isArray(options.omit) ? options.omit : [],
                  EntityProjections[item[this.Table.entityField]] ? EntityProjections[item[this.Table.entityField]]
                  : TableProjections ? TableProjections
                  : []
                ) 
              } else {
                return item
              }
            })
          },
          // If last evaluated key, return a next function
          result.LastEvaluatedKey ? { 
            next: () => { 
              return this.query(
                pk,
                Object.assign(options, { startKey: result.LastEvaluatedKey }), 
                params
              ) 
            } 
          } : null
        )
      } else {
        return result
      }
    } else {
      return payload
    } // end if-else
  } // end get


  get(entity,item={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].get(item,params)
  }

  delete(entity,item={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].delete(item,params)
  }
  
  update(entity,item={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].update(item,params)
  }

  put(entity,item={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].put(item,params)
  }

} // end Table class

// Export the Table class
module.exports = Table
