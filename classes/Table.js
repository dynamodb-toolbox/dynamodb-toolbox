'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// TODO: Check duplicate entity names code

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
      // Automatically set convertEmptyValues to true, unless false
      if (docClient.options.convertEmptyValues !== false)
        docClient.options.convertEmptyValues = true
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

                // Make sure the table index contains the defined key types
                if (!this.Table.indexes[key][keyType])
                  error(`${entity.name} contains a ${keyType}, but it is not used by ${key}`)


                // If the attribute's name doesn't match the indexes attribute name
                if (attr[keyType] !== this.Table.indexes[key][keyType]) {
                  // If the indexes attribute name does not conflict with another entity attribute
                  if (!entity.schema.attributes[this.Table.indexes[key][keyType]]) {

                    // If there is already a mapping for this attribute, make sure they match
                    if (entity.schema.attributes[attr[keyType]].map
                      && entity.schema.attributes[attr[keyType]].map !== this.Table.indexes[key][keyType])
                      error(`${key}'s ${keyType} cannot map to the '${attr[keyType]}' alias because it is already mapped to another table attribute`)

                    // Add the index attribute using the same config and add alias
                    entity.schema.attributes[this.Table.indexes[key][keyType]] = Object.assign(
                      {},
                      entity.schema.attributes[attr[keyType]],
                      { alias: attr[keyType] }
                    ) // end assign
                    // Add a map from the attribute to the new index attribute
                    entity.schema.attributes[attr[keyType]].map = this.Table.indexes[key][keyType]
                  } else {
                    const config = entity.schema.attributes[this.Table.indexes[key][keyType]]
                    
                    // If the existing attribute isn't used by this index
                    if (
                      (!config.partitionKey && !config.sortKey)
                      || (config.partitionKey && !config.partitionKey.includes(key))
                      || (config.sortKey && !config.sortKey.includes(key))
                    ) {
                      error(`${key}'s ${keyType} name (${this.Table.indexes[key][keyType]}) conflicts with another Entity attribute name`)
                    } // end if
                  } // end if-else
                } // end if
              } // end for

              // Check that composite keys define both keys
              if (this.Table.indexes[key].partitionKey && this.Table.indexes[key].sortKey
                && (
                  !entity.schema.attributes[this.Table.indexes[key].partitionKey]
                  || !entity.schema.attributes[this.Table.indexes[key].sortKey]
                )) {
                error(`${key} requires mappings for both the partitionKey and the sortKey`)
              }
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

  async query(pk,options={},params={}) {
  
    // Generate query parameters with projection data
    const { 
      payload,
      EntityProjections,
      TableProjections 
    } = this.generateQueryParams(pk,options,params,true)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.query(payload).promise()
      
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {

        return Object.assign(
          result,
          { 
            Items: result.Items && result.Items.map(item => {
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
  }



  // Query the table
  generateQueryParams(pk,options={},params={},projections=false) { 
    
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

    // Verify select
    // TODO: Make dependent on whether or not an index is supplied
    if (select !== undefined
      && (typeof select !== 'string' 
      || !['ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', 'COUNT'].includes(select.toUpperCase())))
      error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`)

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
      const { names, projections, entities, tableAttrs } = parseProjections(attributes,this,entity,true)     

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
      select ? { Select: select.toUpperCase() } : null,
      startKey ? { ExclusiveStartKey: startKey } : null,
      typeof params === 'object' ? params : null
    )

    return projections ? { payload, EntityProjections, TableProjections } : payload
  } // end query



  async scan(options={},params={}) {
  
    // Generate query parameters with projection data
    const { 
      payload,
      EntityProjections,
      TableProjections 
    } = this.generateScanParams(options,params,true)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.scan(payload).promise()
      
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {

        return Object.assign(
          result,
          { 
            Items: result.Items && result.Items.map(item => {
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
              return this.scan(
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
  }



  // Scan the table
  generateScanParams(options={},params={},projections=false) { 
      
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
      ..._args // capture extra arguments
    } = options
    
    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid scan options: ${args.join(', ')}`)

    // Verify index
    if (index !== undefined && !this.Table.indexes[index])
      error(`'${index}' is not a valid index name`)

    // Verify limit
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0))
      error(`'limit' must be a positive integer`)

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== 'boolean')
      error(`'consistent' requires a boolean`)

    // Verify select
    // TODO: Make dependent on whether or not an index is supplied
    if (select !== undefined
      && (typeof select !== 'string' 
      || !['ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', 'COUNT'].includes(select.toUpperCase())))
      error(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`)

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

    // Verify consistent segments
    if (segments !== undefined && (!Number.isInteger(segments) || segments < 1))
      error(`'segments' must be an integer greater than 1`)

    if (segment !== undefined && (!Number.isInteger(segment) || segment < 0 || segment >= segments))
      error(`'segment' must be an integer greater than or equal to 0 and less than the total number of segments`)

    if ((segments !== undefined && segment === undefined) || (segments === undefined && segment !== undefined))
      error(`Both 'segments' and 'segment' must be provided`)

    // Default names and values
    let ExpressionAttributeNames = {}
    let ExpressionAttributeValues = {}
    let FilterExpression // init FilterExpression
    let ProjectionExpression // init ProjectionExpression
    let EntityProjections = {}
    let TableProjections = []

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
      const { names, projections, entities, tableAttrs } = parseProjections(attributes,this,entity,true)     

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
      typeof params === 'object' ? params : null
    )

    return projections ? { payload, EntityProjections, TableProjections } : payload
  } // end query





  // PUT - put item
  async batchGet(items,options={},params={}) {
    // Generate the payload
    const payload = this.generateBatchGetParams(items,options,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.batchGet(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes ? { Attributes: this.parse(result.Attributes,Array.isArray(options.omit) ? options.omit : []) } : null
        )
      } else {
        return result
      }       
    } else {
      return payload
    } // end-if
  } // end put





  generateBatchGetParams(_items,options={}) {

    let items = Array.isArray(_items) ? _items : [_items]

    const {
      capacity,
      ..._args
    } = options
  
    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid batchGet options: ${args.join(', ')}`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Init RequestItems
    const RequestItems = {}
    
    // Loop through items
    for (const i in items) {
      const item = items[i]
      let Keys = []
      
      // Item must be an object
      if (typeof item === 'object' && !Array.isArray(item)) {
        
        // Extract known parameters
        let {
          table, // table object
          keys, // array of keys
          consistent, // boolean for ConsistentRead
          attributes, // Projections
          entity, // entity name
          ...args
        } = item   

        // If table supplied, verify, else default to current table
        if (table !== undefined) {
          if (table.constructor.name !== 'Table')
            error(`'table' requires a valid Table object`)
        } else {
          table = this
        }
         
        // Verify consistent read
        if (consistent !== undefined && typeof consistent !== 'boolean')
          error(`'consistent' requires a boolean`)

        // Verify entity, set default for this table
        if (entity !== undefined) {
          if (typeof entity !== 'string' || (!table[entity] || table[entity].constructor.name !== 'Entity'))
            error(`'entity' value of '${entity}' must be a string and a valid table Entity name`)
        } else if (table.name === this.name) {
          // entity = this.name
        }

        let ExpressionAttributeNames // init ExpressionAttributeNames
        let ProjectionExpression // init ProjectionExpression
        let EntityProjections
        let TableProjections
    
        // If projections
        if (attributes) {
          const { names, projections, entities, tableAttrs } = parseProjections(attributes,table)
    
          if (Object.keys(names).length > 0) {
            // Merge names and add projection expression
            ExpressionAttributeNames = names
            ProjectionExpression = projections
            EntityProjections = entities
            TableProjections = tableAttrs
          } // end if names
    
        } // end if projections

        // Error if extra arguments are provided along with keys
        if (keys !== undefined && Object.keys(args).length > 0)
          error(`Invalid options when specifying 'keys': ${args.join(', ')}`)
        
        // If no keys, convert extra args to a keys array
        if (keys === undefined) keys = [ { entity, ...args }]        

        // Process keys
        if (Array.isArray(keys)) {
          // Loop through keys
          for (const x in keys) {
            // Extract entity (if provided) and remaining attributes
            let { 
              entity: _entity,
              ...keyMap
            } = keys[x]

            // Inherit entity
            const ent = _entity || entity

            // Track key combos
            let primaryKey = {}

            // Loop through the remaining attributes and check if a pk/sk
            for (const attr in keyMap) {
              
              // Load the schema for entity, or default to table
              const schema = ent ? table[ent].schema.attributes : table.Table.attributes

              // Merge keys into the primary Key
              primaryKey = Object.assign(
                primaryKey,
                { 
                  [(schema[attr] && (schema[attr].partitionKey || schema[attr].sortKey || table.Table.partitionKey === attr || table.Table.sortKey === attr)) ? schema[attr].map || attr
                  : error(`'${attr}' is not a valid partition or sort key`)]: keyMap[attr]
                }
              )
            } // end for keyMap

            // Push primaryKey onto Keys
            Keys.push(primaryKey)

          } // end for loop

        } else {
          error(`'keys' must be an array of objects`)
        }

        // test
        // console.log('EntityProjections:', EntityProjections)
        // console.log('TableProjections:', TableProjections)
        

        // Create the table in the Request Item if it doesn't exist
        if (!RequestItems[table.name]) {

          // Merge keys, fail on dupe configs
          RequestItems[table.name] = Object.assign(
            { Keys },
            // Prevent multiple table definitons with more than just Keys
            consistent ? { ConsistentRead: consistent } : null,
            ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
            ProjectionExpression ? { ProjectionExpression } : null
          )
        } else {
          if (consistent || attributes) { error(`Only one configuration object per table is allowed`) }
          RequestItems[table.name].Keys = RequestItems[table.name].Keys.concat(Keys)
        } // end if table exists

      // Else, throw an error
      } else {
        error(`Invalid input, batchGet accepts and array of objects`)
      }

    } // end loop

    const payload = Object.assign(
      { RequestItems },
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null
    )


    return payload
  } // generateBatchGetParams










  // Entity operation references
  get(entity,item={},options={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].get(item,options,params)
  }

  delete(entity,item={},options={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].delete(item,options,params)
  }
  
  update(entity,item={},options={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].update(item,options,params)
  }

  put(entity,item={},options={},params={}) {
    if (!this[entity]) error(`'${entity}' is not a valid Entity`)
    return this[entity].put(item,options,params)
  }

} // end Table class

// Export the Table class
module.exports = Table
