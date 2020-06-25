'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// Import parseEntity 
const parseEntity = require('../lib/parseEntity')

// Import additional libraries
const validateTypes = require('../lib/validateTypes')
const normalizeData = require('../lib/normalizeData')
const formatItem = require('../lib/formatItem')
const getKey = require('../lib/getKey')
const parseConditions = require('../lib/expressionBuilder')
const parseProjections = require('../lib/projectionBuilder')

// Import error handlers
const { error, transformAttr } = require('../lib/utils')

// Declare Entity class
class Entity {

  // Declare constructor (entity config)
  constructor(entity) {

    // Sanity check the entity object
    if (typeof entity !== 'object' || Array.isArray(entity))
      error('Please provide a valid entity definition')
 
    // Parse the entity and merge into this
    Object.assign(this,parseEntity(entity))
    
  } // end construcor


  // Set the Entity's Table
  set table(table) {
    
    // If a Table
    if (table.Table && table.Table.attributes) {
      
      // If this Entity already has a Table, throw an error
      if (this._table) {
        error(`This entity is already assigned a Table (${this._table.name})`)
      // Else if the Entity doesn't exist in the Table, add it
      } else if (!table.entities.includes(this.name)) {
        table.entities = this
      } 

      // Set the Entity's table
      this._table = table
      
      // If an entity tracking field is enabled, add the attribute and the default
      if (table.Table.entityField) {
        this.schema.attributes[table.Table.entityField] = { 
          type: 'string', alias: 'entity', default: this.name
        }
        this.defaults[table.Table.entityField] = this.name
      } // end if entity tracking
    
    // Throw an error if not a valid Table
    } else {
      error('Invalid Table')
    }

  } // end set table


  // Returns the Entity's Table
  get table() {
    if (this._table) {
      return this._table
    } else {
      return error(`The '${this.name}' entity must be attached to a Table to perform this operation`)
    }
  }


  // Return reference to the DocumentClient
  get DocumentClient() {
    if (this.table.DocumentClient) {
      return this.table.DocumentClient
    } else {
      return error('DocumentClient required for this operation')
    }
  }


  // Sets the auto execute mode (default to true)
  set autoExecute(val) { this._execute = typeof val === 'boolean' ? val : undefined }

  // Gets the current auto execute mode
  get autoExecute() { 
    return typeof this._execute === 'boolean' ? this._execute
      : typeof this.table.autoExecute === 'boolean' ? this.table.autoExecute
      : true
  }

  // Sets the auto parse mode (default to true)
  set autoParse(val) { this._parse = typeof val === 'boolean' ? val : undefined }

  // Gets the current auto execute mode
  get autoParse() {
    return typeof this._parse === 'boolean' ? this._parse
      : typeof this.table.autoParse === 'boolean' ? this.table.autoParse
      : true
  }

  // Primary key getters
  get partitionKey() {   
    return this.schema.keys.partitionKey ? 
      this.attribute(this.schema.keys.partitionKey) 
      : error(`No partitionKey defined`)
  }
  get sortKey() { 
    return this.schema.keys.sortKey ? 
      this.attribute(this.schema.keys.sortKey) 
      : null
  }

  // Get mapped attribute name
  attribute(attr) {
    return this.schema.attributes[attr] && this.schema.attributes[attr].map ? 
      this.schema.attributes[attr].map
      : this.schema.attributes[attr] ? attr
      : error(`'${attr}' does not exist or is an invalid alias`)
  } // end attribute


  // Parses the item
  parse(input,include=[]) {

    // TODO: 'include' needs to handle nested maps?

    // Convert include to roots and de-alias
    include = include.map(attr => {
      const _attr = attr.split('.')[0].split('[')[0]
      return (this.schema.attributes[_attr] && this.schema.attributes[_attr].map) || _attr
    })

    // Load the schema
    const { schema, linked } = this
    
    // Assume standard response from DynamoDB
    const data = input.Item || input.Items || input

    if (Array.isArray(data)) {
      return data.map(item => formatItem(this.DocumentClient)(schema.attributes,linked,item,include))
    } else {
      return formatItem(this.DocumentClient)(schema.attributes,linked,data,include)
    }
  } // end parse


  // GET - get item
  async get(item={},options={},params={}) {
    // Generate the payload
    const payload = this.getParams(item,options,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.get(payload).promise()    
        
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Item ? { Item: this.parse(result.Item,Array.isArray(options.include) ? options.include : []) } : null
        )
      } else {
        return result
      }
    } else {
      return payload
    } // end if-else
  } // end get


  // Shortcut for batch operations
  getBatch(item={}) {
    return { 
      Table: this.table, 
      Key: this.getParams(item).Key
    }
  }

  // Generate GET parameters
  getParams(item={},options={},params={}) {
    // Extract schema and merge defaults
    const { schema, defaults, linked, _table } = this
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item),true)

    const {
      consistent, // ConsistentRead (boolean)
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      attributes, // Projections
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid get options: ${args.join(', ')}`)

    // Verify consistent read
    if (consistent !== undefined && typeof consistent !== 'boolean')
      error(`'consistent' requires a boolean`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
    
    let ExpressionAttributeNames // init ExpressionAttributeNames
    let ProjectionExpression // init ProjectionExpression

    // If projections
    if (attributes) {
      const { names, projections } = parseProjections(attributes,this.table,this.name)

      if (Object.keys(names).length > 0) {
        // Merge names and add projection expression
        ExpressionAttributeNames = names
        ProjectionExpression = projections
      } // end if names

    } // end if projections

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        Key: getKey(this.DocumentClient)(data,schema.attributes,schema.keys.partitionKey,schema.keys.sortKey)
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      ProjectionExpression ? { ProjectionExpression } : null,
      consistent ? { ConsistentRead: consistent } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      typeof params === 'object' ? params : {}
    )  

    return payload
  } // end getParams


  // DELETE - delete item
  async delete(item={},options={},params={}) {

    const payload = this.deleteParams(item,options,params)
    
    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.delete(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes ? { Attributes: this.parse(result.Attributes,Array.isArray(options.include) ? options.include : []) } : null
        )
      } else {
        return result
      }
    } else {
      return payload
    } // end if-else
  } // end delete

  // Shortcut for batch operations
  deleteBatch(item={}) {
    const payload = this.deleteParams(item)
    return { [payload.TableName] : { DeleteRequest: { Key: payload.Key } } }
  }

  // Generate DELETE parameters
  deleteParams(item={},options={},params={}) {
    // Extract schema and merge defaults
    const { schema, defaults, linked, _table } = this
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item),true)

    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid delete options: ${args.join(', ')}`)
    
    // Verify metrics
    if (metrics !== undefined
      && (typeof metrics !== 'string' || !['NONE','SIZE'].includes(metrics.toUpperCase())))
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Verify returnValues
    if (returnValues !== undefined
      && (typeof returnValues !== 'string' 
      || !['NONE', 'ALL_OLD'].includes(returnValues.toUpperCase())))
      error(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`)
    
    let ExpressionAttributeNames // init ExpressionAttributeNames
    let ExpressionAttributeValues // init ExpressionAttributeValues
    let ConditionExpression // init ConditionExpression

    // If conditions
    if (conditions) {
      
      // Parse the conditions
      const {
        expression,
        names,
        values
      } = parseConditions(conditions,this.table,this.name)

      if (Object.keys(names).length > 0) {

        // TODO: alias attribute field names        
        // Merge names and values and add condition expression
        ExpressionAttributeNames = names
        ExpressionAttributeValues = values
        ConditionExpression = expression
      } // end if names
      
    } // end if filters

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        Key: getKey(this.DocumentClient)(data,schema.attributes,schema.keys.partitionKey,schema.keys.sortKey)
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      ExpressionAttributeValues ? { ExpressionAttributeValues } : null,
      ConditionExpression ? { ConditionExpression } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null,
      typeof params === 'object' ? params : {}
    )

    return payload
  } // end deleteParams


  // UPDATE - update item
  async update(item={},options={},params = {}) {

    // Generate the payload
    const payload = this.updateParams(item,options,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.update(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes ? { Attributes: this.parse(result.Attributes,Array.isArray(options.include) ? options.include : []) } : null
        )
      } else {
        return result
      }      
    } else {
      return payload
    } // end if-else
  } // end delete

  // Generate UPDATE Parameters
  updateParams(
    item={},
    options={},
    {
      SET=[],
      REMOVE=[],
      ADD=[],
      DELETE=[],
      ExpressionAttributeNames={},
      ExpressionAttributeValues={},
      ...params
    } = {}
  ) {

    // Validate operation types
    if (!Array.isArray(SET)) error('SET must be an array')
    if (!Array.isArray(REMOVE)) error('REMOVE must be an array')
    if (!Array.isArray(ADD)) error('ADD must be an array')
    if (!Array.isArray(DELETE)) error('DELETE must be an array')

    // Validate attribute names and values
    if (typeof ExpressionAttributeNames !== 'object'
      || Array.isArray(ExpressionAttributeNames))
      error('ExpressionAttributeNames must be an object')
    if (typeof ExpressionAttributeValues !== 'object'
      || Array.isArray(ExpressionAttributeValues))
      error('ExpressionAttributeValues must be an object')
    // if (ConditionExpression && typeof ConditionExpression !== 'string')
    //     error(`ConditionExpression must be a string`)

    // Extract schema and defaults
    const { schema, defaults, required, linked, _table } = this  

    // Initialize validateType with the DocumentClient
    const validateType = validateTypes(this.DocumentClient)

    // Merge defaults
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item))    

    // Extract valid options
    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid update options: ${args.join(', ')}`)
    
    // Verify metrics
    if (metrics !== undefined
      && (typeof metrics !== 'string' || !['NONE','SIZE'].includes(metrics.toUpperCase())))
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Verify returnValues
    if (returnValues !== undefined
      && (typeof returnValues !== 'string' 
      || !['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'].includes(returnValues.toUpperCase())))
      error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`)
    
    let ConditionExpression // init ConditionExpression

    // If conditions
    if (conditions) {
      
      // Parse the conditions
      const {
        expression,
        names,
        values
      } = parseConditions(conditions,this.table,this.name)

      if (Object.keys(names).length > 0) {

        // TODO: alias attribute field names        
        // Add names, values and condition expression
        ExpressionAttributeNames = Object.assign(ExpressionAttributeNames,names)
        ExpressionAttributeValues = Object.assign(ExpressionAttributeValues,values)
        ConditionExpression = expression
      } // end if names
      
    } // end if conditions


    // Check for required fields
    Object.keys(required).forEach(field => {
      let value = data[field]
      if(!value) {
        let fieldDefinition = schema.attributes[field]
        if(fieldDefinition.map) {
          value = data[fieldDefinition.map]
        }
      }
      required[field] && !value && error(`'${field}' is a required field`)
    }) // end required field check
    
    // Get partition and sort keys
    const Key = getKey(this.DocumentClient)(data,schema.attributes,schema.keys.partitionKey,schema.keys.sortKey)

    // Init names and values
    const names = {}
    const values = {}


    // Loop through valid fields and add appropriate action
    Object.keys(data).forEach((field) => {
      const mapping = schema.attributes[field]

      // Remove attributes
      if (field === '$remove') {
        const attrs = Array.isArray(data[field]) ? data[field] : [data[field]]
        for (const i in attrs) {
          // Verify attribute
          if (!schema.attributes[attrs[i]])
            error(`'${attrs[i]}' is not a valid attribute and cannot be removed`)
          // Verify attribute is not a pk/sk
          if (schema.attributes[attrs[i]].partitionKey === true || schema.attributes[attrs[i]].sortKey === true)
            error(`'${attrs[i]}' is the ${schema.attributes[attrs[i]].partitionKey === true ? 'partitionKey' : 'sortKey' } and cannot be removed`)
          // Grab the attribute name and add to REMOVE and names
          const attr = schema.attributes[attrs[i]].map || attrs[i]        
          REMOVE.push(`#${attr}`)
          names[`#${attr}`] = attr
        } // end for
      } else if (this._table._removeNulls === true && (data[field] === null || String(data[field]).trim() === '') && (!mapping.link || mapping.save)) {
        REMOVE.push(`#${field}`)
        names[`#${field}`] = field
      } else if (
        !mapping.partitionKey
        && !mapping.sortKey
        && (mapping.save === undefined || mapping.save === true)
        && (!mapping.link || (mapping.link && mapping.save === true))
      ) {
        // If a number or a set and adding
        if (['number','set'].includes(mapping.type) && data[field].$add) {
          ADD.push(`#${field} :${field}`)
          values[`:${field}`] = validateType(mapping,field,data[field].$add,data)
          // Add field to names
          names[`#${field}`] = field
        // if a set and deleting items
        } else if (mapping.type === 'set' && data[field].$delete) {
          DELETE.push(`#${field} :${field}`)
          values[`:${field}`] = validateType(mapping,field,data[field].$delete,data)
          // Add field to names
          names[`#${field}`] = field
        // if a list and removing items by index
        } else if (mapping.type === 'list' && Array.isArray(data[field].$remove)) {
          data[field].$remove.forEach(i => {
            if (typeof i !== 'number') error(`Remove array for '${field}' must only contain numeric indexes`)
            REMOVE.push(`#${field}[${i}]`)
          })
          // Add field to names
          names[`#${field}`] = field
        // if list and appending or prepending
        } else if (mapping.type === 'list' && (data[field].$append || data[field].$prepend)) {
          if (data[field].$append) {
            SET.push(`#${field} = list_append(#${field},:${field})`)
            values[`:${field}`] = validateType(mapping,field,data[field].$append,data)
          } else {
            SET.push(`#${field} = list_append(:${field},#${field})`)
            values[`:${field}`] = validateType(mapping,field,data[field].$prepend,data)
          }
          // Add field to names
          names[`#${field}`] = field
        // if a list and updating by index
        } else if (mapping.type === 'list' && !Array.isArray(data[field]) && typeof data[field] === 'object') {
          Object.keys(data[field]).forEach(i => {
            if (String(parseInt(i)) !== i) error(`Properties must be numeric to update specific list items in '${field}'`)
            SET.push(`#${field}[${i}] = :${field}_${i}`)
            values[`:${field}_${i}`] = data[field][i]
          })
          // Add field to names
          names[`#${field}`] = field
        // if a map and updating by nested attribute/index
        } else if (mapping.type === 'map' && data[field].$set) {
          Object.keys(data[field].$set).forEach(f => {

            // TODO: handle null values to remove

            let props = f.split('.')
            let acc = [`#${field}`]
            props.forEach((prop,i) => {
              let id = `${field}_${props.slice(0,i+1).join('_')}`
              // Add names and values
              names[`#${id.replace(/\[(\d+)\]/,'')}`] = prop.replace(/\[(\d+)\]/,'')
              // if the final prop, add the SET and values
              if (i === props.length-1) {
                let input = data[field].$set[f]
                let path = `${acc.join('.')}.#${id}`
                let value = `${id.replace(/\[(\d+)\]/,'_$1')}`

                if (input === undefined) {
                  REMOVE.push(`${path}`)
                } else if (input.$add) {
                  ADD.push(`${path} :${value}`)
                  values[`:${value}`] = input.$add
                } else if (input.$append) {
                  SET.push(`${path} = list_append(${path},:${value})`)
                  values[`:${value}`] = input.$append
                } else if (input.$prepend) {
                  SET.push(`${path} = list_append(:${value},${path})`)
                  values[`:${value}`] = input.$prepend
                } else if (input.$remove) {
                  // console.log('REMOVE:',input.$remove);
                  input.$remove.forEach(i => {
                    if (typeof i !== 'number') error(`Remove array for '${field}' must only contain numeric indexes`)
                    REMOVE.push(`${path}[${i}]`)
                  })
                } else {
                  SET.push(`${path} = :${value}`)
                  values[`:${value}`] = input
                }


                if (input.$set) {
                  Object.keys(input.$set).forEach(i => {
                    if (String(parseInt(i)) !== i) error(`Properties must be numeric to update specific list items in '${field}'`)
                    SET.push(`${path}[${i}] = :${value}_${i}`)
                    values[`:${value}_${i}`] = input.$set[i]
                  })
                }


              } else {
                acc.push(`#${id.replace(/\[(\d+)\]/,'')}`)
              }
            })
          })
          // Add field to names
          names[`#${field}`] = field
        // else add to SET
        } else {
          let value = transformAttr(mapping,validateType(mapping,field,data[field],data),data)

          // It's possible that defaults can purposely return undefined values
          // if (hasValue(value)) {
          if (value !== undefined) {
            // Push the update to SET
            SET.push(mapping.default && !item[field] && !mapping.onUpdate ?
              `#${field} = if_not_exists(#${field},:${field})`
              : `#${field} = :${field}`)
            // Add names and values
            names[`#${field}`] = field
            values[`:${field}`] = value
          }
        }

      } // end if undefined
    })

    // Create the update expression
    const expression = (
      (SET.length > 0 ? 'SET ' + SET.join(', ') : '')
      + (REMOVE.length > 0 ? ' REMOVE ' + REMOVE.join(', ') : '')
      + (ADD.length > 0 ? ' ADD ' + ADD.join(', ') : '')
      + (DELETE.length > 0 ? ' DELETE ' + DELETE.join(', ') : '')
    ).trim()

    // Merge attribute values
    ExpressionAttributeValues = Object.assign(values,ExpressionAttributeValues)

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(names,ExpressionAttributeNames)
      },
      typeof params === 'object' ? params : {},
      Object.keys(ExpressionAttributeValues).length > 0 ? { ExpressionAttributeValues } : {},
      ConditionExpression ? { ConditionExpression } : {},
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null,
    ) // end assign
    
    return payload

    // TODO: Check why primary/secondary GSIs are using if_not_exists

  } // end updateParams


  // PUT - put item
  async put(item={},options={},params={}) {
    // Generate the payload
    const payload = this.putParams(item,options,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.put(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return Object.assign(
          result,
          result.Attributes ? { Attributes: this.parse(result.Attributes,Array.isArray(options.include) ? options.include : []) } : null
        )
      } else {
        return result
      }       
    } else {
      return payload
    } // end-if
  } // end put

  // Shortcut for batch operations
  putBatch(item={}) {
    const payload = this.putParams(item)
    return { [payload.TableName] : { PutRequest: { Item: payload.Item } } }
  }

  // Generate PUT Parameters
  putParams(item={},options={},params={}) {
    // Extract schema and defaults
    const { schema, defaults, required, linked, _table } = this

    // Initialize validateType with the DocumentClient
    const validateType = validateTypes(this.DocumentClient)

    // Merge defaults
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item))

    // Extract valid options
    const {
      conditions, // ConditionExpression
      capacity, // ReturnConsumedCapacity (none, total, or indexes)
      metrics, // ReturnItemCollectionMetrics: (size or none)
      returnValues, // Return Values (none, all_old, updated_old, all_new, updated_new)
      ..._args
    } = options

    // Remove other valid options from options
    const args = Object.keys(_args).filter(x => !['execute','parse'].includes(x))

    // Error on extraneous arguments
    if (args.length > 0)
      error(`Invalid put options: ${args.join(', ')}`)
    
    // Verify metrics
    if (metrics !== undefined
      && (typeof metrics !== 'string' || !['NONE','SIZE'].includes(metrics.toUpperCase())))
      error(`'metrics' must be one of 'NONE' OR 'SIZE'`)

    // Verify capacity
    if (capacity !== undefined
      && (typeof capacity !== 'string' || !['NONE','TOTAL','INDEXES'].includes(capacity.toUpperCase())))
      error(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)

    // Verify returnValues
    // TODO: Check this, conflicts with dynalite
    if (returnValues !== undefined
      && (typeof returnValues !== 'string' 
      || !['NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', 'UPDATED_NEW'].includes(returnValues.toUpperCase())))
      error(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', or 'UPDATED_NEW'`)
    
    let ExpressionAttributeNames // init ExpressionAttributeNames
    let ExpressionAttributeValues // init ExpressionAttributeValues
    let ConditionExpression // init ConditionExpression

    // If conditions
    if (conditions) {
      
      // Parse the conditions
      const {
        expression,
        names,
        values
      } = parseConditions(conditions,this.table,this.name)

      if (Object.keys(names).length > 0) {

        // TODO: alias attribute field names        
        // Add names, values and condition expression
        ExpressionAttributeNames = names
        ExpressionAttributeValues = values
        ConditionExpression = expression
      } // end if names
      
    } // end if filters


    // Check for required fields
    Object.keys(required).forEach(field => {
      let value = data[field]
      if(!value) {
        let fieldDefinition = schema.attributes[field]
        if(fieldDefinition.map) {
          value = data[fieldDefinition.map]
        }
      }
      required[field] !== undefined && !value && error(`'${field}' is a required field`)
    }
    ) // end required field check

    // Checks for partition and sort keys
    getKey(this.DocumentClient)(data,schema.attributes,schema.keys.partitionKey,schema.keys.sortKey)

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        // Loop through valid fields and add appropriate action
        Item: Object.keys(data).reduce((acc,field) => {
          let mapping = schema.attributes[field]
          let value = validateType(mapping,field,data[field],data)
          return value !== undefined
            && (mapping.save === undefined || mapping.save === true)
            && (!mapping.link || (mapping.link && mapping.save === true))
            && (!_table._removeNulls || (_table._removeNulls && value !== null))
            ? Object.assign(acc, {
              [field]: transformAttr(mapping,value,data)
            }) : acc
        },{})
      },
      ExpressionAttributeNames ? { ExpressionAttributeNames } : null,
      ExpressionAttributeValues ? { ExpressionAttributeValues } : null,
      ConditionExpression ? { ConditionExpression } : null,
      capacity ? { ReturnConsumedCapacity: capacity.toUpperCase() } : null,
      metrics ? { ReturnItemCollectionMetrics: metrics.toUpperCase() } : null,
      returnValues ? { ReturnValues: returnValues.toUpperCase() } : null,
      typeof params === 'object' ? params : {}
    )

    return payload
  } // end putParams


  // Query pass-through (default entity)
  query(pk,options={},params={}) {    
    options.entity = this.name
    return this.table.query(pk,options,params)
  }

  // Scan pass-through (default entity)
  scan(options={},params={}) {    
    options.entity = this.name
    return this.table.scan(options,params)
  }


} // end Entity

// Export the Entity class
module.exports = Entity
