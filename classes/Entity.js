'use strict'

// TODO: make sure pks and sks are of correct types

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

// Import error handlers
const { hasValue, error } = require('../lib/utils')


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
    
    // If a Table (note that instanceof doesn't work here)
    if (table.constructor.name === 'Table') {
      
      // If the Entity doesn't exist in the Table, add it
      if (!table._entities.includes(this.name)) {
        table.entities = this

      // If a Table has already been added, throw an error
      } else if (this._table) {
        error(`This entity is already assigned a Table (${table.name})`)
      }

      // Set the Entity's table
      this._table = table
      
      // If an entity tracking field is enabled, add the attribute and the default
      if (table.Table.entityField) {
        this.schema.attributes[table.Table.entityField] = { 
          type: 'string', alias: 'type', default: this.name
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
  get partitionKey() { return this.schema.partitionKey }
  get sortKey() { return this.schema.sortKey }

  // Single attribute getter
  // TODO: is this necessary?
  attribute(attr) {
    return this.Entity.attributes[attr] && this.Entity.attributes[attr].map ? 
      this.Entity.attributes[attr].map
      : this.Entity.attributes[attr] ? attr
      : error(`'${attr}' does not exist or is an invalid alias`)
  }


  // Parses the item
  parse(input,include=[]) {

    // TODO: 'include' needs to handle nested maps?

    // Convert include to roots and de-alias
    include = include.map(attr => {
      const _attr = attr.split('.')[0].split('[')[0]
      return this.schema.attributes[_attr].map || _attr
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
    let payload = this.getSync(item,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = await this.DocumentClient.get(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return this.parse(result,Array.isArray(options.include) ? options.include : [])
      } else {
        return result
      }
    } else {
      return payload
    } // end if-else
  } // end get

  // GET - sync
  getSync(item={},params={}) {
    // Extract schema and merge defaults
    const { schema, defaults, linked, _table } = this
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item),true)

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        Key: getKey(this.DocumentClient)(data,schema.attributes,schema.keys.partitionKey,schema.keys.sortKey)
      },
      typeof params === 'object' ? params : {}
    )  

    return payload
  } // end get


  // DELETE - delete item
  async delete(item={},options={},params={}) {
    // Generate the payload (same as get)
    const payload = await this.getSync(item,params)
    
    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = this.DocumentClient.delete(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return this.parse(result,Array.isArray(options.omit) ? options.omit : [])
      } else {
        return result
      }
    } else {
      return payload
    } // end if-else
  } // end delete

  // DELETE - delete item
  deleteSync(item={},params={}) {
    // Generate the payload (same as get)
    return this.getSync(item,params,{ execute: false })
  } // end delete


  // UPDATE - update item
  update(item={},
    options={},
    {
      SET=[],
      REMOVE=[],
      ADD=[],
      DELETE=[],
      ExpressionAttributeNames={},
      ExpressionAttributeValues={},
      ...params
    } = {}) {

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
    let { schema, defaults, required, linked, _table } = this

    // Initialize validateType with the DocumentClient
    let validateType = validateTypes(this.DocumentClient)

    // Merge defaults
    let data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] && !data[field] && error(`'${field}' is a required field`)
    ) // end required field check

    // Check for partition and sort keys
    let Key = getKey(this.DocumentClient)(data,schema.attributes,schema.partitionKey,schema.sortKey)

    // Init names and values
    let names = {}
    let values = {}

    // Loop through valid fields and add appropriate action
    Object.keys(data).forEach(function(field) {
      let mapping = schema.attributes[field]

      // Remove null or empty fields
      if ((data[field] === null || String(data[field]).trim() === '') && (!mapping.link || mapping.save)) {
        REMOVE.push(`#${field}`)
        names[`#${field}`] = field
      } else if (
        field !== schema.partitionKey
        && field !== schema.sortKey
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

                if (input.$add) {
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

          let value = validateType(mapping,field,data[field],data)

          // It's possible that defaults can purposely return undefined values
          if (hasValue(value)) {
            // Push the update to SET
            SET.push(mapping.default && !item[field] && !mapping.onUpdate ?
              `#${field} = if_not_exists(#${field},:${field})`
              : `#${field} = :${field}`)
            // Add names and values
            names[`#${field}`] = field
            values[`:${field}`] = value
          }
        }

      } // end if null
    })

    // Create the update expression
    const expression = (
      (SET.length > 0 ? 'SET ' + SET.join(', ') : '')
      + (REMOVE.length > 0 ? ' REMOVE ' + REMOVE.join(', ') : '')
      + (ADD.length > 0 ? ' ADD ' + ADD.join(', ') : '')
      + (DELETE.length > 0 ? ' DELETE ' + DELETE.join(', ') : '')
    ).trim()

    // Merge attribute values
    const attr_values = Object.assign(values,ExpressionAttributeValues)

    // Generate the payload
    const payload = Object.assign(
      {
        TableName: _table.name,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(names,ExpressionAttributeNames)
      },
      typeof params === 'object' ? params : {},
      Object.keys(attr_values).length > 0 ? { ExpressionAttributeValues: attr_values } : {}
    ) // end assign

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = this.DocumentClient.update(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return this.parse(result,Array.isArray(options.omit) ? options.omit : [])
      } else {
        return result
      }      
    } else {
      return payload
    } // end if-else
  } // end update


  // PUT - put item
  put(item={},options={},params={}) {
    // Generate the payload
    const payload = this.putSync(item,params)

    // If auto execute enabled
    if (options.execute || (this.autoExecute && options.execute !== false)) {
      const result = this.DocumentClient.put(payload).promise()
      // If auto parse enable
      if (options.parse || (this.autoParse && options.parse !== false)) {
        return this.parse(result,Array.isArray(options.omit) ? options.omit : [])
      } else {
        return result
      }       
    } else {
      return payload
    } // end-if
  } // end put


  // PUT - put item
  putSync(item={},params={}) {
    // Extract schema and defaults
    const { schema, defaults, required, linked, _table } = this

    // Initialize validateType with the DocumentClient
    const validateType = validateTypes(this.DocumentClient)

    // Merge defaults
    const data = normalizeData(this.DocumentClient)(schema.attributes,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] !== undefined && !data[field] && error(`'${field}' is a required field`)
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
          return hasValue(value)
            && (mapping.save === undefined || mapping.save === true)
            && (!mapping.link || (mapping.link && mapping.save === true))
            ? Object.assign(acc, {
              [field]: value
            }) : acc
        },{})
      },
      typeof params === 'object' ? params : {}
    )

    return payload
  } // end putSync


  // Query pass-through (default entity)
  query(pk,options={},params={}) {    
    options.entity = this.name
    return this.table.query(pk,options,params)
  }


  // Allow for instantiation of an Entity type
  // TODO: This needs more thought.
  // item() {
  //   const entity = this.Entity
  //   return new class {
  //     constructor() {
  //       this.type = entity.name
  //       this.entity = entity
  //     } // end

  //     save() {
  //       console.log('saving the item')
        
  //     }
  //   }
  // }

} // end Entity

// Export the Entity class
module.exports = Entity
