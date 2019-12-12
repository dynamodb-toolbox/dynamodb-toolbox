'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const parseModel = require('../lib/parseModel')
const normalizeData = require('../lib/normalizeData')
const formatItem = require('../lib/formatItem')
const validateType = require('../lib/validateType')
const getKey = require('../lib/getKey')
const { hasValue, error } = require('../lib/utils')


class Model {

  constructor(name,model) {
    // TODO: add better validation
    if (typeof model !== 'object' || Array.isArray(model))
      error('Please provide a valid model definition')
    this.Model = parseModel(name,model)
  }

  // returns the model object
  model() {
    return this.Model
  }

  field(field) {
    // console.log(this.model.schema);
    return this.Model.schema[field] && this.Model.schema[field].mapped ? this.Model.schema[field].mapped
      : this.Model.schema[field] ? field
      : error(`'${field}' does not exist or is an invalid alias`)
  }

  partitionKey() { return this.Model.partitionKey }
  sortKey() { return this.Model.sortKey }

  parse(input,omit=[]) {
    // Load the schema
    let { schema, linked } = this.Model

    // Assume standard response from DynamoDB
    let data = input.Item || input.Items || input

    if (Array.isArray(data)) {
      return data.map(item => formatItem(schema,linked,item,omit))
    } else {
      return formatItem(schema,linked,data,omit)
    }
  }

  get(item={},params={}) {
    // Extract schema and merge defaults
    let { schema, defaults, linked, partitionKey, sortKey, table } = this.Model
    let data = normalizeData(schema,linked,Object.assign({},defaults,item),true)

    return Object.assign(
      {
        TableName: table,
        Key: getKey(data,schema,partitionKey,sortKey)
      },
      typeof params === 'object' ? params : {}
    )
  }

  delete(item={},params={}) {
    return this.get(item,params)
  }

  // Generate update expression
  update(item={},
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
    let { schema, defaults, required, linked, partitionKey, sortKey, table } = this.Model

    // Merge defaults
    let data = normalizeData(schema,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] && !data[field] && error(`'${field}' is a required field`)
    ) // end required field check

    // Check for partition and sort keys
    let Key = getKey(data,schema,partitionKey,sortKey)

    // Init names and values
    let names = {}
    let values = {}

    // Loop through valid fields and add appropriate action
    Object.keys(data).forEach(function(field) {
      let mapping = schema[field]

      // Remove null or empty fields
      if ((data[field] === null || String(data[field]).trim() === '') && (!mapping.link || mapping.save)) {
        REMOVE.push(`#${field}`)
        names[`#${field}`] = field
      } else if (
        field !== partitionKey
        && field !== sortKey
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
    let expression = (
      (SET.length > 0 ? 'SET ' + SET.join(', ') : '')
      + (REMOVE.length > 0 ? ' REMOVE ' + REMOVE.join(', ') : '')
      + (ADD.length > 0 ? ' ADD ' + ADD.join(', ') : '')
      + (DELETE.length > 0 ? ' DELETE ' + DELETE.join(', ') : '')
    ).trim()


    let attr_values = Object.assign(values,ExpressionAttributeValues)

    // Return the parameters
    return Object.assign(
      {
        TableName: table,
        Key,
        UpdateExpression: expression,
        ExpressionAttributeNames: Object.assign(names,ExpressionAttributeNames)
      },
      typeof params === 'object' ? params : {},
      Object.keys(attr_values).length > 0 ? { ExpressionAttributeValues: attr_values } : {}
    ) // end assign

  } // end update

  put(item={},params={}) {
    // Extract schema and defaults
    let { schema, defaults, required, linked, partitionKey, sortKey, table } = this.Model

    // Merge defaults
    let data = normalizeData(schema,linked,Object.assign({},defaults,item))

    // Check for required fields
    Object.keys(required).forEach(field =>
      required[field] !== undefined && !data[field] && error(`'${field}' is a required field`)
    ) // end required field check

    // Checks for partition and sort keys
    getKey(data,schema,partitionKey,sortKey)

    // Loop through valid fields and add appropriate action
    return Object.assign(
      {
        TableName: table,
        Item: Object.keys(data).reduce((acc,field) => {
          let mapping = schema[field]
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
  }

} // end Model

module.exports = Model
